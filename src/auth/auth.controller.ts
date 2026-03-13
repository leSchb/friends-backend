import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RefreshTokenDto, RegisterUserDto } from './dto';
import { LoginUserDto } from 'src/users/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const data = await this.authService.register(dto);
    return {
      message: 'Пользователь успешно зарегистрирован',
      data,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const data = await this.authService.login(dto);
    return {
      message: 'Успешная авторизация',
      data,
    };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.refresh(dto);
    return {
      message: 'Токен успешно обновлен',
      data,
    };
  }
}
