import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── Admin: list all users ──────────────────────────────────────────────────

  @Get()
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.usersService.listUsers(page, limit);
  }

  // ─── Get own profile ────────────────────────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: 'Get own full profile' })
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  // ─── Update own profile ─────────────────────────────────────────────────────

  @Patch('me')
  @ApiOperation({ summary: 'Update own profile' })
  updateMe(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  // ─── Get own clubs ──────────────────────────────────────────────────────────

  @Get('me/clubs')
  @ApiOperation({ summary: "Get current user's club memberships" })
  getMyClubs(@CurrentUser('id') userId: string) {
    return this.usersService.getUserClubs(userId);
  }

  // ─── Get own registrations ──────────────────────────────────────────────────

  @Get('me/registrations')
  @ApiOperation({ summary: "Get current user's event registrations" })
  getMyRegistrations(@CurrentUser('id') userId: string) {
    return this.usersService.getUserRegistrations(userId);
  }

  // ─── Get any user by ID (admin or self) ─────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // ─── Admin: change role ─────────────────────────────────────────────────────

  @Patch(':id/role')
  @Roles(UserRole.COLLEGE_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Change user role (admin only)' })
  changeRole(
    @Param('id') targetId: string,
    @Body() dto: ChangeRoleDto,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.usersService.changeRole(targetId, dto.role, requesterId);
  }
}
