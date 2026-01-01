import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/users';
import { LocalStrategy } from './strategy';
import { JwtStrategy } from './strategy';
import { AuthService } from '.';
import { AuthController } from '.';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, PassportModule],
})
export class AuthModule {}
