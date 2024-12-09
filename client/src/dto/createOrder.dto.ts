export interface ICreateOrder {
  paymentMethod: string | null;
  orderInfo?: string | null;
  vnp_TransactionNo?: number | null;
  vnp_TxnRef?: string | null;
  momoRequestId: string | null;
}
