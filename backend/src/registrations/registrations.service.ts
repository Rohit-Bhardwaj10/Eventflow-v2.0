import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { InputJsonValue } from '@prisma/client/runtime/client';
import { RegisterEventDto } from './dto/register-event.dto';
import { RegistrationStatus, EventStatus } from '../generated/prisma/enums';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(private readonly prisma: PrismaService) { }

  // ────────────────────────────────────────────────
  // REGISTER FOR AN EVENT
  // ────────────────────────────────────────────────

  async register(userId: string, dto: RegisterEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: {
        ticketTiers: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not open for registration');
    }

    const now = new Date();
    if (event.endAt < now) {
      throw new BadRequestException('Event has already ended');
    }

    // Check if user is already registered
    const existingReg = await this.prisma.registration.findUnique({
      where: { eventId_userId: { eventId: dto.eventId, userId } },
    });

    if (existingReg) {
      if (existingReg.status !== RegistrationStatus.CANCELLED) {
        throw new ConflictException('You are already registered for this event');
      }
      // Re-activate a cancelled registration
      return this._reactivateRegistration(existingReg.id, dto);
    }

    // Validate tier if provided
    let tier = null;
    if (dto.tierId) {
      tier = event.ticketTiers.find((t) => t.id === dto.tierId);
      if (!tier) throw new NotFoundException('Ticket tier not found for this event');
      if (tier.closesAt && tier.closesAt < now) {
        throw new BadRequestException('Registration for this ticket tier has closed');
      }
    }

    // Determine status: CONFIRMED or WAITLISTED based on capacity
    const status = await this._determineStatus(event, tier);

    // Generate a unique QR token
    const qrToken = uuidv4();

    const registration = await this.prisma.registration.create({
      data: {
        eventId: dto.eventId,
        userId,
        tierId: dto.tierId ?? null,
        status,
        qrToken,
        customFields: (dto.customFields ?? {}) as InputJsonValue,
      },
      include: {
        event: { select: { id: true, title: true, slug: true, startAt: true, venue: true } },
        tier: { select: { id: true, name: true, price: true } },
      },
    });

    // Decrement available seats in tier if applicable
    if (tier && tier.available !== null && status === RegistrationStatus.CONFIRMED) {
      await this.prisma.ticketTier.update({
        where: { id: tier.id },
        data: { available: { decrement: 1 } },
      });
    }

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(qrToken, { width: 300 });

    this.logger.log(
      `User ${userId} registered for event ${dto.eventId} — status: ${status}`,
    );

    return { registration, qrCode: qrDataUrl };
  }

  // ────────────────────────────────────────────────
  // CANCEL REGISTRATION
  // ────────────────────────────────────────────────

  async cancel(userId: string, registrationId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: { tier: true },
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own registrations');
    }
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Registration is already cancelled');
    }

    const wasConfirmed = registration.status === RegistrationStatus.CONFIRMED;

    const updated = await this.prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: RegistrationStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    // Free up the seat and promote from waitlist
    if (wasConfirmed) {
      if (registration.tier && registration.tierId) {
        await this.prisma.ticketTier.update({
          where: { id: registration.tierId },
          data: { available: { increment: 1 } },
        });
      }
      // Promote first WAITLISTED registration
      await this._promoteFromWaitlist(registration.eventId, registration.tierId);
    }

    this.logger.log(`Registration ${registrationId} cancelled by user ${userId}`);
    return updated;
  }

  // ────────────────────────────────────────────────
  // LIST MY REGISTRATIONS (Student)
  // ────────────────────────────────────────────────

  async findMyRegistrations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      this.prisma.registration.findMany({
        where: { userId, status: { not: RegistrationStatus.CANCELLED } },
        skip,
        take: limit,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startAt: true,
              endAt: true,
              venue: true,
              coverImage: true,
              club: { select: { id: true, name: true, logo: true } },
            },
          },
          tier: { select: { id: true, name: true, price: true } },
          checkin: { select: { id: true, checkedInAt: true } },
        },
        orderBy: { registeredAt: 'desc' },
      }),
      this.prisma.registration.count({
        where: { userId, status: { not: RegistrationStatus.CANCELLED } },
      }),
    ]);

    return {
      registrations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ────────────────────────────────────────────────
  // LIST EVENT REGISTRATIONS (Club Admin)
  // ────────────────────────────────────────────────

  async findEventRegistrations(
    eventId: string,
    adminUserId: string,
    page = 1,
    limit = 50,
  ) {
    // Verify caller is club admin for this event
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId: adminUserId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can view registrations');
    }

    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      this.prisma.registration.findMany({
        where: { eventId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true, year: true } },
          tier: { select: { id: true, name: true, price: true } },
          checkin: { select: { id: true, checkedInAt: true, method: true } },
        },
        orderBy: { registeredAt: 'asc' },
      }),
      this.prisma.registration.count({ where: { eventId } }),
    ]);

    return {
      registrations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ────────────────────────────────────────────────
  // GET TICKET BY QR TOKEN (for check-in scan)
  // ────────────────────────────────────────────────

  async findByQrToken(qrToken: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { qrToken },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        event: { select: { id: true, title: true, startAt: true, endAt: true } },
        tier: { select: { id: true, name: true } },
        checkin: true,
      },
    });

    if (!registration) throw new NotFoundException('QR token is invalid');
    return registration;
  }

  // ────────────────────────────────────────────────
  // GET MY SINGLE REGISTRATION (with fresh QR)
  // ────────────────────────────────────────────────

  async findMyRegistration(userId: string, registrationId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startAt: true,
            endAt: true,
            venue: true,
            meetingLink: true,
            coverImage: true,
            club: { select: { id: true, name: true, logo: true } },
          },
        },
        tier: { select: { id: true, name: true, price: true } },
        checkin: { select: { id: true, checkedInAt: true } },
      },
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const qrCode = await QRCode.toDataURL(registration.qrToken, { width: 300 });

    return { registration, qrCode };
  }

  // ────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ────────────────────────────────────────────────

  private async _determineStatus(
    event: { id: string; capacity: number | null; _count: { registrations: number } },
    tier: { id: string; available: number | null } | null,
  ): Promise<RegistrationStatus> {
    // Tier-level capacity check
    if (tier) {
      if (tier.available !== null && tier.available <= 0) {
        return RegistrationStatus.WAITLISTED;
      }
      return RegistrationStatus.CONFIRMED;
    }

    // Event-level capacity check (no specific tier)
    if (event.capacity !== null) {
      const confirmedCount = await this.prisma.registration.count({
        where: {
          eventId: event.id,
          status: RegistrationStatus.CONFIRMED,
        },
      });
      if (confirmedCount >= event.capacity) {
        return RegistrationStatus.WAITLISTED;
      }
    }

    return RegistrationStatus.CONFIRMED;
  }

  private async _reactivateRegistration(
    registrationId: string,
    dto: RegisterEventDto,
  ) {
    const status = RegistrationStatus.CONFIRMED; // Simplified for re-registration

    const qrToken = uuidv4();
    return this.prisma.registration.update({
      where: { id: registrationId },
      data: {
        status,
        qrToken,
        cancelledAt: null,
        tierId: dto.tierId ?? null,
        customFields: (dto.customFields ?? {}) as InputJsonValue,
      },
    });
  }

  private async _promoteFromWaitlist(
    eventId: string,
    tierId: string | null,
  ) {
    const waitlisted = await this.prisma.registration.findFirst({
      where: {
        eventId,
        tierId: tierId ?? null,
        status: RegistrationStatus.WAITLISTED,
      },
      orderBy: { registeredAt: 'asc' },
    });

    if (waitlisted) {
      await this.prisma.registration.update({
        where: { id: waitlisted.id },
        data: { status: RegistrationStatus.CONFIRMED },
      });

      // Decrement tier seat if applicable
      if (tierId) {
        await this.prisma.ticketTier.update({
          where: { id: tierId },
          data: { available: { decrement: 1 } },
        });
      }

      this.logger.log(
        `Waitlisted registration ${waitlisted.id} promoted to CONFIRMED for event ${eventId}`,
      );
    }
  }
}
