import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma';
import { CreateUserDto } from '.';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (exists) throw new Error('Такой пользователь уже существует');

    const hash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hash,
      },
    });
  }
}
