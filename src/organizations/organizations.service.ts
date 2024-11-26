// src/organizations/organizations.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find();
  }

  findById(id: number): Promise<Organization> {
    return this.organizationsRepository.findOne({ where: { id } });
  }

  create(name: string): Promise<Organization> {
    const organization = this.organizationsRepository.create({ name });
    return this.organizationsRepository.save(organization);
  }
}
