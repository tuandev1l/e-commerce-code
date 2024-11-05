import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '../controller/product.controller';
import { ProductService } from '@libs/product/product.service';
import { mongooseConfig, productConfig } from '@libs/product/mongoose.config';
import { BrandController } from '../controller/brand.controller';
import { ShopController } from '../controller/shop.controller';
import { CategoryController } from '../controller/category.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(productConfig),
    MongooseModule.forFeature(mongooseConfig),
  ],
  controllers: [
    ProductController,
    BrandController,
    ShopController,
    CategoryController,
  ],
  providers: [ProductService],
})
export class ProductModule {}
