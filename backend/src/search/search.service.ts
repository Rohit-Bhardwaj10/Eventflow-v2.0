import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, ClubStatus } from '../generated/prisma/enums';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) { }

  async globalSearch(query: string) {
    if (!query || query.length < 2) {
      return { events: [], clubs: [] };
    }

    const searchTerm = query.trim();

    const [events, clubs] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          status: EventStatus.PUBLISHED,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { venue: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          startAt: true,
          venue: true,
          coverImage: true,
          club: { select: { id: true, name: true } },
        },
        take: 10,
      }),

      this.prisma.club.findMany({
        where: {
          status: ClubStatus.APPROVED,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { bio: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          logo: true,
          category: true,
          _count: { select: { members: true } },
        },
        take: 10,
      }),
    ]);

    return { events, clubs };
  }
}
