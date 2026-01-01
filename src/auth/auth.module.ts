import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/entities';
import { RefreshToken } from './entities';
import { UsersModule } from 'src/users';
import { LocalStrategy } from './strategy';
import { JwtStrategy } from './strategy';
import { AuthService } from '.';
import { AuthController } from '.';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
})
export class AuthModule {}
