import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to specific user roles.
 * Usage: @Roles(UserRole.CLUB_ADMIN, UserRole.COLLEGE_ADMIN)
 *
 * Note: In Prisma 7, UserRole is a const object (not a TS enum).
 * UserRole.CLUB_ADMIN === 'CLUB_ADMIN' (string value)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
