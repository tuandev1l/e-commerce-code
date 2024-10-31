import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ORDER_STATUS } from '@libs/order/enum';

export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  @IsString()
  data: string;
}
