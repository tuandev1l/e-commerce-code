export interface ICreateOrder {
  paymentMethod: string;
  orderInfo?: string;
  vnp_TransactionNo?: number;
  vnp_TxnRef?: string;
}
