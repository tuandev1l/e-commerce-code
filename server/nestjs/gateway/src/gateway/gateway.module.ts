import { Global, Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Global()
@Module({
  controllers: [GatewayController],
  providers: [
    GatewayService,
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
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class GatewayModule {}
