import { GetAndDeleteRatingDto } from '@libs/rating/dto/getAndDeleteRating.dto';
import { Rating } from '@libs/rating/entity/rating.entity';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRatingDto extends GetAndDeleteRatingDto {
  @IsNotEmpty()
  @Type(() => Rating)
  rating: Rating;
}
