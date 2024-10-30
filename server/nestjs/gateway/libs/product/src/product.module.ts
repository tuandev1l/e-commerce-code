import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '@libs/product/product.controller';
import { ProductService } from '@libs/product/product.service';
import { mongooseConfig, productConfig } from '@libs/product/mongoose.config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(productConfig),
    MongooseModule.forFeature(mongooseConfig),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
