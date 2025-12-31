import { Module } from '@nestjs/common';
import { UsersService } from '.';
import { UsersController } from '.';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
