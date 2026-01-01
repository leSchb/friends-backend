import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma';
import { CreateUserDto, UsersService } from 'src/users';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
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

  async login(user: CreateUserDto) {
    const createdUser = await this.usersService.createUser(user);

    const validPsw = await bcrypt.compare(user.password, createdUser.password);
    if (!validPsw) throw new Error('Неверный пароль');

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const accessToken = this.jwtService.sign(
      {
        sub: createdUser.id,
        email: createdUser.email,
        exp,
      },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: createdUser.id,
        email: createdUser.email,
        exp,
      },
      { expiresIn: '7d' },
    );
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: createdUser.id,
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
