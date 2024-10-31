import { IsNotEmpty } from 'class-validator';
import { CreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/createOrder.dto';

export class BulkCreateOrderDtoWithoutUser {
  @IsNotEmpty()
  orders: CreateOrderDtoWithoutUser[];
}
