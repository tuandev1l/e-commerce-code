import { IsNotEmpty, IsNumber } from 'class-validator';
import { IInvoice } from '@libs/order/interface';
import { IProductItem } from '@libs/product/interfaces';

export class CreateOrderDtoWithoutUser {
  @IsNotEmpty()
  invoice: IInvoice;

  @IsNotEmpty()
  item: IProductItem;

  @IsNotEmpty()
  @IsNumber()
  shippingId: number;
}
