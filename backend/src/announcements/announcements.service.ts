import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ────────────────────────────────────────────────
  // CREATE & BROADCAST — admin sends to all club members
  // ────────────────────────────────────────────────

  async create(senderId: string, clubId: string, dto: CreateAnnouncementDto) {
    // 1. Verify sender is club admin/owner
    await this._assertClubAdmin(senderId, clubId);

    // 2. Verify club exists
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true, name: true },
    });
    if (!club) throw new NotFoundException('Club not found');

    // 3. Save announcement
    const announcement = await this.prisma.announcement.create({
      data: {
        clubId,
        sentById: senderId,
        title: dto.title,
        body: dto.body,
      },
      include: {
        sentBy: { select: { id: true, name: true, avatar: true } },
        club: { select: { id: true, name: true, logo: true } },
      },
    });

    // 4. Notify all club members in background (fire-and-forget)
    this._broadcastToMembers(clubId, dto.title, club.name).catch((err) =>
      this.logger.error(`Announcement broadcast failed for club ${clubId}`, err),
    );

    this.logger.log(
      `Announcement "${dto.title}" sent to club ${clubId} by user ${senderId}`,
    );

    return announcement;
  }

  // ────────────────────────────────────────────────
  // LIST CLUB ANNOUNCEMENTS — members can read
  // ────────────────────────────────────────────────

  async listClubAnnouncements(
    userId: string,
    clubId: string,
    page = 1,
    limit = 20,
  ) {
    // Verify user is at least a follower/member of the club
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You must be a club member to view announcements');
    }

    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
      this.prisma.announcement.findMany({
        where: { clubId },
        skip,
        take: limit,
        include: {
          sentBy: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.announcement.count({ where: { clubId } }),
    ]);

    return {
      announcements,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ────────────────────────────────────────────────
  // GET ONE ANNOUNCEMENT
  // ────────────────────────────────────────────────

  async getOne(userId: string, clubId: string, announcementId: string) {
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
    if (!membership) {
      throw new ForbiddenException('You must be a club member to view announcements');
    }

    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        sentBy: { select: { id: true, name: true, avatar: true } },
        club: { select: { id: true, name: true, logo: true } },
      },
    });

    if (!announcement || announcement.clubId !== clubId) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  // ────────────────────────────────────────────────
  // DELETE ANNOUNCEMENT — admin only
  // ────────────────────────────────────────────────

  async delete(userId: string, clubId: string, announcementId: string) {
    await this._assertClubAdmin(userId, clubId);

    const existing = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!existing || existing.clubId !== clubId) {
      throw new NotFoundException('Announcement not found');
    }

    await this.prisma.announcement.delete({ where: { id: announcementId } });
    this.logger.log(`Announcement ${announcementId} deleted by user ${userId}`);
    return { message: 'Announcement deleted' };
  }

  // ────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ────────────────────────────────────────────────

  private async _assertClubAdmin(userId: string, clubId: string) {
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can send announcements');
    }
  }

  private async _broadcastToMembers(
    clubId: string,
    announcementTitle: string,
    clubName: string,
  ) {
    // Fetch all active member user IDs
    const members = await this.prisma.clubMember.findMany({
      where: { clubId },
      select: { userId: true },
    });

    const userIds = members.map((m) => m.userId);
    if (userIds.length === 0) return;

    await this.notifications.createBulk(
      userIds,
      'CLUB_ANNOUNCEMENT' as any,
      `📢 ${announcementTitle}`,
      `New announcement from ${clubName}`,
      { clubId, announcementTitle, clubName },
    );

    this.logger.log(
      `Broadcast announcement to ${userIds.length} members of club ${clubId}`,
    );
  }
}
