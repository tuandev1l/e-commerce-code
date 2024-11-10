import { IOrder } from '../../interfaces';

export interface IOrderSlice {
  isLoading: boolean;
  orders: IOrder[];
  error: string;
}

export const orderInitialState: IOrderSlice = {
  isLoading: false,
  orders: [],
  error: '',
};
