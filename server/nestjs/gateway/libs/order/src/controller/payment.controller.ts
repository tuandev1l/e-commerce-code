import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PAYMENT_PREFIX } from '@constants/requestPrefix';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { OrderService } from '@libs/order/order.service';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@constants';

@Controller(PAYMENT_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class PaymentController {
  constructor(private readonly service: OrderService) {}

  @MessagePattern(ORDER_PATTERN.GET_ALL_PAYMENT_METHOD)
  async getAllPaymentMethod() {
    return this.service.getAllPaymentMethod();
  }

  @MessagePattern(ORDER_PATTERN.GET_PAYMENT_METHOD)
  async getPaymentMethod(@Payload() paymentId: number) {
    return this.service.getPaymentMethod(paymentId);
  }
}
