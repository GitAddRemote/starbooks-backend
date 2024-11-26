// src/auth/session.serializer.ts

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('Serializing user:', user);
    done(null, user.id);
  }

  async deserializeUser(id: number, done: Function) {
    console.log('Deserializing user with ID:', id);
    try {
      const user = await this.usersService.findById(id);
      console.log('Deserialized user:', user);
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err);
    }
  }
}
