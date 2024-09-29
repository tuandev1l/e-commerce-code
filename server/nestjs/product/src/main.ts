import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'e-commerce',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen();

  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
}

void bootstrap();
