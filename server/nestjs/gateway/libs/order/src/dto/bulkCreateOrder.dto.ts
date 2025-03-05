import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { PaymentMethodEnum } from '@share/enums/payment.enum';

export class BulkCreateOrderDto {
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

  @IsOptional()
  @IsString()
  momoRequestId?: string;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
