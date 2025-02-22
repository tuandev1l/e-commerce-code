import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { ORDER_PREFIX } from '@constants/requestPrefix';
import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { PayOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/payOrder.dto';
import { UpdateOrderStatusDto } from '@libs/order/dto/withUser/updateOrderStatus.dto';

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

  @Auth(Role.ADMIN, Role.SHOP)
  @Patch()
  async updateOrderStatus(
    @GetUser() user: User,
    @Body() orderPayload: UpdateOrderStatusDto,
  ) {
    return this.service.updateOrderStatus({ user, ...orderPayload });
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
    return this.service.getOrder(user, { orderId: +id });
  }

  @Post('get-payment-url')
  async getPaymentUrl(
    @GetUser() user: User,
    @Body() payOrderDto: PayOrderDtoWithoutUser,
  ) {
    return this.service.getPaymentUrl({ user, ...payOrderDto });
  }
}
