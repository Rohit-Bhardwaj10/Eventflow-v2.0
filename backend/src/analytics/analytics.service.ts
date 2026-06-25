import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, RegistrationStatus } from '../generated/prisma/enums';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // EVENT ANALYTICS
  // ────────────────────────────────────────────────

  async getEventAnalytics(userId: string, eventId: string) {
    // Verify admin access
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can view analytics');
    }

    // 1. Registration Stats
    const totalRegistrations = await this.prisma.registration.count({
      where: { eventId, status: { not: RegistrationStatus.CANCELLED } },
    });
    const checkInCount = await this.prisma.checkin.count({
      where: { registration: { eventId } },
    });
    
    // 2. Revenue
    const revenueData = await this.prisma.payment.aggregate({
      where: { registration: { eventId }, status: PaymentStatus.PAID },
      _sum: { amount: true },
    });

    // 3. Ticket Tier Breakdown
    const tiers = await this.prisma.ticketTier.findMany({
      where: { eventId },
      select: {
        id: true,
        name: true,
        price: true,
        capacity: true,
        _count: {
          select: { registrations: { where: { status: { not: RegistrationStatus.CANCELLED } } } },
        },
      },
    });

    // 4. Daily Registration Trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRegistrations = await this.prisma.registration.findMany({
      where: {
        eventId,
        registeredAt: { gte: sevenDaysAgo },
        status: { not: RegistrationStatus.CANCELLED },
      },
      select: { registeredAt: true },
    });

    const timeline = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      return {
        date: dateStr,
        count: recentRegistrations.filter((r) => r.registeredAt.toISOString().startsWith(dateStr)).length,
      };
    }).reverse();

    return {
      overview: {
        totalRegistrations,
        checkInCount,
        attendanceRate: totalRegistrations > 0 ? (checkInCount / totalRegistrations) * 100 : 0,
        totalRevenue: revenueData._sum.amount ?? 0,
      },
      tiers: tiers.map((t) => ({
        name: t.name,
        price: t.price,
        sold: t._count.registrations,
        capacity: t.capacity,
        revenue: (t.price || 0) * t._count.registrations,
      })),
      timeline,
    };
  }

  // ────────────────────────────────────────────────
  // CLUB OVERALL ANALYTICS
  // ────────────────────────────────────────────────

  async getClubAnalytics(userId: string, clubId: string) {
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can view analytics');
    }

    const [eventsCount, membersCount] = await Promise.all([
      this.prisma.event.count({ where: { clubId } }),
      this.prisma.clubMember.count({ where: { clubId } }),
    ]);

    const allEvents = await this.prisma.event.findMany({
      where: { clubId },
      select: { id: true },
    });
    const eventIds = allEvents.map((e) => e.id);

    let totalRegistrations = 0;
    let totalRevenue = 0;

    if (eventIds.length > 0) {
      totalRegistrations = await this.prisma.registration.count({
        where: { eventId: { in: eventIds }, status: { not: RegistrationStatus.CANCELLED } },
      });

      const revenue = await this.prisma.payment.aggregate({
        where: { registration: { eventId: { in: eventIds } }, status: PaymentStatus.PAID },
        _sum: { amount: true },
      });
      totalRevenue = revenue._sum.amount ?? 0;
    }

    return {
      overview: {
        eventsCount,
        membersCount,
        totalRegistrations,
        totalRevenue,
      },
    };
  }
}
