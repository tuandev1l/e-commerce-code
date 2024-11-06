import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { SHIPPING_PREFIX } from '@constants/requestPrefix';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { OrderService } from '@libs/order/order.service';

@Controller(SHIPPING_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class ShippingController {
  constructor(private readonly service: OrderService) {}

  @Get()
  async getAllShippingMethod() {
    return this.service.getAllShippingMethod();
  }

  @Get(':id')
  async getShippingMethod(@Param('id') id: string) {
    return this.service.getShippingMethod(+id);
  }
}
