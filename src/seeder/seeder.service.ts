// src/seeder/seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedOrganizations();
  }

  private async seedOrganizations() {
    const existingOrgs = await this.organizationRepository.find({
      where: [
        { name: 'Dreadnought Industries' },
        { name: 'Dreadnought Security' },
      ],
    });

    const orgNames = existingOrgs.map((org) => org.name);

    const organizationsToInsert = [];

    if (!orgNames.includes('Dreadnought Industries')) {
      organizationsToInsert.push(
        this.organizationRepository.create({ name: 'Dreadnought Industries' }),
      );
    }

    if (!orgNames.includes('Dreadnought Security')) {
      organizationsToInsert.push(
        this.organizationRepository.create({ name: 'Dreadnought Security' }),
      );
    }

    if (organizationsToInsert.length > 0) {
      await this.organizationRepository.save(organizationsToInsert);
      console.log('Seed data inserted');
    } else {
      console.log('Seed data already exists');
    }
  }
}
