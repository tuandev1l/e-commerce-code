export interface IInvoice {
  itemsQuantity: number;
  total: number;
  discountAmount: number;
  shippingAmountAfterDiscount: number;
  shippingDiscountAmount: number;
  handlingFee: number;
  otherFee: number;
  purchasedAt: string;
}
