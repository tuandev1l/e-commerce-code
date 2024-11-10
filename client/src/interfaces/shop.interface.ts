import { IUserAddress } from './userAddress.interface';

export interface IShop {
  id: string;
  name: string;
  logo?: string;
  telephone?: string;
  url: string;
  address?: IUserAddress;
}
