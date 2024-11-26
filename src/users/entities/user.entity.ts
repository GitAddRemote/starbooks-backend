// src/users/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { Organization } from '../../organizations/entities/organization.entity';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    username: string;
  
    @Column({ nullable: true })
    discordId: string;
  
    @Column({ nullable: true })
    googleId: string;
  
    @Column({ nullable: true })
    email: string;
  
    @Column({ nullable: true })
    displayName: string;
  
    @Column({ nullable: true })
    starCitizenUsername: string;
  
    @ManyToMany(() => Organization, (organization) => organization.users, {
      cascade: true,
    })
    @JoinTable()
    organizations: Organization[];
  
    @Column({ nullable: true })
    primaryOrganizationId: number;
  }
  