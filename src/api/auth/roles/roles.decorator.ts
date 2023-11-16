import { SetMetadata } from '@nestjs/common';
import { eRole } from 'src/repositories/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: eRole[]) => SetMetadata(ROLES_KEY, roles);
