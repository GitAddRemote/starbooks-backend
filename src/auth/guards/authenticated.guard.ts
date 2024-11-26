// src/auth/guards/authenticated.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (req.isAuthenticated()) {
      return true;
    } else {
      req.session.returnTo = req.originalUrl;
      context.switchToHttp().getResponse().redirect('/');
      return false;
    }
  }
}
