import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PAYMENT_PREFIX } from '@constants/requestPrefix';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { OrderService } from '@libs/order/order.service';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';

@Controller(PAYMENT_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class PaymentController {
  constructor(private readonly service: OrderService) {}

  @Get('')
  async getAllPaymentMethod() {
    return this.service.getAllPaymentMethod();
  }

  @Get('/:id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.service.getPaymentMethod(+id);
  }
}
