import { ORDER_STATUS } from '@libs/order/enum';

export interface IOrderStatus {
  status: ORDER_STATUS;
  data: string;
  createdAt: string;
}
