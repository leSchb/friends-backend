import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, data: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getReviewsByUserId(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
    });
  }
}
