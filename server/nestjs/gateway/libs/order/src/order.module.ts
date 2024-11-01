import { Module, OnModuleInit } from '@nestjs/common';
import { OrderService } from '@libs/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@libs/order/entity/order.entity';
import { Payment } from '@libs/order/entity/payment.entity';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { OrderController } from '@libs/order/order.controller';
import { PaymentController } from '@libs/order/payment.controller';
import { ShippingController } from '@libs/order/shipping.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment, Shipping])],
  controllers: [OrderController, PaymentController, ShippingController],
  providers: [OrderService],
})
export class OrderModule implements OnModuleInit {
  constructor(private readonly service: OrderService) {}

  onModuleInit(): any {
    const shippingMethods = ['Giao hàng nhanh', 'Giao hàng tiết kiệm'];
    const paymentMethod = ['Stripe', 'Momo', 'VnPay'];
    void this.service.createPayment(paymentMethod);
    void this.service.createShippingMethod(shippingMethods);
  }
}
