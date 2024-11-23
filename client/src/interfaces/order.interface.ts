import { ORDER_STATUS } from '../enum';
import { IInvoice } from './invoice.interface';
import { IOrderStatus } from './orderStatus.interface';
import { IPayment } from './payment.interface';
import { IProductItem } from './productItem.interface';
import { IRating } from './rating.interface';
import { IShipping } from './shipping.interface';

export interface IOrder {
  id: number;
  status: ORDER_STATUS;
  invoice: IInvoice;
  item: IProductItem;
  shipping: IShipping;
  payment: IPayment;
  statusHistories: IOrderStatus[];
  uuid: string;
  ratingId: number | null;
  rating: IRating | null;
  createdAt?: Date;
  updatedAt?: Date;
}
