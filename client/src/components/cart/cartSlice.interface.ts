import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';

export interface ICartSlice {
  isLoading: boolean;
  products: IProductMinimalWrapper[];
  productSelected: IProductMinimalWrapper[];
  total: number;
  discount: number;
  userId: number;
  error?: string;
}

export const cartInitalState: ICartSlice = {
  isLoading: false,
  products: [],
  productSelected: [],
  error: undefined,
  total: 0,
  discount: 0,
  userId: 0,
};
