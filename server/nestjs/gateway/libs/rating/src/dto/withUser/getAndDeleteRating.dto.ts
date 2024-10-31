import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class GetAndDeleteRatingDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @IsNumber()
  ratingId: number;
}
