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
import { CartModule } from '@libs/cart/cart.module';
import { OrderModule } from '@libs/order/order.module';
import { RoleGuard } from '@guard/role.guard';
import { RatingModule } from '@libs/rating/rating.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '@libs/queue';
import { MailerModule } from '@nestjs-modules/mailer';
import { SocketGatewayModule } from '@socket/socket.gateway.module';
import { ElasticsearchModule } from '@libs/searching/elasticsearch.module';
import { CacheModule } from '@libs/cache';

@Module({
  controllers: [],
  imports: [
    CacheModule,
    AuthModule,
    UserModule,
    LoggingModule,
    ElasticsearchModule,
    SocketGatewayModule,
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
    RatingModule,
    QueueModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGODB_USERNAME')}:${configService.get('MONGODB_PASSWORD')}@cluster0.s5h2f.mongodb.net/${configService.get('MONGODB_NAME')}`,
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: true,
          port: 465,
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
