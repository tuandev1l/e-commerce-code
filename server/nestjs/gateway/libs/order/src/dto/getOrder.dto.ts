import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from '@user/entities/user.entity';
import { Type } from 'class-transformer';

export class GetOrderDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNumber()
  @IsNotEmpty()
  orderId: number;
}
