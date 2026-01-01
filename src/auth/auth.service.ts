import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LoginUserDto } from 'src/users';
import { User } from 'src/users/entities';
import { RefreshToken } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, psw: string) {
    const user = await this.usersRepo.findOneBy({ email });

    if (user) {
      const pswValid = await bcrypt.compare(psw, user.password);
      if (!pswValid) return null;

      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(userDto: LoginUserDto) {
    const user = await this.usersRepo.findOneBy({ email: userDto.email });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const isValid = await bcrypt.compare(userDto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Неверный email или пароль');

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokensRepo.save({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });

      // Наличие токена в базе
      const stored = await this.refreshTokensRepo.findOneBy({
        token: refreshToken,
      });
      if (!stored) throw new Error('Невалидный refresh токен');

      // Проверка на истечение срока
      if (stored.expiresAt < new Date()) {
        await this.refreshTokensRepo.delete({ id: stored.id });
        throw new Error('Невалидный refresh токен');
      }

      // Регистрация нового токена
      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          exp: 15 * 60 * 60 * 1000,
          iat: Date.now(),
        },
        { expiresIn: '15m' },
      );
      return accessToken;
    } catch (e) {
      throw new Error('Невалидный refresh токен');
    }
  }
}
