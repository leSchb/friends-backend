import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserPunishmentsController } from './user-punishments.controller';
import { UserPunishmentsService } from './user-punishments.service';

import { User } from 'src/users/entities';
import { UserPunishment } from './entities';

@Module({
  controllers: [UserPunishmentsController],
  providers: [UserPunishmentsService],
  imports: [TypeOrmModule.forFeature([User, UserPunishment])],
})
export class UserPunishmentsModule {}
