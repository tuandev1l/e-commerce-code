import { IProductItem } from './productItem.interface';

export type IProductItemMinimal = Pick<
  IProductItem,
  'price' | 'quantity' | 'thumbnailUrl' | 'name' | 'originalPrice' | 'discount'
> & {
  uuid?: string;
  color?: string;
  size?: string;
};
