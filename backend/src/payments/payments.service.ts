import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentStatus } from '../generated/prisma/enums';
import * as crypto from 'crypto';
import Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly razorpay: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get<string>('razorpay.keyId') || 'dummy_key_id',
      key_secret: this.config.get<string>('razorpay.keySecret') || 'dummy_key_secret',
    });
  }

  // ────────────────────────────────────────────────
  // CREATE ORDER — frontend calls this, then opens Razorpay checkout
  // ────────────────────────────────────────────────

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Load the registration and its tier price
    const registration = await this.prisma.registration.findUnique({
      where: { id: dto.registrationId },
      include: {
        tier: { select: { price: true, name: true } },
        event: { select: { id: true, title: true } },
        payment: true,
      },
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // 2. Determine the amount to charge
    const amount = registration.tier?.price ?? 0;
    if (amount === 0) {
      throw new BadRequestException('This is a free event — no payment required');
    }

    // 3. Guard: don't double-create an order
    if (registration.payment) {
      if (registration.payment.status === PaymentStatus.PAID) {
        throw new BadRequestException('This registration is already paid');
      }
      // Return existing PENDING order to let frontend retry
      if (registration.payment.status === PaymentStatus.PENDING && registration.payment.razorpayOrderId) {
        return {
          orderId: registration.payment.razorpayOrderId,
          amount,
          currency: registration.payment.currency,
          keyId: this.config.get<string>('razorpay.keyId'),
          paymentId: registration.payment.id,
        };
      }
    }

    // 4. Create Razorpay order
    const rzOrder = await this.razorpay.orders.create({
      amount: amount * 100, // Razorpay uses paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `reg_${dto.registrationId}`,
      notes: {
        registrationId: dto.registrationId,
        eventTitle: registration.event.title,
        userId,
      },
    });

    // 5. Create/update our Payment record in PENDING state
    const payment = await this.prisma.payment.upsert({
      where: { registrationId: dto.registrationId },
      create: {
        registrationId: dto.registrationId,
        amount,
        currency: 'INR',
        status: PaymentStatus.PENDING,
        razorpayOrderId: rzOrder.id,
      },
      update: {
        razorpayOrderId: rzOrder.id,
        status: PaymentStatus.PENDING,
      },
    });

    this.logger.log(
      `Razorpay order created: ${rzOrder.id} for registration ${dto.registrationId}`,
    );

    return {
      orderId: rzOrder.id,
      amount,
      currency: 'INR',
      keyId: this.config.get<string>('razorpay.keyId'),
      paymentId: payment.id,
    };
  }

  // ────────────────────────────────────────────────
  // VERIFY PAYMENT — client sends back Razorpay response
  // ────────────────────────────────────────────────

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    // 1. Look up our payment record by Razorpay order ID
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: dto.razorpayOrderId },
      include: {
        registration: {
          include: {
            event: { select: { title: true } },
            user: { select: { id: true } },
          },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment order not found');
    if (payment.registration.user.id !== userId) {
      throw new ForbiddenException('Access denied');
    }
    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment already verified');
    }

    // 2. Verify HMAC-SHA256 signature
    const keySecret = this.config.get<string>('razorpay.keySecret') ?? '';
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      // Mark payment as failed and throw
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      this.logger.warn(
        `Payment signature mismatch for order ${dto.razorpayOrderId} by user ${userId}`,
      );
      throw new UnauthorizedException('Invalid payment signature — possible tampering detected');
    }

    // 3. Mark payment as PAID
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        razorpayPaymentId: dto.razorpayPaymentId,
        paidAt: new Date(),
      },
    });

    this.logger.log(
      `Payment VERIFIED: ${dto.razorpayPaymentId} for order ${dto.razorpayOrderId}`,
    );

    return {
      success: true,
      payment: updatedPayment,
      eventTitle: payment.registration.event.title,
    };
  }

  // ────────────────────────────────────────────────
  // WEBHOOK — Razorpay server-to-server event
  // ────────────────────────────────────────────────

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('razorpay.webhookSecret') ?? '';

    // Verify webhook authenticity
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== signature) {
      this.logger.warn('Razorpay webhook signature verification failed');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString());
    this.logger.log(`Razorpay webhook received: ${event.event}`);

    switch (event.event) {
      case 'payment.captured': {
        const rzPayment = event.payload?.payment?.entity;
        if (rzPayment?.order_id) {
          await this.prisma.payment.updateMany({
            where: {
              razorpayOrderId: rzPayment.order_id,
              status: { not: PaymentStatus.PAID },
            },
            data: {
              status: PaymentStatus.PAID,
              razorpayPaymentId: rzPayment.id,
              paidAt: new Date(),
            },
          });
          this.logger.log(`Webhook: payment.captured → order ${rzPayment.order_id}`);
        }
        break;
      }
      case 'payment.failed': {
        const rzPayment = event.payload?.payment?.entity;
        if (rzPayment?.order_id) {
          await this.prisma.payment.updateMany({
            where: { razorpayOrderId: rzPayment.order_id },
            data: { status: PaymentStatus.FAILED },
          });
          this.logger.warn(`Webhook: payment.failed → order ${rzPayment.order_id}`);
        }
        break;
      }
      case 'refund.created': {
        const refund = event.payload?.refund?.entity;
        if (refund?.payment_id) {
          await this.prisma.payment.updateMany({
            where: { razorpayPaymentId: refund.payment_id },
            data: { status: PaymentStatus.REFUNDED, refundedAt: new Date() },
          });
          this.logger.log(`Webhook: refund.created → payment ${refund.payment_id}`);
        }
        break;
      }
      default:
        this.logger.log(`Unhandled Razorpay event: ${event.event}`);
    }

    return { received: true };
  }

  // ────────────────────────────────────────────────
  // GET MY PAYMENT — user checks their payment status
  // ────────────────────────────────────────────────

  async getPaymentForRegistration(userId: string, registrationId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { registrationId },
      include: {
        registration: { select: { userId: true } },
      },
    });

    if (!payment) throw new NotFoundException('No payment record for this registration');
    if (payment.registration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return payment;
  }

  // ────────────────────────────────────────────────
  // ADMIN: LIST PAYMENTS FOR AN EVENT
  // ────────────────────────────────────────────────

  async listEventPayments(adminUserId: string, eventId: string, page = 1, limit = 50) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { clubId: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: event.clubId, userId: adminUserId } },
    });
    if (!membership || !['ADMIN', 'OWNER'].includes(membership.role)) {
      throw new ForbiddenException('Only club admins can view payment data');
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { registration: { eventId } },
        skip,
        take: limit,
        include: {
          registration: {
            include: {
              user: { select: { id: true, name: true, email: true } },
              tier: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where: { registration: { eventId } } }),
    ]);

    // Revenue summary
    const revenueData = await this.prisma.payment.aggregate({
      where: { registration: { eventId }, status: PaymentStatus.PAID },
      _sum: { amount: true },
      _count: { _all: true },
    });

    return {
      payments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      revenue: {
        totalCollected: revenueData._sum.amount ?? 0,
        paidCount: revenueData._count._all,
      },
    };
  }
}
