import { Product, ProductSchema } from '@libs/product/entities/product.entity';
import { Brand, BrandSchema } from '@libs/product/entities/brand.entity';
import {
  Category,
  CategorySchema,
} from '@libs/product/entities/category.entity';
import { Shop, ShopSchema } from '@libs/product/entities/shop.entity';

export const productConfig = [
  {
    imports: [],
    name: Product.name,
    useFactory: () => {
      const schema = ProductSchema;
      schema.pre('findOne', function (next) {
        this.populate('brand', 'slug name __v');
        this.populate('seller');
        next();
      });
      return schema;
    },
  },
];

export const mongooseConfig = [
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
];
