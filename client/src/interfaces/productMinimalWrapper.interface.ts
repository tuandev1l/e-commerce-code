import { IProductItem } from './productItem.interface';
import { IProductItemMinimal } from './productItemMinimal.interface';

export type IProductMinimalWrapper = Pick<IProductItem, 'seller'> & {
  productItem: IProductItemMinimal[];
};
