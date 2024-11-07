import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@lib/product/entities/product.entity';
import { Brand, BrandSchema } from '@lib/product/entities/brand.entity';
import {
  Category,
  CategorySchema,
} from '@lib/product/entities/category.entity';
import { Shop, ShopSchema } from '@lib/product/entities/shop.entity';
import { ProductController } from '@lib/product/product.controller';
import { ProductService } from '@lib/product/product.service';

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
      // {
      //   name: Product.name,
      //   schema: ProductSchema,
      // },
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
