import { IsNotEmpty } from 'class-validator';
import { User } from '@user/entities/user.entity';
import { Type } from 'class-transformer';
import { GetOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/getOrder.dto';

export class GetOrderDto extends GetOrderDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
