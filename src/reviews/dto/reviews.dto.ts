import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  review: string;

  @IsString()
  @IsNotEmpty()
  rating: string;
}
