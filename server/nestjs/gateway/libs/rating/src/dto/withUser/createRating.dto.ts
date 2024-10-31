import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { CreateRatingDtoWithoutUser } from '@libs/rating/dto/withoutUser/createRating.dto';

export class CreateRatingDto extends CreateRatingDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
