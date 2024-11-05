import { IsNotEmpty } from 'class-validator';
import { UpdateProductDtoWithoutUser } from '@libs/product/dto/product/withoutUser/update-product.dto';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class UpdateProductDto extends UpdateProductDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
