import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/entities';
import { Review } from './entities';

@Module({
  providers: [ReviewsService],
  controllers: [ReviewsController],
  imports: [TypeOrmModule.forFeature([User, Review])],
})
export class ReviewsModule {}
