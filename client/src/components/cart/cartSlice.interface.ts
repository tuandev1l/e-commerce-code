import { IProductItem } from '../../interfaces';
import { IProductItemMinimal } from '../../interfaces/productItemMinimal.interface';
import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';
import { IUserAddress } from '../../interfaces/userAddress.interface';

export interface ICartSlice {
  isLoading: boolean;
  products: IProductMinimalWrapper[];
  productSelected: IProductItem[];
  numberOfProducts: number;
  selectedAddress?: IUserAddress;
  total: number;
  discount: number;
  userId: number;
  error?: string;
}

export const cartInitalState: ICartSlice = {
  isLoading: false,
  products: [],
  selectedAddress: undefined,
  productSelected: [],
  numberOfProducts: localStorage.getItem('numberOfProducts')
    ? +localStorage.getItem('numberOfProducts')!
    : 0,
  error: undefined,
  total: 0,
  discount: 0,
  userId: 0,
};
