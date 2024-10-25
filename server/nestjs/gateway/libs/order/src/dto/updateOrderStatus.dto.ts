import { ORDER_STATUS } from '@libs/order/enum';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsEnum(ORDER_STATUS)
  @IsNotEmpty()
  status: ORDER_STATUS;

  @IsString()
  data: string;
}
