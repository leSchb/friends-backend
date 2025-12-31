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

  async login(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
