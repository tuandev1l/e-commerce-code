import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from '@middlewares/interceptor/transform.interceptor';
import { LoggingService } from '@logging/logging.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from '@config';
import { AppModule } from '@app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'e-commerce',
      queueOptions: {
        durable: true,
      },
    },
  });

  const logger = app.get(LoggingService).getLogger('app');
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      enableDebugMessages: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, SwaggerConfig.config);
  SwaggerModule.setup('apidoc', app, document);
  await app.startAllMicroservices();
  await app.listen(3000);
  logger.info('Api docs at http://localhost:3000/apidoc');
}

void bootstrap();
