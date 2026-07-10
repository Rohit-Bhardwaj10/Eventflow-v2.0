import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from '../generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Get user by ID ────────────────────────────────────────────────────────

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        year: true,
        interests: true,
        role: true,
        collegeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ─── Update own profile ─────────────────────────────────────────────────────

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findById(userId); // ensure exists
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.year !== undefined && { year: dto.year }),
        ...(dto.interests !== undefined && { interests: dto.interests }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        year: true,
        interests: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  // ─── Get user's club memberships ────────────────────────────────────────────

  async getUserClubs(userId: string) {
    await this.findById(userId);
    return this.prisma.clubMember.findMany({
      where: { userId },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            logo: true,
            category: true,
            status: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  // ─── Get user's event registrations ────────────────────────────────────────

  async getUserRegistrations(userId: string) {
    await this.findById(userId);
    return this.prisma.registration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startAt: true,
            endAt: true,
            venue: true,
            status: true,
            coverImage: true,
            club: { select: { name: true } },
          },
        },
        tier: {
          select: { name: true, price: true },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  // ─── Admin: change user role ────────────────────────────────────────────────

  async changeRole(targetUserId: string, newRole: UserRole, requesterId: string) {
    const requester = await this.findById(requesterId);
    const allowedRoles: UserRole[] = [UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN];
    if (!allowedRoles.includes(requester.role as UserRole)) {
      throw new ForbiddenException('Only college admins can change roles');
    }

    await this.findById(targetUserId);
    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  // ─── List all users (admin only) ────────────────────────────────────────────

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          collegeId: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
