import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { CreateProductDtoWithoutUser } from '@libs/product/dto/product/withoutUser/create-product.dto';

export class CreateProductDto extends CreateProductDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
