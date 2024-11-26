// src/users/dto/create-user.dto.ts

export class CreateUserDto {
  discordId?: string;
  googleId?: string;
  email?: string;
  displayName?: string;
  starCitizenUsername?: string;
  organizations?: number[]; // IDs of organizations
  primaryOrganizationId?: number;
}
