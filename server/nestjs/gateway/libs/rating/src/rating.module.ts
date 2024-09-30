import { Module } from '@nestjs/common';
import { RatingService } from '@libs/rating/rating.service';
import { RatingController } from '@libs/rating/rating.controller';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
