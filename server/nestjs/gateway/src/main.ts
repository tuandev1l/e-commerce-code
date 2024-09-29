import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from '@middlewares/interceptor/transform.interceptor';
import { LoggingService } from '@logging/logging.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from '@config';
import { AppModule } from '@app.module';

async function bootstrap() {
  const gateway = await NestFactory.create(AppModule);
  const logger = gateway.get(LoggingService).getLogger('app');
  gateway.setGlobalPrefix('api/v1');
  gateway.useGlobalInterceptors(new TransformInterceptor());
  gateway.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      enableDebugMessages: true,
    }),
  );

  const document = SwaggerModule.createDocument(gateway, SwaggerConfig.config);
  SwaggerModule.setup('apidoc', gateway, document);
  await gateway.listen(3000);
  logger.info('Api docs at http://localhost:3000/apidoc');
}

void bootstrap();
