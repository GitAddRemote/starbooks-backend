// src/auth/auth.controller.ts
import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Initiates Discord authentication
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(@Req() req, @Res() res) {
    console.log('Discord callback, user:', req.user);
  
    req.login(req.user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.redirect('/login-failure');
      }
      // Save the session before redirecting
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        res.redirect('http://localhost:8080/dashboard.html');
      });
    });
  }

  // @Get('discord/callback')
  // @UseGuards(AuthGuard('discord'))
  // discordAuthRedirect(@Req() req, @Res() res) {
  //   res.redirect('http://localhost:8080/dashboard.html');
  // }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    res.redirect('http://localhost:8080/dashboard.html');
  }

  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      res.redirect('http://localhost:8080/index.html');
    });
  }  
}
