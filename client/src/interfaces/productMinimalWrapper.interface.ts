import { IProductItem } from './productItem.interface';

export type IProductMinimalWrapper = Pick<IProductItem, 'seller'> & {
  productItem: IProductItem[];
};
