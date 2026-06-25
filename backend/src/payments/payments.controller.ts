import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  RawBodyRequest,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments/order — create Razorpay order (authenticated)
  @Post('order')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Razorpay payment order for a registration' })
  createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.paymentsService.createOrder(userId, dto);
  }

  // POST /payments/verify — verify payment signature after checkout (authenticated)
  @Post('verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment after checkout' })
  verifyPayment(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(userId, dto);
  }

  // POST /payments/webhook — Razorpay server-to-server event (public, no JWT)
  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Razorpay webhook endpoint (server-to-server)' })
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.rawBody!, signature);
  }

  // GET /payments/registrations/:registrationId — get payment status for a registration
  @Get('registrations/:registrationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status for a registration' })
  getPaymentForRegistration(
    @CurrentUser('id') userId: string,
    @Param('registrationId') registrationId: string,
  ) {
    return this.paymentsService.getPaymentForRegistration(userId, registrationId);
  }

  // GET /payments/events/:eventId — admin: list all payments for an event
  @Get('events/:eventId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all payments for an event (Club Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listEventPayments(
    @CurrentUser('id') adminUserId: string,
    @Param('eventId') eventId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.paymentsService.listEventPayments(adminUserId, eventId, page, limit);
  }
}
