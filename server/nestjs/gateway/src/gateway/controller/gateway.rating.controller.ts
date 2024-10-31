import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { RATING_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { CreateRatingDtoWithoutUser } from '@libs/rating/dto/withoutUser/createRating.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { UpdateRatingDtoWithoutUser } from '@libs/rating/dto/withoutUser/updateRating.dto';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';

@ApiTags('Gateway')
@Controller(RATING_PREFIX)
@UseFilters(ExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class GatewayRatingController {
  constructor(private readonly service: GatewayService) {}

  @Patch(':id')
  async updateRating(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateRatingDto: UpdateRatingDtoWithoutUser,
  ) {
    return this.service.updateRating({
      ratingId: +id,
      user,
      ...updateRatingDto,
    });
  }

  @Get('user')
  async getAllRatingOfUser(@GetUser() user: User) {
    return this.service.getAllRatingOfUser(user);
  }

  @Post()
  async createRating(
    @GetUser() user: User,
    @Body() createRatingDto: CreateRatingDtoWithoutUser,
  ) {
    return this.service.createRating({ ...createRatingDto, user });
  }

  @Delete(':id')
  async deleteRating(@GetUser() user: User, @Param('id') id: string) {
    return this.service.deleteRating({ ratingId: +id, user });
  }

  @Get('product/:id')
  async getAllRatingOfProduct(@Param('id') productId: string) {
    return this.service.getAllRatingsOfProduct(productId);
  }

  @Get(':id')
  async getRating(@GetUser() user: User, @Param('id') id: string) {
    return this.service.getRating({ ratingId: +id, user });
  }
}
