import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@app/entities/product.entity';
import { Brand, BrandSchema } from '@app/entities/brand.entity';
import { Category, CategorySchema } from '@app/entities/category.entity';
import { Shop, ShopSchema } from '@app/entities/shop.entity';
import { ProductController } from '@app/product.controller';
import { ProductService } from '@app/product.service';

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
