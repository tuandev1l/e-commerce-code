import { ChangeQuantityWithoutUserDto } from '@libs/cart/dto/withoutUser/changeQuantityWithoutUser.dto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class ChangeQuantityInCartDto extends ChangeQuantityWithoutUserDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
