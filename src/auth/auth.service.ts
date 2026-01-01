import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, psw: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const pswValid = await bcrypt.compare(psw, user.password);
      if (!pswValid) return null;

      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: { email: string; id: string; password: string }) {
    const payload = { email: user.email, sub: user.id };

    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) throw new Error('Пользователь не найден');

    const validPsw = await bcrypt.compare(user.password, existingUser.password);
    if (!validPsw) throw new Error('Неверный пароль');

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const refreshToken = this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
        exp,
      },
      { expiresIn: '7d' },
    );
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(exp),
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });

      // Наличие токена в базе
      const stored = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!stored) throw new Error('Невалидный refresh токен');

      // Проверка на истечение срока
      if (stored.expiresAt < new Date()) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
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
      throw new Error('Невалидный токен');
    }
  }
}
