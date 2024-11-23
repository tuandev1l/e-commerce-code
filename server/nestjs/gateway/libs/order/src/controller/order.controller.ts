import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@constants';
import { OrderService } from '@libs/order/order.service';
import { CancelOrderDto } from '@libs/order/dto/withUser/cancelOrder.dto';
import { UpdateOrderStatusDto } from '@libs/order/dto/withUser/updateOrderStatus.dto';
import { User } from '@user/entities/user.entity';
import { GetOrderDto } from '@libs/order/dto/withUser/getOrder.dto';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { BulkCreateOrderDto } from '@libs/order/dto/withUser/bulkCreateOrder.dto';
import { PayOrderDto } from '@libs/order/dto/withUser/payOrder.dto';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @MessagePattern(ORDER_PATTERN.CREATE_ORDER)
  async createOrder(@Payload() orderPayload: BulkCreateOrderDto) {
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

  @MessagePattern(ORDER_PATTERN.GET_ALL_ORDERS_FOR_ADMIN)
  async getAllOrdersForAdmin() {
    return this.service.getAllOrdersForAdmin();
  }

  @MessagePattern(ORDER_PATTERN.GET_ALL_ORDERS_FOR_SHOP)
  async getAllOrdersForShop(@Payload() shopId: string) {
    return this.service.getAllOrdersForShop(shopId);
  }

  @MessagePattern(ORDER_PATTERN.GET_ALL_ORDERS_PREPARED_FOR_SHOP)
  async getAllOrdersPreparedForShop(@Payload() shopId: string) {
    return this.service.getAllOrdersPreparedForShop(shopId);
  }

  @MessagePattern(ORDER_PATTERN.GET_ORDER)
  async getOrder(@Payload() getOrderDto: GetOrderDto) {
    return this.service.getOrder(getOrderDto);
  }

  @MessagePattern(ORDER_PATTERN.PAY_ORDER)
  async payOrder(@Payload() payOrderDto: PayOrderDto) {
    return this.service.payOrder(payOrderDto);
  }
}
