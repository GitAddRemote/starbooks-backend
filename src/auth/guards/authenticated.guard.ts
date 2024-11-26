// src/auth/guards/authenticated.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    console.log('AuthenticatedGuard canActivate called');
    console.log('Is Authenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);
    return req.isAuthenticated();
  }
}
