import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetOrderDtoWithoutUser {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
