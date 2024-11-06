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
import { GatewayService } from '@gateway/service/gateway.service';

@Controller(SHIPPING_PREFIX)
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
@SkipAuth()
export class GatewayShippingController {
  constructor(private readonly service: GatewayService) {}

  @Get()
  async getAllShippingMethod() {
    return this.service.getAllShippingMethod();
  }

  @Get(':id')
  async getShippingMethod(@Param('id') id: string) {
    return this.service.getShippingMethod(+id);
  }
}
