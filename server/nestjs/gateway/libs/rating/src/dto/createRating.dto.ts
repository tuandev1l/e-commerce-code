import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Rating } from '@libs/rating/entity/rating.entity';
import { User } from '@user/entities/user.entity';

export class CreateRatingDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @Type(() => Rating)
  rating: Rating;
}
