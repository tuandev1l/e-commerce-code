import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@auth/auth.module';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { UserModule } from '@user/user.module';
import { LoggingModule } from '@logging/logging.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiConfig, TypeormConfig } from '@config';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  controllers: [],
  imports: [
    AuthModule,
    UserModule,
    LoggingModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      validationSchema: JoiConfig.config,
    }),
    TypeOrmModule.forRootAsync(TypeormConfig.config),
    GatewayModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
