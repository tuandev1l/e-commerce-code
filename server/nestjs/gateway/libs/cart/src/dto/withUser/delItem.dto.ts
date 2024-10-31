import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/withoutUser/delItemWithoutUser.dto';

export class DelItemDto extends DelItemWithoutUserDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
