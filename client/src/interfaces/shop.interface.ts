import { IShopAddress } from './shopAddress.interface';

export interface IShop {
  id: string;
  name: string;
  logo?: string;
  telephone?: string;
  url: string;
  address?: IShopAddress;
}
