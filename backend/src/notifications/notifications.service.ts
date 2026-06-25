import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '../generated/prisma/enums';
import type { InputJsonValue } from '@prisma/client/runtime/client';

interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // CREATE — internal use by other services
  // ────────────────────────────────────────────────

  async create(payload: CreateNotificationPayload) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: (payload.data ?? {}) as InputJsonValue,
      },
    });

    this.logger.log(
      `Notification [${payload.type}] created for user ${payload.userId}: "${payload.title}"`,
    );

    return notification;
  }

  // ────────────────────────────────────────────────
  // BULK CREATE — notify many users at once
  // ────────────────────────────────────────────────

  async createBulk(
    userIds: string[],
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    if (userIds.length === 0) return { count: 0 };

    const result = await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type,
        title,
        body,
        data: (data ?? {}) as InputJsonValue,
      })),
      skipDuplicates: false,
    });

    this.logger.log(
      `Bulk notification [${type}] sent to ${result.count} users: "${title}"`,
    );

    return result;
  }

  // ────────────────────────────────────────────────
  // LIST MY NOTIFICATIONS — paginated, unread first
  // ────────────────────────────────────────────────

  async findMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, read: false } }),
    ]);

    return {
      notifications,
      meta: {
        total,
        unreadCount,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ────────────────────────────────────────────────
  // MARK ONE AS READ
  // ────────────────────────────────────────────────

  async markRead(userId: string, notificationId: string) {
    // Only update if it belongs to the user (Prisma will no-op on mismatch)
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  // ────────────────────────────────────────────────
  // MARK ALL AS READ
  // ────────────────────────────────────────────────

  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    this.logger.log(`Marked ${result.count} notifications as read for user ${userId}`);
    return result;
  }

  // ────────────────────────────────────────────────
  // DELETE ONE
  // ────────────────────────────────────────────────

  async deleteOne(userId: string, notificationId: string) {
    await this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
    return { message: 'Notification deleted' };
  }

  // ────────────────────────────────────────────────
  // UNREAD COUNT — for badge display
  // ────────────────────────────────────────────────

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { unreadCount: count };
  }

  // ────────────────────────────────────────────────
  // WELL-KNOWN HELPER SHORTCUTS — used by other modules
  // ────────────────────────────────────────────────

  notifyRegistration(userId: string, eventTitle: string) {
    return this.create({
      userId,
      type: NotificationType.EVENT_REGISTRATION,
      title: 'Registration Confirmed 🎉',
      body: `You're registered for "${eventTitle}". Check your ticket for the QR code.`,
      data: { eventTitle },
    });
  }

  notifyWaitlist(userId: string, eventTitle: string) {
    return this.create({
      userId,
      type: NotificationType.WAITLIST_PROMOTED,
      title: 'Great news! You\'re off the waitlist 🎊',
      body: `A spot opened up for "${eventTitle}". Your registration is now confirmed.`,
      data: { eventTitle },
    });
  }

  notifyEventReminder(userId: string, eventTitle: string, startsIn: string) {
    return this.create({
      userId,
      type: NotificationType.EVENT_REMINDER,
      title: `Reminder: "${eventTitle}" starts ${startsIn}`,
      body: `Don't forget — check in with your QR code at the venue.`,
      data: { eventTitle, startsIn },
    });
  }

  notifyEventCancelled(userId: string, eventTitle: string) {
    return this.create({
      userId,
      type: NotificationType.EVENT_CANCELLED,
      title: `Event Cancelled: "${eventTitle}"`,
      body: `Unfortunately, this event has been cancelled. We'll keep you updated.`,
      data: { eventTitle },
    });
  }

  notifyAnnouncement(userId: string, eventTitle: string, announcementTitle: string) {
    return this.create({
      userId,
      type: NotificationType.CLUB_ANNOUNCEMENT,
      title: `📢 ${announcementTitle}`,
      body: `New announcement for event: "${eventTitle}"`,
      data: { eventTitle, announcementTitle },
    });
  }
}
