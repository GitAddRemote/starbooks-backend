// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.google.clientID'),
      clientSecret: configService.get('oauth.google.clientSecret'),
      callbackURL: configService.get('oauth.google.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails } = profile;
    let user = await this.usersService.findByGoogleId(id);
    if (!user) {
      user = await this.usersService.create({
        googleId: id,
        displayName,
        email: emails[0].value,
      });
    }
    done(null, user);
  }
}
