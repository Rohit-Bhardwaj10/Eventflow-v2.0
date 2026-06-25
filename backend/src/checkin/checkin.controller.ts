import {
  Controller,
  Post,
  Delete,
  Get,
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
import { CheckinService } from './checkin.service';
import { CheckinByQrDto } from './dto/checkin-by-qr.dto';
import { ManualCheckinDto } from './dto/manual-checkin.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('checkin')
@ApiBearerAuth()
@Controller('events/:eventId/checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  // POST /events/:eventId/checkin/qr — scan a QR code
  @Post('qr')
  @ApiOperation({ summary: 'Check in attendee by scanning their QR code' })
  checkinByQr(
    @CurrentUser('id') operatorId: string,
    @Param('eventId') eventId: string,
    @Body() dto: CheckinByQrDto,
  ) {
    return this.checkinService.checkinByQr(operatorId, eventId, dto);
  }

  // POST /events/:eventId/checkin/manual — manual check-in by registration ID
  @Post('manual')
  @ApiOperation({ summary: 'Manually check in an attendee by registration ID (admin override)' })
  manualCheckin(
    @CurrentUser('id') operatorId: string,
    @Param('eventId') eventId: string,
    @Body() dto: ManualCheckinDto,
  ) {
    return this.checkinService.manualCheckin(operatorId, eventId, dto);
  }

  // DELETE /events/:eventId/checkin/:checkinId — undo a check-in
  @Delete(':checkinId')
  @ApiOperation({ summary: 'Undo a check-in (operator only)' })
  undoCheckin(
    @CurrentUser('id') operatorId: string,
    @Param('eventId') eventId: string,
    @Param('checkinId') checkinId: string,
  ) {
    return this.checkinService.undoCheckin(operatorId, eventId, checkinId);
  }

  // GET /events/:eventId/checkin/stats — live check-in dashboard numbers
  @Get('stats')
  @ApiOperation({ summary: 'Get real-time check-in statistics for an event' })
  getStats(
    @CurrentUser('id') operatorId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.checkinService.getEventCheckinStats(operatorId, eventId);
  }

  // GET /events/:eventId/checkin — paginated list of all check-ins
  @Get()
  @ApiOperation({ summary: 'List all check-ins for an event (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listCheckins(
    @CurrentUser('id') operatorId: string,
    @Param('eventId') eventId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.checkinService.listCheckins(operatorId, eventId, page, limit);
  }
}
