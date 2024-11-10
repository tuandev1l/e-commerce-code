import { IsNotEmpty } from 'class-validator';
import { PayOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/payOrder.dto';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class PayOrderDto extends PayOrderDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
