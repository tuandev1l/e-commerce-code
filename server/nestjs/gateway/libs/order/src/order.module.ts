import { Module, OnModuleInit } from '@nestjs/common';
import { OrderService } from '@libs/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@libs/order/entity/order.entity';
import { Payment } from '@libs/order/entity/payment.entity';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { PaymentController } from '@libs/order/controller/payment.controller';
import { ShippingController } from '@libs/order/controller/shipping.controller';
import { OrderController } from '@libs/order/controller/order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment, Shipping])],
  controllers: [OrderController, PaymentController, ShippingController],
  providers: [OrderService],
})
export class OrderModule implements OnModuleInit {
  constructor(private readonly service: OrderService) {}

  onModuleInit(): any {
    const shippingMethods = [
      {
        name: 'Giao hàng nhanh',
        imgUrl:
          'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En.png',
      },
      {
        name: 'Giao hàng tiết kiệm',
        imgUrl:
          'https://cdn.prod.website-files.com/5fb85f26f126ce08d792d2d9/65fddafcf36551945213fe85_After_kime.jpg',
      },
    ];
    const paymentMethod = [
      {
        name: 'Stripe',
        imgUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB1nacBhVfB9L9chvUPk35aYeg0bmYmP-Wag&s',
      },
      {
        name: 'Momo',
        imgUrl:
          'https://salt.tikicdn.com/ts/upload/ce/f6/e8/ea880ef285856f744e3ffb5d282d4b2d.jpg',
      },
      {
        name: 'VnPay',
        imgUrl:
          'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
      },
    ];
    void this.service.createPayment(paymentMethod);
    void this.service.createShippingMethod(shippingMethods);
  }
}
