import { Module } from '@nestjs/common';
import { ProductModule } from './product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigValidationSchema } from '../config.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      validationSchema: ConfigValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USERNAME')}:${configService.get('DB_PASSWORD')}@products.qevln.mongodb.net/${configService.get('DB_NAME')}`,
      }),
    }),
    ProductModule,
  ],
})
export class AppModule {}
