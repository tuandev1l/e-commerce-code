import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RatingService } from '@libs/rating/rating.service';
import { CreateRatingDto } from '@libs/rating/dto/withUser/createRating.dto';
import { UpdateRatingDto } from '@libs/rating/dto/withUser/updateRating.dto';
import { User } from '@user/entities/user.entity';
import { RATING_PATTERN } from '@constants';
import { GetAndDeleteRatingDto } from '@libs/rating/dto/withUser/getAndDeleteRating.dto';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';

@Controller()
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class RatingController {
  constructor(private readonly service: RatingService) {}

  @MessagePattern(RATING_PATTERN.GET_PRODUCT_RATING)
  async getProductRating(@Payload() productId: string) {
    return this.service.getProductRating(productId);
  }

  @MessagePattern(RATING_PATTERN.CREATE_RATING)
  async createRating(@Payload() createRatingDto: CreateRatingDto) {
    return this.service.createRating(createRatingDto);
  }

  @MessagePattern(RATING_PATTERN.UPDATE_RATING)
  async updateRating(@Payload() updateRatingDto: UpdateRatingDto) {
    return this.service.updateRating(updateRatingDto);
  }

  @MessagePattern(RATING_PATTERN.DELETE_RATING)
  async deleteRating(@Payload() getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    return this.service.deleteRating(getAndDeleteRatingDto);
  }

  @MessagePattern(RATING_PATTERN.GET_ALL_RATING_OF_PRODUCT)
  async getAllRatingOfProduct(@Payload() productId: string) {
    return this.service.getAllRatingsOfProduct(productId);
  }

  @MessagePattern(RATING_PATTERN.GET_RATING)
  async getRating(@Payload() getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    return this.service.getRating(getAndDeleteRatingDto);
  }

  @MessagePattern(RATING_PATTERN.GET_ALL_RATING_OF_USER)
  async getAllRatingOfUser(@Payload() user: User) {
    return this.service.getAllRatingOfUser(user);
  }
}
