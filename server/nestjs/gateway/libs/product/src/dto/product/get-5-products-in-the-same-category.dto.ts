import { IsNotEmpty, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class Get5ProductsInTheSameCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  @Transform(({ value }) => value)
  productId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  @Transform(({ value }) => value)
  categoryId: string;
}
