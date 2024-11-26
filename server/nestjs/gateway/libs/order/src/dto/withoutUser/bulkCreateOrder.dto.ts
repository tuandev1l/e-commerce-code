import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethodEnum } from '@share/enums/payment.enum';

export class BulkCreateOrderDtoWithoutUser {
  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsOptional()
  @IsString()
  orderInfo?: string;

  @IsOptional()
  @IsNumber()
  vnp_TransactionNo?: number;

  @IsOptional()
  @IsString()
  vnp_TxnRef?: string;
}
