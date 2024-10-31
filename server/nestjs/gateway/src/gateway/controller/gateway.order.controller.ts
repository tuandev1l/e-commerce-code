import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import {
  ORDER_PREFIX,
  PAYMENT_PREFIX,
  SHIPPING_PREFIX,
} from '@constants/requestPrefix';
import { UpdateOrderStatusDto } from '@libs/order/dto/withoutUser/updateOrderStatus.dto';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';

@ApiTags('Gateway')
@Controller(ORDER_PREFIX)
export class GatewayOrderController {
  constructor(private readonly service: GatewayService) {}

  @Post()
  async createOrder(
    @GetUser() user: User,
    @Body() orderPayload: BulkCreateOrderDtoWithoutUser,
  ) {
    return this.service.createOrder(user, orderPayload);
  }

  @Patch('cancel')
  async cancelOrder(
    @GetUser() user: User,
    @Body() orderPayload: CancelOrderDtoWithoutUser,
  ) {
    return this.service.cancelOrder(user, orderPayload);
  }

  // @Auth(Role.ADMIN)
  @Patch()
  async updateOrderStatus(@Body() orderPayload: UpdateOrderStatusDto) {
    return this.service.updateOrderStatus(orderPayload);
  }

  @Get()
  async getAllOrders(@GetUser() user: User) {
    return this.service.getAllOrders(user);
  }

  @Get(':id')
  async getOrder(@GetUser() user: User, @Param() id: string) {
    return this.service.getOrder(user, { orderId: +id });
  }

  @SkipAuth()
  @Get(`${PAYMENT_PREFIX}`)
  async getAllPaymentMethod() {
    return this.service.getAllPaymentMethod();
  }

  @SkipAuth()
  @Get(`${PAYMENT_PREFIX}/:id`)
  async getPaymentMethod(@Param() id: string) {
    return this.service.getPaymentMethod(+id);
  }

  @SkipAuth()
  @Get(`${SHIPPING_PREFIX}`)
  async getAllShippingMethod() {
    return this.service.getAllShippingMethod();
  }

  @SkipAuth()
  @Get(`${SHIPPING_PREFIX}/:id`)
  async getShippingMethod(@Param() id: string) {
    return this.service.getShippingMethod(+id);
  }
}
