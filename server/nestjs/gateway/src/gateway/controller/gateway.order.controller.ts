import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { ORDER_PREFIX } from '@constants/requestPrefix';
import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';
import { UpdateOrderStatusDtoWithoutUser } from '@libs/order/dto/withoutUser/updateOrderStatus.dto';

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

  // @Auth(Role.ADMIN, Role.SHOP)
  @Patch()
  async updateOrderStatus(
    @GetUser() user: User,
    @Body() orderPayload: UpdateOrderStatusDtoWithoutUser,
  ) {
    return this.service.updateOrderStatus({ user, ...orderPayload });
  }

  @Get()
  async getAllOrders(@GetUser() user: User) {
    return this.service.getAllOrders(user);
  }

  @Get(':id')
  async getOrder(@GetUser() user: User, @Param('id') id: string) {
    return this.service.getOrder(user, { orderId: +id });
  }
}
