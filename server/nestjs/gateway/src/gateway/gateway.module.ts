import { Global, Module } from '@nestjs/common';
import { GatewayService } from './service/gateway.service';
import { GatewayProductController } from './controller/gateway.product.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ProducerService } from '@gateway/service/producer.service';
import { GatewayCartController } from '@gateway/controller/gateway.cart.controller';
import { GatewayOrderController } from '@gateway/controller/gateway.order.controller';
import { GatewayRatingController } from '@gateway/controller/gateway.rating.controller';
import { GatewayBrandController } from '@gateway/controller/gateway.brand.controller';
import { GatewayCategoryController } from '@gateway/controller/gateway.category.controller';
import { GatewayPaymentController } from '@gateway/controller/gateway.payment.controller';
import { GatewayShippingController } from '@gateway/controller/gateway.shipping.controller';
import { GatewayShopController } from '@gateway/controller/gateway.shop.controller';

@Global()
@Module({
  controllers: [
    GatewayProductController,
    GatewayCartController,
    GatewayOrderController,
    GatewayRatingController,
    GatewayBrandController,
    GatewayCategoryController,
    GatewayPaymentController,
    GatewayShippingController,
    GatewayShopController,
  ],
  providers: [
    GatewayService,
    ProducerService,
    {
      provide: 'RABBITMQ_PRODUCER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const port = configService.get('RABBITMQ_MAIN_PORT');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}:${port}`],
            // urls: [
            //   'amqps://bawlehmb:be9T4hpzsA3TPpBiGuUWrXxypyUJPH8y@armadillo.rmq.cloudamqp.com/bawlehmb?connection_timeout=30',
            // ],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
  exports: [GatewayModule, GatewayService, ProducerService],
})
export class GatewayModule {}
