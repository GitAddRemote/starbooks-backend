// src/users/users.controller.ts
import { Controller, Get, Request, Res, UseGuards, Post, Body, Options } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('UsersController initialized');
  }

  @Options('profile')
  profileOptions(@Res() res) {
    res.send();
  }
  
  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  async getProfile(@Request() req, @Res() res) {

    console.log('Is Authenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);

    const user = await this.usersService.findById(req.user.id);
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: 'Unauthorized' });
      res.redirect('http://localhost:8080/login.html');
      return;
    }
    const organizations = user.organizations.map(org => org.name).join(', ');
    const profileHtml = `
      <h3>My Profile</h3>
      <p><strong>Display Name:</strong> ${user.displayName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Star Citizen Username:</strong> ${user.starCitizenUsername}</p>
      <p><strong>Organizations:</strong> ${organizations}</p>
      <a href="#" class="btn" hx-get="http://localhost:3000/users/profile/edit" hx-target="#profile-container" hx-swap="innerHTML">Edit Profile</a>
    `;
    res.set('Content-Type', 'text/html');
    res.send(profileHtml);
  }
  
  @Post('profile')
  @UseGuards(AuthenticatedGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    await this.usersService.update(req.user.id, updateUserDto);
    res.send('<div class="container"><h5>Profile updated successfully!</h5></div>');
  }
}
