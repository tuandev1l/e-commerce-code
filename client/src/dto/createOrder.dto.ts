export interface ICreateOrder {
  paymentMethod: string;
  vnpayParams?: string;
  orderInfo?: string;
  vnp_TransactionDate?: string;
  vnp_TxnRef?: string;
  vnp_TransactionStatus?: string;
}
