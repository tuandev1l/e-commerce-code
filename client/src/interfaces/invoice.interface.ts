export interface IInvoice {
  itemsCount: number;
  itemsQuantity: number;
  total: number;
  collectibleAmount: number;
  discountAmount: number;
  shippingAmountAfterDiscount: number;
  shippingDiscountAmount: number;
  handlingFee: number;
  otherFee: number;
  purchasedAt: string;
}
