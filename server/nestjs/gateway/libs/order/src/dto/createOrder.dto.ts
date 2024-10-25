import { User } from '@user/entities/user.entity';
import { Order } from '@libs/order/entity/order.entity';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @Type(() => Order)
  @ValidateNested()
  orders: Order[];
}
