import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProductDtoWithoutUser } from '@libs/product/dto/product/withoutUser/create-product.dto';

export class UpdateProductDtoWithoutUser extends CreateProductDtoWithoutUser {
  @IsNotEmpty()
  @IsString()
  productId: string;
}
