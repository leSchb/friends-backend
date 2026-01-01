import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const exists = await this.usersRepo.findOneBy({
      email: data.email,
    });
    if (exists)
      throw new ConflictException('Такой пользователь уже существует');

    const hash = await bcrypt.hash(data.password, 10);

    return await this.usersRepo.save({
      email: data.email,
      name: data.name,
      password: hash,
    });
  }
}
