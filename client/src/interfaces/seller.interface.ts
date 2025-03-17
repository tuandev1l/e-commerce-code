import { IShop } from '../interfaces/shop.interface';

export interface ISeller extends Pick<IShop, 'name' | 'logo'> {
  price: number;
  product_id: string;
}
