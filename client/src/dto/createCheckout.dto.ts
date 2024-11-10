import { PaymentMethodEnum } from '../enum/payment.enum';
import { IInvoice } from '../interfaces';
import { IProductItemMinimal } from '../interfaces/productItemMinimal.interface';

export interface ICreateCheckout {
  orders: {
    invoice: IInvoice;
    item: IProductItemMinimal;
    shippingId: number;
  }[];
  paymentMethod: PaymentMethodEnum;
  amount: number;
}
