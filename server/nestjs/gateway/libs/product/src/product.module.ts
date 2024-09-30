import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@libs/product/entities/product.entity';
import { Brand, BrandSchema } from '@libs/product/entities/brand.entity';
import {
  Category,
  CategorySchema,
} from '@libs/product/entities/category.entity';
import { Shop, ShopSchema } from '@libs/product/entities/shop.entity';
import { ProductController } from '@libs/product/product.controller';
import { ProductService } from '@libs/product/product.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [],
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.pre('findOne', function (next) {
            this.populate('brand', 'slug name __v');
            next();
          });
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Shop.name,
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
