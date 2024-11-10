import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/createOrder.dto';

export class PayOrderDtoWithoutUser {
  @IsNotEmpty()
  orders: CreateOrderDtoWithoutUser[];

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
