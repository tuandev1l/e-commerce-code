import { IProductItem } from '@libs/product/interfaces';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class AddAndDeleteItemFromCartDto {
  @IsNotEmpty()
  @Type(() => User)
  user: User;

  @IsNotEmpty()
  productItems: IProductItem[];
}
