import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DelItemWithoutUserDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
