import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, ClubMemberRole } from '../generated/prisma/enums';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateEventDto) {
    // Basic authorization check: verify user is an admin or executive of the club
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: dto.clubId, userId } },
    });

    if (!membership || membership.role !== ClubMemberRole.ADMIN) {
      throw new ForbiddenException('Only club executives can create events');
    }

    const existing = await this.prisma.event.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Event with this slug already exists');

    return this.prisma.event.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        type: dto.type,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        venue: dto.venue,
        meetingLink: dto.meetingLink,
        capacity: dto.capacity,
        coverImage: dto.coverImage,
        category: dto.category,
        clubId: dto.clubId,
        createdById: userId,
        status: EventStatus.DRAFT,
      },
    });
  }

  async findAll(page = 1, limit = 20, status?: EventStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : { status: EventStatus.PUBLISHED };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          club: { select: { id: true, name: true, logo: true } },
          _count: { select: { registrations: true } },
        },
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { events, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        club: { select: { id: true, name: true, logo: true, bio: true } },
        ticketTiers: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(slug: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { slug } });
    if (!event) throw new NotFoundException('Event not found');

    // Basic authorization check
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId } },
    });

    if (!membership || membership.role !== ClubMemberRole.ADMIN) {
      throw new ForbiddenException('Only club executives can update events');
    }

    return this.prisma.event.update({
      where: { id: event.id },
      data: {
        ...dto,
        ...(dto.startAt && { startAt: new Date(dto.startAt) }),
        ...(dto.endAt && { endAt: new Date(dto.endAt) }),
      },
    });
  }
}
