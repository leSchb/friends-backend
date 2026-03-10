import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PunishmentsService } from './punishments.service';
import { PunishmentsController } from './punishments.controller';

import { User } from 'src/users/entities';
import { Punishment } from './entities';

@Module({
  providers: [PunishmentsService],
  controllers: [PunishmentsController],
  imports: [TypeOrmModule.forFeature([User, Punishment])],
})
export class PunishmentsModule {}
