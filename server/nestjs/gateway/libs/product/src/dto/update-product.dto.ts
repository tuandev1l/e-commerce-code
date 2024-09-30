import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends CreateProductDto {
  @IsOptional()
  @IsString()
  id?: string;
}
