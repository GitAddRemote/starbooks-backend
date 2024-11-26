// src/auth/strategies/discord.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('oauth.discord.clientID'),
      clientSecret: configService.get('oauth.discord.clientSecret'),
      callbackURL: configService.get('oauth.discord.callbackURL'),
      scope: ['identify', 'email'],
    });
  }

  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: Profile,
  //   done: Function,
  // ) {
  //   console.log('DiscordStrategy validate called');
  //   const { id, username, email } = profile;
  //   let user = await this.usersService.findByDiscordId(id);
  //   console.log('User found or created:', user);
  //   if (!user) {
  //     user = await this.usersService.create({
  //       discordId: id,
  //       displayName: username,
  //       email,
  //     });
  //   }
  //   done(null, user);
  // }
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    console.log('Received profile:', profile);
    console.log('DiscordStrategy validate called');
    try {
      // Find or create user in the database
      // const user = await this.usersService.findOrCreate(profile);
      let user = await this.usersService.findByDiscordId(profile.discordId);
      if (!user) {
        user = await this.usersService.create({
          discordId: profile.id,
          displayName: profile.username,
          email: profile.email,
        });
      }
      console.log('User found or created:', user);
      done(null, user);
    } catch (err) {
      console.error('Error in DiscordStrategy validate:', err);
      done(err, null);
    }
  }
}
