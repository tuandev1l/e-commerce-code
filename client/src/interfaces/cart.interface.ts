import { IProductItem } from './productItem.interface';

export interface ICart {
  userId: number;
  total: number;
  productItems: IProductItem[];
}
