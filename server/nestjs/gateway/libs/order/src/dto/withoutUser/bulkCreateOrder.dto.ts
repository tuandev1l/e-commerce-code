import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethodEnum } from '@share/enums/payment.enum';

export class BulkCreateOrderDtoWithoutUser {
  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  vnpayParams?: string;

  @IsOptional()
  @IsString()
  orderInfo?: string;

  @IsOptional()
  @IsString()
  vnp_TransactionDate?: string;

  @IsOptional()
  @IsString()
  vnp_TxnRef?: string;

  @IsOptional()
  @IsString()
  vnp_TransactionStatus?: string;
}
