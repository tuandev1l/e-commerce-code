import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ChangeQuantityWithoutUserDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
