import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../generated/prisma/enums';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;
  private readonly REFRESH_TOKEN_BYTES = 64;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ──────────────────────────────────────────
  // REGISTER
  // ──────────────────────────────────────────

  async register(dto: RegisterDto) {
    // Check allowed email domain if configured
    const allowedDomain = this.config.get<string>('ALLOWED_EMAIL_DOMAIN');
    if (allowedDomain) {
      const domain = dto.email.split('@')[1];
      if (domain !== allowedDomain) {
        throw new BadRequestException(
          `Registration is restricted to @${allowedDomain} email addresses`,
        );
      }
    }

    // Check duplicate email
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        authId: uuidv4(),
        email: dto.email,
        name: dto.name,
        year: dto.year,
        passwordHash,
        role: UserRole.STUDENT,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        year: true,
        createdAt: true,
      },
    });

    this.logger.log(`New user registered: ${user.email}`);

    // Issue tokens
    const tokens = await this.issueTokens(user.id, user.email, user.role);

    return { user, ...tokens };
  }

  // ──────────────────────────────────────────
  // LOGIN
  // ──────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`User logged in: ${user.email}`);

    const tokens = await this.issueTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  // ──────────────────────────────────────────
  // REFRESH
  // ──────────────────────────────────────────

  async refresh(rawRefreshToken: string) {
    // Hash the incoming token for lookup
    const tokenHash = this.hashToken(rawRefreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });

    const tokens = await this.issueTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role,
    );

    return tokens;
  }

  // ──────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────

  async logout(userId: string, rawRefreshToken?: string) {
    if (rawRefreshToken) {
      // Revoke specific token
      const tokenHash = this.hashToken(rawRefreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { token: tokenHash, userId },
        data: { isRevoked: true },
      });
    } else {
      // Revoke ALL user tokens (logout everywhere)
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }
  }

  // ──────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────

  private async issueTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.secret'),
      expiresIn: this.config.get<string>('jwt.expiresIn', '7d'),
    });

    // Generate a cryptographically secure refresh token
    const rawRefreshToken = crypto.randomBytes(this.REFRESH_TOKEN_BYTES).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const refreshExpiryDays = 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshExpiryDays);

    await this.prisma.refreshToken.create({
      data: {
        token: tokenHash,
        userId,
        expiresAt,
      },
    });

    // Clean up expired tokens for this user (housekeeping)
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true },
        ],
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: this.config.get<string>('jwt.expiresIn', '7d'),
    };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
