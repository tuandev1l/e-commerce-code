import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddItemWithoutUserDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
