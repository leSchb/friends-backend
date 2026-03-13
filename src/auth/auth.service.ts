import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities';
import { RefreshToken } from 'src/auth/entities';
import { LoginUserDto } from 'src/users/dto';
import { RefreshTokenDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOneBy({ email });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  private async registerTokens(user: { id: string; email: string }) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m', secret: process.env.JWT_SECRET },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokensRepo.delete({
      userId: user.id,
    });
    await this.refreshTokensRepo.save({
      token: hashedToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterUserDto) {
    const { email, name, password } = dto;
    const hash = await bcrypt.hash(password, 10);
    const { password: _, ...user } = await this.usersRepo.save({
      email,
      name,
      password: hash,
    });

    const { accessToken, refreshToken } = await this.registerTokens(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto.email, userDto.password);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const tokens = await this.registerTokens(user);

    return tokens;
  }

  async refresh({ refreshToken }: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });

      // Наличие токена в базе
      const stored = await this.refreshTokensRepo.find({
        where: { userId: payload.sub },
        select: ['id', 'token', 'expiresAt'],
      });

      let validToken: RefreshToken | null = null;
      for (const token of stored) {
        const isMatch = await bcrypt.compare(refreshToken, token.token);

        if (isMatch) {
          validToken = token;
          break;
        }
      }

      if (!validToken)
        throw new UnauthorizedException('Невалидный refresh токен');

      // Проверка на истечение срока
      if (validToken.expiresAt < new Date()) {
        await this.refreshTokensRepo.delete({ id: validToken.id });
        throw new UnauthorizedException('Невалидный refresh токен');
      }

      // Регистрация нового токена
      await this.refreshTokensRepo.delete({ id: validToken.id });
      const tokens = await this.registerTokens({
        email: payload.email,
        id: payload.sub,
      });
      return tokens;
    } catch (e) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }
  }
}
