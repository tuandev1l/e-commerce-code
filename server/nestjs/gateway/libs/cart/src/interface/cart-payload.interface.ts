import { User } from '@user/entities/user.entity';
import { IProductItem } from '@libs/product/interfaces';

export interface ICartPayload {
  user: User;
  productItem: IProductItem;
}
