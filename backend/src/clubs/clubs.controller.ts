import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ClubStatus } from '../generated/prisma/enums';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('clubs')
@ApiBearerAuth()
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new club' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createClubDto: CreateClubDto,
  ) {
    return this.clubsService.create(userId, createClubDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all approved clubs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.clubsService.findAll(page, limit, ClubStatus.APPROVED);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get club details by slug' })
  findOne(@Param('slug') slug: string) {
    return this.clubsService.findOne(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update club details (Admin only - basic check)' })
  update(
    @Param('slug') slug: string,
    @Body() updateClubDto: UpdateClubDto,
    // TODO: Add proper ClubRoleGuard to ensure only club admins can edit
  ) {
    return this.clubsService.update(slug, updateClubDto);
  }

  @Post(':slug/join')
  @ApiOperation({ summary: 'Join a club as a follower' })
  join(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.clubsService.joinClub(slug, userId);
  }

  @Delete(':slug/leave')
  @ApiOperation({ summary: 'Leave a club' })
  leave(@Param('slug') slug: string, @CurrentUser('id') userId: string) {
    return this.clubsService.leaveClub(slug, userId);
  }
}
