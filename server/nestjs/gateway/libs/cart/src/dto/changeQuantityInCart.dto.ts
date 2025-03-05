import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class ChangeQuantityInCartDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
