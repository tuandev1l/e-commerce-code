import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddItemWithoutUserDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;
}
