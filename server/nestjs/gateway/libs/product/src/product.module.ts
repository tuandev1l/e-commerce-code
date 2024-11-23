import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from '../controller/product.controller';
import { ProductService } from '@libs/product/product.service';
import { mongooseConfig, productConfig } from '@libs/product/mongoose.config';
import { BrandController } from '../controller/brand.controller';
import { ShopController } from '../controller/shop.controller';
import { CategoryController } from '../controller/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { ElasticsearchService } from '@libs/searching/elasticsearch.service';
import { CacheService } from '@libs/cache';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync(productConfig),
    MongooseModule.forFeature(mongooseConfig),
    TypeOrmModule.forFeature([Rating, ProductRating, User]),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  controllers: [
    ProductController,
    BrandController,
    ShopController,
    CategoryController,
  ],
  providers: [
    ProductService,
    AuthService,
    JwtService,
    ElasticsearchService,
    CacheService,
  ],
})
export class ProductModule {}

// export class ProductModule implements OnModuleInit {
//   constructor(private readonly service: ProductService) {}
//
//   async onModuleInit(): Promise<any> {
//     await this.service.insertData();
//   }
// }
