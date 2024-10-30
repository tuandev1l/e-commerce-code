import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { UserModule } from '@user/user.module';
import { LoggingModule } from '@logging/logging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiConfig, TypeormConfig } from '@config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from '@libs/product/product.module';
import { GatewayModule } from '@gateway/gateway.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { ElasticsearchModule } from '@libs/searching/elasticsearch.module';
import { CartModule } from '@libs/cart/cart.module';
import { OrderModule } from '@libs/order/order.module';

@Module({
  controllers: [],
  imports: [
    AuthModule,
    UserModule,
    LoggingModule,
    // ElasticsearchModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      validationSchema: JoiConfig.config,
    }),
    TypeOrmModule.forRootAsync(TypeormConfig.config),
    GatewayModule,
    ProductModule,
    CartModule,
    OrderModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGODB_USERNAME')}:${configService.get('MONGODB_PASSWORD')}@products.qevln.mongodb.net/${configService.get('MONGODB_NAME')}`,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
