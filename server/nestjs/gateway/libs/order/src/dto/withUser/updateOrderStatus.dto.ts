import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @Type(() => User)
  user?: User;
}
