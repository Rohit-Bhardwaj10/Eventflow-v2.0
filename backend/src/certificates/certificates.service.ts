import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class CertificatesService {
  private readonly logger = new Logger(CertificatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // ISSUE CERTIFICATES (Admin action)
  // ────────────────────────────────────────────────

  async issueForEvent(userId: string, eventId: string) {
    // 1. Verify admin
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can issue certificates');
    }

    // 2. Find all check-ins without certificates
    const checkins = await this.prisma.checkin.findMany({
      where: {
        registration: { 
          eventId,
          certificate: { is: null }
        },
      },
      include: {
        registration: true,
      },
    });

    if (checkins.length === 0) {
      return { message: 'No new check-ins found to issue certificates' };
    }

    // 3. Create certificates
    const certificatesToCreate = checkins.map((c) => ({
      userId: c.registration.userId,
      registrationId: c.registration.id,
      verifyToken: randomBytes(8).toString('hex').toUpperCase(),
      issuedAt: new Date(),
    }));

    await this.prisma.certificate.createMany({
      data: certificatesToCreate,
    });

    this.logger.log(`Issued ${certificatesToCreate.length} certificates for event ${eventId}`);
    return { message: `Successfully issued ${certificatesToCreate.length} certificates` };
  }

  // ────────────────────────────────────────────────
  // USER: LIST MY CERTIFICATES
  // ────────────────────────────────────────────────

  async getMyCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        registration: {
          include: {
            event: { select: { id: true, title: true, startAt: true, club: { select: { name: true } } } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  // ────────────────────────────────────────────────
  // PUBLIC VERIFICATION
  // ────────────────────────────────────────────────

  async verifyCertificate(token: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { verifyToken: token },
      include: {
        user: { select: { name: true, email: true } },
        registration: {
          include: {
            event: { select: { title: true, startAt: true, club: { select: { name: true } } } },
          },
        },
      },
    });

    if (!cert) throw new NotFoundException('Invalid certificate token');
    return cert;
  }
}
