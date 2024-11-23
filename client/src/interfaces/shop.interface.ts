import { IUserAddress } from './userAddress.interface';

export interface IShop {
  _id: string;
  name: string;
  logo?: string;
  telephone?: string;
  description?: string;
  url: string;
  address: IUserAddress;
}
