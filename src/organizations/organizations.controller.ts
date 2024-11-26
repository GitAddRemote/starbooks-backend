// src/organizations/organizations.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('options')
  async getOptions(@Res() res) {
    const organizations = await this.organizationsService.findAll();
    const options = organizations.map(org => `<option value="${org.id}">${org.name}</option>`).join('');
    res.set('Content-Type', 'text/html');
    res.send(options);
  }
}
