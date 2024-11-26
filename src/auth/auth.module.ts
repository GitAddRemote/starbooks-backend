// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy } from './strategies/discord.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [DiscordStrategy, GoogleStrategy, SessionSerializer],
  exports: [PassportModule],
})
export class AuthModule {}