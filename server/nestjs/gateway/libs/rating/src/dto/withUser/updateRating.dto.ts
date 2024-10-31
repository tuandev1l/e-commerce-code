import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateRatingDtoWithoutUser } from '@libs/rating/dto/withoutUser/updateRating.dto';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class UpdateRatingDto extends UpdateRatingDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @IsNumber()
  ratingId: number;
}
