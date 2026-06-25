import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // GET /analytics/events/:eventId
  @Get('events/:eventId')
  @ApiOperation({ summary: 'Get analytics for a specific event (Club Admin only)' })
  getEventAnalytics(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.analyticsService.getEventAnalytics(userId, eventId);
  }

  // GET /analytics/clubs/:clubId
  @Get('clubs/:clubId')
  @ApiOperation({ summary: 'Get overall analytics for a club (Club Admin only)' })
  getClubAnalytics(
    @CurrentUser('id') userId: string,
    @Param('clubId') clubId: string,
  ) {
    return this.analyticsService.getClubAnalytics(userId, clubId);
  }
}
