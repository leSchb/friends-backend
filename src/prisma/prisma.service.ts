import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const options: any = {
      errorFormat: 'pretty',
      log: [],
    };

    if (process.env.PRISMA_ACCELERATE_URL?.trim()) {
      options.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
    }
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
