import { User } from '@user/entities/user.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CancelOrderDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
