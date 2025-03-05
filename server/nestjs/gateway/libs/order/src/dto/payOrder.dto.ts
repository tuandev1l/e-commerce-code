import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { PaymentMethodEnum } from '@share/enums/payment.enum';
import { CreateOrderDto } from '@libs/order/dto/createOrder.dto';

export class PayOrderDto {
  @IsNotEmpty()
  orders: CreateOrderDto[];

  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
