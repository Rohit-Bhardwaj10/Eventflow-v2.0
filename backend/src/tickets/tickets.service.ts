import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // CREATE TIER — club admin only
  // ────────────────────────────────────────────────

  async createTier(userId: string, eventId: string, dto: CreateTicketTierDto) {
    await this._assertEventAdmin(userId, eventId);

    const tier = await this.prisma.ticketTier.create({
      data: {
        eventId,
        name: dto.name,
        description: dto.description ?? null,
        price: dto.price ?? 0,
        capacity: dto.capacity ?? null,
        available: dto.capacity ?? null, // available = capacity initially
        closesAt: dto.closesAt ? new Date(dto.closesAt) : null,
      },
    });

    this.logger.log(`Tier "${tier.name}" created for event ${eventId}`);
    return tier;
  }

  // ────────────────────────────────────────────────
  // LIST TIERS — public (anyone can see)
  // ────────────────────────────────────────────────

  async listTiers(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    return this.prisma.ticketTier.findMany({
      where: { eventId },
      orderBy: { price: 'asc' },
      include: {
        _count: { select: { registrations: true } },
      },
    });
  }

  // ────────────────────────────────────────────────
  // GET ONE TIER
  // ────────────────────────────────────────────────

  async getTier(eventId: string, tierId: string) {
    const tier = await this.prisma.ticketTier.findUnique({
      where: { id: tierId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!tier || tier.eventId !== eventId) {
      throw new NotFoundException('Ticket tier not found');
    }

    return tier;
  }

  // ────────────────────────────────────────────────
  // UPDATE TIER — club admin only
  // ────────────────────────────────────────────────

  async updateTier(
    userId: string,
    eventId: string,
    tierId: string,
    dto: UpdateTicketTierDto,
  ) {
    await this._assertEventAdmin(userId, eventId);

    const existing = await this.prisma.ticketTier.findUnique({ where: { id: tierId } });
    if (!existing || existing.eventId !== eventId) {
      throw new NotFoundException('Ticket tier not found');
    }

    // If capacity is being changed, adjust `available` proportionally
    let available = existing.available;
    if (dto.capacity !== undefined && existing.capacity !== null) {
      const used = existing.capacity - (existing.available ?? existing.capacity);
      const newAvail = dto.capacity - used;
      if (newAvail < 0) {
        throw new BadRequestException(
          `Cannot reduce capacity below current registrations count (${used} registered)`,
        );
      }
      available = newAvail;
    } else if (dto.capacity !== undefined && existing.capacity === null) {
      // First time setting capacity
      const registered = await this.prisma.registration.count({
        where: { tierId, status: { not: 'CANCELLED' } },
      });
      available = dto.capacity - registered;
    }

    const updated = await this.prisma.ticketTier.update({
      where: { id: tierId },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        capacity: dto.capacity,
        available: available ?? undefined,
        closesAt: dto.closesAt ? new Date(dto.closesAt) : undefined,
      },
    });

    this.logger.log(`Tier ${tierId} updated for event ${eventId}`);
    return updated;
  }

  // ────────────────────────────────────────────────
  // DELETE TIER — club admin only, no registrations
  // ────────────────────────────────────────────────

  async deleteTier(userId: string, eventId: string, tierId: string) {
    await this._assertEventAdmin(userId, eventId);

    const existing = await this.prisma.ticketTier.findUnique({
      where: { id: tierId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!existing || existing.eventId !== eventId) {
      throw new NotFoundException('Ticket tier not found');
    }

    if (existing._count.registrations > 0) {
      throw new BadRequestException(
        `Cannot delete tier with ${existing._count.registrations} existing registrations. ` +
          'Cancel all registrations first.',
      );
    }

    await this.prisma.ticketTier.delete({ where: { id: tierId } });
    this.logger.log(`Tier ${tierId} deleted from event ${eventId}`);
    return { message: 'Ticket tier deleted successfully' };
  }

  // ────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ────────────────────────────────────────────────

  private async _assertEventAdmin(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId } },
    });

    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can manage ticket tiers');
    }
  }
}
