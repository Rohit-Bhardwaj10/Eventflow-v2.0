import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubMemberRole, ClubStatus } from '../generated/prisma/enums';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateClubDto) {
    const existing = await this.prisma.club.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Club with this slug already exists');

    return this.prisma.$transaction(async (tx) => {
      const club = await tx.club.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          tagline: dto.tagline,
          bio: dto.bio,
          category: dto.category,
          logo: dto.logo,
          banner: dto.banner,
          collegeId: dto.collegeId,
          // Require admin approval by default
          status: ClubStatus.PENDING,
        },
      });

      // The creator automatically becomes the president (ADMIN)
      await tx.clubMember.create({
        data: {
          clubId: club.id,
          userId,
          role: ClubMemberRole.ADMIN,
        },
      });

      return club;
    });
  }

  async findAll(page = 1, limit = 20, status?: ClubStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : { status: ClubStatus.APPROVED };
    
    const [clubs, total] = await Promise.all([
      this.prisma.club.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { members: true, events: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.club.count({ where }),
    ]);

    return { clubs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(slug: string) {
    const club = await this.prisma.club.findUnique({
      where: { slug },
      include: {
        members: {
          take: 5,
          where: { role: ClubMemberRole.ADMIN },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
        _count: { select: { members: true, events: true } },
      },
    });

    if (!club) throw new NotFoundException('Club not found');
    return club;
  }

  async update(slug: string, dto: UpdateClubDto) {
    const club = await this.prisma.club.findUnique({ where: { slug } });
    if (!club) throw new NotFoundException('Club not found');

    return this.prisma.club.update({
      where: { id: club.id },
      data: dto,
    });
  }

  async joinClub(slug: string, userId: string) {
    const club = await this.prisma.club.findUnique({ where: { slug } });
    if (!club) throw new NotFoundException('Club not found');

    const existing = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: club.id, userId } },
    });

    if (existing) throw new ConflictException('Already a member of this club');

    return this.prisma.clubMember.create({
      data: {
        clubId: club.id,
        userId,
        role: ClubMemberRole.FOLLOWER,
      },
    });
  }

  async leaveClub(slug: string, userId: string) {
    const club = await this.prisma.club.findUnique({ where: { slug } });
    if (!club) throw new NotFoundException('Club not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: club.id, userId } },
    });

    if (!membership) throw new NotFoundException('Not a member of this club');

    if (membership.role === ClubMemberRole.ADMIN) {
      throw new ConflictException('Club admins cannot leave directly. Transfer ownership first.');
    }

    return this.prisma.clubMember.delete({
      where: { id: membership.id },
    });
  }
}
