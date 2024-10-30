import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { AddItemWithoutUserDto } from '@libs/cart/dto/addItemWithoutUser.dto';

export class AddItemDto extends AddItemWithoutUserDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
