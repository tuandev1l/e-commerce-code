import { Module } from '@nestjs/common';
import { CartService } from '@libs/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';
import { CartController } from '@libs/cart/cart.controller';
import { ProductService } from '@libs/product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig, productConfig } from '@libs/product/mongoose.config';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { Rating } from '@libs/rating/entity/rating.entity';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { ElasticsearchService } from '@libs/searching/elasticsearch.service';
import { CacheService } from '@libs/cache';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, ProductRating, Rating, User]),
    MongooseModule.forFeatureAsync(productConfig),
    MongooseModule.forFeature(mongooseConfig),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    ProductService,
    AuthService,
    JwtService,
    ElasticsearchService,
    CacheService,
  ],
})
export class CartModule {}
