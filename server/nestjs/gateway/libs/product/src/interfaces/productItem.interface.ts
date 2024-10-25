import { ProductDocument } from '@libs/product/entities/product.entity';

export interface IProductItem
  extends Pick<
    ProductDocument,
    | '_id'
    | 'name'
    | 'seller'
    | 'price'
    | 'listPrice'
    | 'originalPrice'
    | 'discount'
    | 'thumbnailUrl'
  > {
  quantity: number;
  subTotal: number;
  finalPrice: number;
}
