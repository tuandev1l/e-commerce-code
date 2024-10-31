import { IsNotEmpty, IsNumber } from 'class-validator';

export class CancelOrderDtoWithoutUser {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
