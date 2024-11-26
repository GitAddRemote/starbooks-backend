// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  async findByDiscordId(discordId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { discordId } });
  }

  async findByGoogleId(googleId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['organizations'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { organizations: organizationIds, ...userData } = createUserDto;

    const user = this.usersRepository.create(userData);

    if (organizationIds && organizationIds.length > 0) {
      // Fetch organizations by IDs
      const organizations = await this.organizationsRepository.findBy({
        id: In(organizationIds),
      });

      if (organizations.length !== organizationIds.length) {
        throw new NotFoundException('One or more organizations not found');
      }

      user.organizations = organizations;
    }

    return this.usersRepository.save(user);
  }

  // src/users/users.service.ts
  async update(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateData.starCitizenUsername !== undefined) {
      user.starCitizenUsername = updateData.starCitizenUsername;
    }

    if (updateData.organizations) {
      // Fetch organizations by IDs
      const organizations = await this.organizationsRepository.findByIds(updateData.organizations);
      user.organizations = organizations;
    }

    if (updateData.primaryOrganizationId !== undefined) {
      user.primaryOrganizationId = updateData.primaryOrganizationId;
    }

    return this.usersRepository.save(user);
  }

// async findOrCreate(profile: any): Promise<User> {
//   // Attempt to find the user by their Discord ID
//   let user = await this.usersRepository.findOne({
//     where: { discordId: profile.id },
//   });

//   if (user) {
//     // User exists, return the user
//     return user;
//   } else {
//     // User does not exist, create a new user
//     user = this.usersRepository.create({
//         discordId: profile.id,
//         username: profile.username,
//         displayName: profile.username, // or profile.displayName if available
//         email: profile.email,
//         avatar: profile.avatar,
//         // Add any other fields you need
//     });

//     // Save the new user to the database
//     return await this.usersRepository.save(user);
//   }
// }

async findOrCreate(profile: any): Promise<User> {
  console.log('findOrCreate called with profile:', profile);

  // Ensure that you're searching for the user by the correct Discord ID
  let user = await this.usersRepository.findOne({
    where: { discordId: profile.id },
  });

  if (user) {
    // Optionally update user data
    user.username = profile.username;
    user.email = profile.email;
    // Save updates if necessary
    await this.usersRepository.save(user);
  } else {
    // Create a new user with the profile data
    user = this.usersRepository.create({
      discordId: profile.id,
      username: profile.username,
      email: profile.email,
      displayName: profile.global_name || profile.username,
      // Add other fields as needed
    });

    // Save the new user to the database
    user = await this.usersRepository.save(user);
  }

  return user;
}

}
