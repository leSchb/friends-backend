import { Module } from '@nestjs/common';
import { UsersService } from '.';
import { UsersController } from '.';
import { User } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
