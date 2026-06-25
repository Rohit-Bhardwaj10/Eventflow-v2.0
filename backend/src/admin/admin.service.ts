import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifySystemAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only System Admins can perform this action');
    }
  }

  async getDashboardStats(userId: string) {
    await this.verifySystemAdmin(userId);

    const [
      totalUsers,
      totalClubs,
      totalEvents,
      totalRegistrations,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.club.count(),
      this.prisma.event.count(),
      this.prisma.registration.count(),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
    ]);

    return {
      totalUsers,
      totalClubs,
      totalEvents,
      totalRegistrations,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }

  async approveClub(userId: string, clubId: string) {
    await this.verifySystemAdmin(userId);
    return this.prisma.club.update({
      where: { id: clubId },
      data: { status: 'APPROVED' },
    });
  }

  async rejectClub(userId: string, clubId: string) {
    await this.verifySystemAdmin(userId);
    return this.prisma.club.update({
      where: { id: clubId },
      data: { status: 'REJECTED' },
    });
  }

  async getAllUsers(userId: string) {
    await this.verifySystemAdmin(userId);
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllClubs(userId: string) {
    await this.verifySystemAdmin(userId);
    return this.prisma.club.findMany({
      include: {
        _count: { select: { members: true, events: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
