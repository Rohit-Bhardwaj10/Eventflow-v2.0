import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get system-wide stats (System Admin only)' })
  getDashboardStats(@CurrentUser('id') userId: string) {
    return this.adminService.getDashboardStats(userId);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (System Admin only)' })
  getAllUsers(@CurrentUser('id') userId: string) {
    return this.adminService.getAllUsers(userId);
  }

  @Get('clubs')
  @ApiOperation({ summary: 'Get all clubs (System Admin only)' })
  getAllClubs(@CurrentUser('id') userId: string) {
    return this.adminService.getAllClubs(userId);
  }

  @Post('clubs/:clubId/approve')
  @ApiOperation({ summary: 'Approve a club (System Admin only)' })
  approveClub(@CurrentUser('id') userId: string, @Param('clubId') clubId: string) {
    return this.adminService.approveClub(userId, clubId);
  }

  @Post('clubs/:clubId/reject')
  @ApiOperation({ summary: 'Reject a club (System Admin only)' })
  rejectClub(@CurrentUser('id') userId: string, @Param('clubId') clubId: string) {
    return this.adminService.rejectClub(userId, clubId);
  }
}
