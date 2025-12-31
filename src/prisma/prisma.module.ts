import { Module } from '@nestjs/common';
import { PrismaService } from '.';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
