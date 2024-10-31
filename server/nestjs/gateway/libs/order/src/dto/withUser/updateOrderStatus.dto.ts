import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ORDER_STATUS } from '@libs/order/enum';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNotEmpty()
  @IsEnum(ORDER_STATUS)
  status: ORDER_STATUS;

  @IsString()
  data: string;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
