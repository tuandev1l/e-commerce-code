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
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { GatewayService } from '@gateway/service/gateway.service';

@Controller(PAYMENT_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class GatewayPaymentController {
  constructor(private readonly service: GatewayService) {}

  @Get('')
  async getAllPaymentMethod() {
    return this.service.getAllPaymentMethod();
  }

  @Get('/:id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.service.getPaymentMethod(+id);
  }
}
