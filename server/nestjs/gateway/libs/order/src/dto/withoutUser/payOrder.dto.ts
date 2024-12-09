import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/createOrder.dto';
import { PaymentMethodEnum } from '@share/enums/payment.enum';

export class PayOrderDtoWithoutUser {
  @IsNotEmpty()
  orders: CreateOrderDtoWithoutUser[];

  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
