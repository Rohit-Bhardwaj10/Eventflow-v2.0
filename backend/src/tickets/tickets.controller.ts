import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';
import { UpdateTicketTierDto } from './dto/update-ticket-tier.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('events/:eventId/tiers')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // GET /events/:eventId/tiers — public list of tiers
  @Get()
  @ApiOperation({ summary: 'List all ticket tiers for an event' })
  listTiers(@Param('eventId') eventId: string) {
    return this.ticketsService.listTiers(eventId);
  }

  // GET /events/:eventId/tiers/:tierId — single tier
  @Get(':tierId')
  @ApiOperation({ summary: 'Get a single ticket tier' })
  getTier(
    @Param('eventId') eventId: string,
    @Param('tierId') tierId: string,
  ) {
    return this.ticketsService.getTier(eventId, tierId);
  }

  // POST /events/:eventId/tiers — create tier (club admin)
  @Post()
  @ApiOperation({ summary: 'Create a ticket tier for an event (Club Admin)' })
  createTier(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() dto: CreateTicketTierDto,
  ) {
    return this.ticketsService.createTier(userId, eventId, dto);
  }

  // PATCH /events/:eventId/tiers/:tierId — update tier (club admin)
  @Patch(':tierId')
  @ApiOperation({ summary: 'Update a ticket tier (Club Admin)' })
  updateTier(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Param('tierId') tierId: string,
    @Body() dto: UpdateTicketTierDto,
  ) {
    return this.ticketsService.updateTier(userId, eventId, tierId, dto);
  }

  // DELETE /events/:eventId/tiers/:tierId — delete tier (club admin)
  @Delete(':tierId')
  @ApiOperation({ summary: 'Delete a ticket tier (Club Admin, no registrations)' })
  deleteTier(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Param('tierId') tierId: string,
  ) {
    return this.ticketsService.deleteTier(userId, eventId, tierId);
  }
}
