import { User } from '@user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';

export class CancelOrderDto extends CancelOrderDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
