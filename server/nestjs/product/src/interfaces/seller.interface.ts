import { Shop } from '@lib/product/entities/shop.entity';

export interface ISeller extends Pick<Shop, 'name' | 'logo'> {
  price: number;
  product_id: string;
}
