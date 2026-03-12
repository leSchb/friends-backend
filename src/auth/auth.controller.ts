import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RefreshTokenDto, RegisterUserDto } from './dto';
import { LoginUserDto } from 'src/users/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }
}
