import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { SHIPPING_PREFIX } from '@constants/requestPrefix';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { OrderService } from '@libs/order/order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@constants';

@Controller(SHIPPING_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class ShippingController {
  constructor(private readonly service: OrderService) {}

  @MessagePattern(ORDER_PATTERN.GET_ALL_SHIPPING_METHOD)
  async getAllShippingMethod() {
    return this.service.getAllShippingMethod();
  }

  @MessagePattern(ORDER_PATTERN.GET_SHIPPING_METHOD)
  async getShippingMethod(@Payload() shippingId: number) {
    return this.service.getShippingMethod(shippingId);
  }
}
