import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { CreateProductDto } from '@libs/product/dto/product/create-product.dto';

export class UpdateProductDto extends CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
