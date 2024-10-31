import { Injectable } from '@nestjs/common';
import { Order } from '@libs/order/entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@libs/order/entity/payment.entity';
import { Repository } from 'typeorm';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { PaymentEnum } from '@share/enums/payment.enum';
import { ShippingEnum } from '@share/enums/shipping.enum';
import { ORDER_STATUS } from '@libs/order/enum';
import { UpdateOrderStatusDto } from '@libs/order/dto/withoutUser/updateOrderStatus.dto';
import { User } from '@user/entities/user.entity';
import { CancelOrderDto } from '@libs/order/dto/withUser/cancelOrder.dto';
import { GetOrderDto } from '@libs/order/dto/withUser/getOrder.dto';
import { RpcNotFound } from '@base/exception/exception.resolver';
import { BulkCreateOrderDto } from '@libs/order/dto/withUser/bulkCreateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private readonly repository: Repository<Order>,
    @InjectRepository(Shipping)
    private readonly shippingRepo: Repository<Shipping>,
  ) {}

  async getAllOrders(user: User) {
    return this.repository.find({
      where: { userId: user.id },
      relations: ['shipping', 'payment'],
    });
  }

  async getOrder(getOrderDto: GetOrderDto) {
    const { user, orderId } = getOrderDto;
    const order = await this.repository.findOne({
      where: {
        userId: user.id,
        id: orderId,
      },
      relations: ['shipping', 'payment'],
    });
    if (!order) {
      throw new RpcNotFound('There is no order with this ID');
    }
    return order;
  }

  async cancelOrder(orderPayload: CancelOrderDto) {
    const { user, orderId } = orderPayload;
    const order = await this.getOrder({ user, orderId });
    order.status = ORDER_STATUS.CANCEL;
    return this.repository.save(order);
  }

  async createOrder(orderPayload: BulkCreateOrderDto) {
    const { user, orders } = orderPayload;
    const orderEntities = orders.map((order) => {
      return this.repository.create({
        status: ORDER_STATUS.PREPARED,
        invoice: order.invoice,
        paymentId: order.paymentId,
        shippingId: order.shippingId,
        item: order.item,
        statusHistories: [],
        userId: user.id,
      });
    });

    return this.repository.save(orderEntities);
  }

  async createPayment(payments: string[]) {
    const isPaymentExisted = await this.paymentRepo.find();
    if (isPaymentExisted.length > 0) {
      return;
    }

    const paymentEntities = payments.map((payment) => {
      return this.paymentRepo.create({
        method: payment,
        status: PaymentEnum.AVAILABLE,
        description: `Thanh toán thông qua cổng ${payment}`,
        isPrepaid: true,
      });
    });

    void this.paymentRepo.save(paymentEntities);
  }

  async createShippingMethod(shippingMethods: string[]) {
    const isShippingMethodExisted = await this.shippingRepo.find();
    if (isShippingMethodExisted.length > 0) {
      return;
    }

    const shippingEntities = shippingMethods.map((shipping) => {
      return this.shippingRepo.create({
        partnerName: shipping,
        status: ShippingEnum.AVAILABLE,
      });
    });

    void this.shippingRepo.save(shippingEntities);
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const { orderId, status, data } = updateOrderStatusDto;
    const order = await this.repository.findOneBy({ id: orderId });
    if (!order) {
      throw new RpcNotFound('There is no order with this ID');
    }

    order.status = status;
    order.statusHistories.push({
      status: status,
      data: data,
      createdAt: new Date().toString(),
    });

    return this.repository.save(order);
  }

  async getAllShippingMethod() {
    return this.shippingRepo.find();
  }

  async getAllPaymentMethod() {
    return this.paymentRepo.find();
  }

  async getShippingMethod(id: number) {
    const shippingMethod = this.shippingRepo.findOneBy({ id });
    if (!shippingMethod) {
      throw new RpcNotFound('There is no shipping with this ID');
    }
    return shippingMethod;
  }

  async getPaymentMethod(id: number) {
    const paymentMethod = this.paymentRepo.findOneBy({ id });
    if (!paymentMethod) {
      throw new RpcNotFound('There is no payment with this ID');
    }
    return paymentMethod;
  }
}
