import { Module } from '@nestjs/common';
import { RatingService } from '@libs/rating/rating.service';
import { RatingController } from '@libs/rating/rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { Order } from '@libs/order/entity/order.entity';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { User } from '@user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Order, ProductRating, User])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
