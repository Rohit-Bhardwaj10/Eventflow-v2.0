import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('announcements')
@ApiBearerAuth()
@Controller('clubs/:clubId/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // POST /clubs/:clubId/announcements — Admin creates an announcement
  @Post()
  @ApiOperation({ summary: 'Create an announcement and notify all club members (Club Admin only)' })
  create(
    @CurrentUser('id') userId: string,
    @Param('clubId') clubId: string,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(userId, clubId, dto);
  }

  // GET /clubs/:clubId/announcements — Members list announcements
  @Get()
  @ApiOperation({ summary: 'List club announcements (Club members only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  list(
    @CurrentUser('id') userId: string,
    @Param('clubId') clubId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.announcementsService.listClubAnnouncements(userId, clubId, page, limit);
  }

  // GET /clubs/:clubId/announcements/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific announcement' })
  getOne(
    @CurrentUser('id') userId: string,
    @Param('clubId') clubId: string,
    @Param('id') announcementId: string,
  ) {
    return this.announcementsService.getOne(userId, clubId, announcementId);
  }

  // DELETE /clubs/:clubId/announcements/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an announcement (Club Admin only)' })
  delete(
    @CurrentUser('id') userId: string,
    @Param('clubId') clubId: string,
    @Param('id') announcementId: string,
  ) {
    return this.announcementsService.delete(userId, clubId, announcementId);
  }
}
