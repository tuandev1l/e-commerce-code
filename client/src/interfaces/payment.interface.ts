export interface IPayment {
  method: string;
  value: string;
  imgUrl: string;
  isPrepaid: boolean;
  status: string;
  description: string;
}
