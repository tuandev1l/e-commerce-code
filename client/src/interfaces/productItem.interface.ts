import { IProduct } from './product.interface';

export type IProductItem = Pick<
  IProduct,
  | '_id'
  | 'name'
  | 'seller'
  | 'price'
  | 'listPrice'
  | 'originalPrice'
  | 'discount'
  | 'thumbnailUrl'
> & {
  uuid?: string;
  color?: string;
  size?: string;
  quantity: number;
  subTotal: number;
};
