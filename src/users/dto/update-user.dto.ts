// src/users/dto/update-user.dto.ts
export class UpdateUserDto {
  starCitizenUsername?: string;
  organizations?: number[]; // IDs of organizations
  primaryOrganizationId?: number;
}
