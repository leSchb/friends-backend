import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReviewDto } from './dto';
import { Review } from './entities';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepo: Repository<Review>,
  ) {}

  async createReview(userId: string, data: CreateReviewDto) {
    return this.reviewsRepo.save({
      ...data,
      userId,
    });
  }

  async getReviewsByUserId(userId: string) {
    return this.reviewsRepo.find({
      where: { userId },
    });
  }
}
