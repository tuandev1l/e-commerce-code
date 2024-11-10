import { ORDER_STATUS } from '../enum';
import { IInvoice } from './invoice.interface';
import { IOrderStatus } from './orderStatus.interface';
import { IPayment } from './payment.interface';
import { IProductItem } from './productItem.interface';
import { IShipping } from './shipping.interface';

export interface IOrder {
  status: ORDER_STATUS;
  invoice: IInvoice;
  item: IProductItem;
  shipping: IShipping;
  payment: IPayment;
  statusHistories: IOrderStatus[];
  uuid: string;
}
