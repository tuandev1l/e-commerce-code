import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { ORDER_PREFIX } from '@constants/requestPrefix';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { BulkCreateOrderDto } from '@libs/order/dto/bulkCreateOrder.dto';
import { CancelOrderDto } from '@libs/order/dto/cancelOrder.dto';
import { AddUserToBody } from '@decorator/add-user-to-body.dectorator';
import { UpdateOrderStatusDto } from '@libs/order/dto/updateOrderStatus.dto';
import { PayOrderDto } from '@libs/order/dto/payOrder.dto';

@ApiTags('Gateway')
@Controller(ORDER_PREFIX)
export class GatewayOrderController {
  constructor(private readonly service: GatewayService) {}

  @Post()
  async createOrder(@AddUserToBody() @Body() orderPayload: BulkCreateOrderDto) {
    return this.service.createOrder(orderPayload);
  }

  @Patch('cancel')
  async cancelOrder(@AddUserToBody() @Body() orderPayload: CancelOrderDto) {
    return this.service.cancelOrder(orderPayload);
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Patch()
  async updateOrderStatus(
    @AddUserToBody()
    @Body()
    orderPayload: UpdateOrderStatusDto,
  ) {
    return this.service.updateOrderStatus(orderPayload);
  }

  @Get()
  async getAllOrders(@GetUser() user: User) {
    return this.service.getAllOrders(user);
  }

  @Auth(Role.ADMIN)
  @Get('order-for-admin')
  async getAllOrdersForAdmin() {
    return this.service.getAllOrdersForAdmin();
  }

  @Auth(Role.SHOP)
  @Get('order-for-shop/:id')
  async getAllOrdersForShop(@Param('id') shopId: string) {
    return this.service.getAllOrdersForShop(shopId);
  }

  @Auth(Role.SHOP)
  @Get('order-prepared-for-shop/:id')
  async getAllOrdersPreparedForShop(@Param('id') shopId: string) {
    return this.service.getAllOrdersPreparedForShop(shopId);
  }

  @Get(':id')
  async getOrder(@GetUser() user: User, @Param('id') id: string) {
    return this.service.getOrder({ user, orderId: +id });
  }

  @Post('get-payment-url')
  async getPaymentUrl(
    @GetUser() user: User,
    @AddUserToBody()
    @Body()
    payOrderDto: PayOrderDto,
  ) {
    return this.service.getPaymentUrl(payOrderDto);
  }
}
