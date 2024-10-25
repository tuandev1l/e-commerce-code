import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@constants';
import { OrderService } from '@libs/order/order.service';
import { CreateOrderDto } from '@libs/order/dto/createOrder.dto';
import { CancelOrderDto } from '@libs/order/dto/cancelOrder.dto';
import { UpdateOrderStatusDto } from '@libs/order/dto/updateOrderStatus.dto';
import { User } from '@user/entities/user.entity';
import { GetOrderDto } from '@libs/order/dto/getOrder.dto';

@Controller()
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @MessagePattern(ORDER_PATTERN.CREATE_ORDER)
  async createOrder(@Payload() orderPayload: CreateOrderDto) {
    return this.service.createOrder(orderPayload);
  }

  @MessagePattern(ORDER_PATTERN.CANCEL_ORDER)
  async cancelOrder(@Payload() orderPayload: CancelOrderDto) {
    return this.service.cancelOrder(orderPayload);
  }

  @MessagePattern(ORDER_PATTERN.UPDATE_ORDER_STATUS)
  async updateOrderStatus(@Payload() orderPayload: UpdateOrderStatusDto) {
    return this.service.updateOrderStatus(orderPayload);
  }

  @MessagePattern(ORDER_PATTERN.GET_ALL_ORDERS)
  async getAllOrders(@Payload() user: User) {
    return this.service.getAllOrders(user);
  }

  @MessagePattern(ORDER_PATTERN.GET_ORDER)
  async getOrder(@Payload() getOrderDto: GetOrderDto) {
    return this.service.getOrder(getOrderDto);
  }
}
