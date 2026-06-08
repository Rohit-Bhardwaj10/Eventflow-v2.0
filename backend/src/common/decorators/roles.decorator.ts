import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../generated/prisma';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to specific user roles.
 * Usage: @Roles(UserRole.CLUB_ADMIN, UserRole.COLLEGE_ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
