export interface IInvoice {
  itemsQuantity: number;
  productPriceTotal: number;
  total: number;
  discountAmount: number;
  shippingFee: number;
  purchasedAt: string;
  phoneNumber: string;
}
