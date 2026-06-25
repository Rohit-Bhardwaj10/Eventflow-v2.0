import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckinByQrDto } from './dto/checkin-by-qr.dto';
import { ManualCheckinDto } from './dto/manual-checkin.dto';
import { RegistrationStatus } from '../generated/prisma/enums';

@Injectable()
export class CheckinService {
  private readonly logger = new Logger(CheckinService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────────────────────
  // SCAN QR CODE — primary check-in path
  // ────────────────────────────────────────────────────────────────

  async checkinByQr(operatorId: string, eventId: string, dto: CheckinByQrDto) {
    // 1. Look up registration by QR token
    const registration = await this.prisma.registration.findUnique({
      where: { qrToken: dto.qrToken },
      include: {
        event: { select: { id: true, title: true, startAt: true, endAt: true, clubId: true } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
        tier: { select: { id: true, name: true } },
        checkin: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Invalid QR code — registration not found');
    }

    // 2. Confirm the token belongs to this event
    if (registration.eventId !== eventId) {
      throw new BadRequestException('This QR code is for a different event');
    }

    // 3. Verify operator is club admin/owner for this event
    await this._assertOperatorAccess(operatorId, registration.event.clubId);

    // 4. Check registration status
    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('This registration has been cancelled');
    }
    if (registration.status === RegistrationStatus.WAITLISTED) {
      throw new BadRequestException('This attendee is on the waitlist and cannot check in');
    }

    // 5. Guard against double check-in
    if (registration.checkin) {
      throw new ConflictException(
        `Already checked in at ${registration.checkin.checkedInAt.toISOString()}`,
      );
    }

    // 6. Record the check-in
    const checkin = await this.prisma.checkin.create({
      data: {
        registrationId: registration.id,
        eventId,
        checkedInById: operatorId,
        method: dto.method ?? 'QR',
      },
    });

    this.logger.log(
      `✅ Check-in: user ${registration.userId} → event ${eventId} by operator ${operatorId}`,
    );

    return {
      checkin,
      attendee: registration.user,
      registration: {
        id: registration.id,
        status: registration.status,
        tier: registration.tier,
      },
      event: {
        id: registration.event.id,
        title: registration.event.title,
      },
    };
  }

  // ────────────────────────────────────────────────────────────────
  // MANUAL CHECK-IN — by registration ID (admin override)
  // ────────────────────────────────────────────────────────────────

  async manualCheckin(operatorId: string, eventId: string, dto: ManualCheckinDto) {
    const registration = await this.prisma.registration.findUnique({
      where: { id: dto.registrationId },
      include: {
        event: { select: { id: true, title: true, clubId: true } },
        user: { select: { id: true, name: true, email: true, avatar: true } },
        checkin: true,
      },
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.eventId !== eventId) {
      throw new BadRequestException('Registration does not belong to this event');
    }

    await this._assertOperatorAccess(operatorId, registration.event.clubId);

    if (registration.status === RegistrationStatus.CANCELLED) {
      throw new BadRequestException('Registration is cancelled');
    }
    if (registration.checkin) {
      throw new ConflictException(
        `Already checked in at ${registration.checkin.checkedInAt.toISOString()}`,
      );
    }

    const checkin = await this.prisma.checkin.create({
      data: {
        registrationId: registration.id,
        eventId,
        checkedInById: operatorId,
        method: 'MANUAL',
      },
    });

    this.logger.log(
      `📋 Manual check-in: registration ${registration.id} → event ${eventId} by operator ${operatorId}`,
    );

    return { checkin, attendee: registration.user };
  }

  // ────────────────────────────────────────────────────────────────
  // UNDO CHECK-IN — operator can revert within the same event
  // ────────────────────────────────────────────────────────────────

  async undoCheckin(operatorId: string, eventId: string, checkinId: string) {
    const checkin = await this.prisma.checkin.findUnique({
      where: { id: checkinId },
      include: { registration: { select: { event: { select: { clubId: true } } } } },
    });

    if (!checkin) throw new NotFoundException('Check-in record not found');
    if (checkin.eventId !== eventId) {
      throw new BadRequestException('Check-in does not belong to this event');
    }

    await this._assertOperatorAccess(operatorId, checkin.registration.event.clubId);

    await this.prisma.checkin.delete({ where: { id: checkinId } });

    this.logger.log(`↩️  Check-in ${checkinId} undone by operator ${operatorId}`);
    return { message: 'Check-in successfully undone' };
  }

  // ────────────────────────────────────────────────────────────────
  // GET CHECK-IN STATS — dashboard numbers for an event
  // ────────────────────────────────────────────────────────────────

  async getEventCheckinStats(operatorId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, capacity: true, clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    await this._assertOperatorAccess(operatorId, event.clubId);

    const [totalRegistered, totalCheckedIn, checkins] = await Promise.all([
      this.prisma.registration.count({
        where: { eventId, status: RegistrationStatus.CONFIRMED },
      }),
      this.prisma.checkin.count({ where: { eventId } }),
      this.prisma.checkin.findMany({
        where: { eventId },
        include: {
          registration: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
              tier: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { checkedInAt: 'desc' },
        take: 100,
      }),
    ]);

    return {
      stats: {
        totalRegistered,
        totalCheckedIn,
        remaining: totalRegistered - totalCheckedIn,
        capacity: event.capacity,
        checkInRate:
          totalRegistered > 0
            ? Math.round((totalCheckedIn / totalRegistered) * 100)
            : 0,
      },
      recentCheckins: checkins,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // LIST ALL CHECK-INS — paginated log for an event
  // ────────────────────────────────────────────────────────────────

  async listCheckins(
    operatorId: string,
    eventId: string,
    page = 1,
    limit = 50,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    await this._assertOperatorAccess(operatorId, event.clubId);

    const skip = (page - 1) * limit;
    const [checkins, total] = await Promise.all([
      this.prisma.checkin.findMany({
        where: { eventId },
        skip,
        take: limit,
        include: {
          registration: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
              tier: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { checkedInAt: 'desc' },
      }),
      this.prisma.checkin.count({ where: { eventId } }),
    ]);

    return {
      checkins,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ────────────────────────────────────────────────────────────────

  private async _assertOperatorAccess(userId: string, clubId: string) {
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });

    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException(
        'Only club admins or owners can perform check-in operations',
      );
    }
  }
}
