import { Module } from '@nestjs/common';
import { CartService } from '@libs/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';
import { CartController } from '@libs/cart/cart.controller';
import { ProductService } from '@libs/product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig, productConfig } from '@libs/product/mongoose.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    MongooseModule.forFeatureAsync(productConfig),
    MongooseModule.forFeature(mongooseConfig),
  ],
  controllers: [CartController],
  providers: [CartService, ProductService],
})
export class CartModule {}
