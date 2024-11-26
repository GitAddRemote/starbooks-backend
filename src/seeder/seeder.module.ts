// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    OrganizationsModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
