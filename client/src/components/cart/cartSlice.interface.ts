import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';
import { ICartItemSelect } from './cartItemSelect.interface';

export interface ICartSlice {
  isLoading: boolean;
  products: IProductMinimalWrapper[];
  cartItemSelect: ICartItemSelect[];
  total: number;
  discount: number;
  userId: number;
  error?: string;
}

export const cartInitalState: ICartSlice = {
  isLoading: false,
  products: [],
  cartItemSelect: [],
  error: undefined,
  total: 0,
  discount: 0,
  userId: 0,
};
