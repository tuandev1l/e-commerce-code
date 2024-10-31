import { User } from '@user/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/createOrder.dto';

export class CreateOrderDto extends CreateOrderDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
