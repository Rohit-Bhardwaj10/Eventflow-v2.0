import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { RegisterEventDto } from './dto/register-event.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller()
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  // POST /events/:eventId/register  — register current user for an event
  @Post('events/:eventId/register')
  @ApiOperation({ summary: 'Register for an event' })
  register(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() dto: RegisterEventDto,
  ) {
    dto.eventId = eventId; // Merge param into DTO
    return this.registrationsService.register(userId, dto);
  }

  // DELETE /registrations/:id  — cancel a registration
  @Delete('registrations/:id')
  @ApiOperation({ summary: 'Cancel a registration' })
  cancel(
    @CurrentUser('id') userId: string,
    @Param('id') registrationId: string,
  ) {
    return this.registrationsService.cancel(userId, registrationId);
  }

  // GET /my/registrations  — list all of my registrations
  @Get('my/registrations')
  @ApiOperation({ summary: 'List my registrations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyRegistrations(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.registrationsService.findMyRegistrations(userId, page, limit);
  }

  // GET /my/registrations/:id  — get one registration with fresh QR
  @Get('my/registrations/:id')
  @ApiOperation({ summary: 'Get my registration details (with QR code)' })
  findMyRegistration(
    @CurrentUser('id') userId: string,
    @Param('id') registrationId: string,
  ) {
    return this.registrationsService.findMyRegistration(userId, registrationId);
  }

  // GET /events/:eventId/registrations  — list all registrations for an event (admin)
  @Get('events/:eventId/registrations')
  @ApiOperation({ summary: 'List all registrations for an event (Club Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findEventRegistrations(
    @CurrentUser('id') adminUserId: string,
    @Param('eventId') eventId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.registrationsService.findEventRegistrations(
      eventId,
      adminUserId,
      page,
      limit,
    );
  }
}
