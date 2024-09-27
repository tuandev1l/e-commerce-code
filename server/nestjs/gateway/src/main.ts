import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const gatewayApp = await NestFactory.create(AppModule);
  await gatewayApp.listen(3000);
}

void bootstrap();
