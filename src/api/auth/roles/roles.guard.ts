import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { eRole } from 'src/repositories/constants';
import { parseJwt } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<eRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { headers } = context.switchToHttp().getRequest();
    const { authorization: token } = headers;

    if (token) {
      const jwtDecoded = parseJwt(token);
      return requiredRoles.some((role) => role === jwtDecoded.role);
    } else {
      return false;
    }
  }
}
