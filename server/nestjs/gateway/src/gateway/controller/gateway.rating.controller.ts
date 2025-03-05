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
import { GetUser } from '@auth/decorator/get-user.decorator';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { AddIdParamToBody } from '@decorator/add-id-to-body.dectorator';
import { AddUserToBody } from '@decorator/add-user-to-body.dectorator';
import { UpdateRatingDto } from '@libs/rating/dto/updateRating.dto';
import { CreateRatingDto } from '@libs/rating/dto/createRating.dto';

@ApiTags('Gateway')
@Controller(RATING_PREFIX)
@UseFilters(ExceptionFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class GatewayRatingController {
  constructor(private readonly service: GatewayService) {}

  @Get('product-rating/:productId')
  async getProductRating(@Param('productId') productId: string) {
    return this.service.getProductRating(productId);
  }

  @Get('product/:id')
  async getAllRatingOfProduct(@Param('id') productId: string) {
    return this.service.getAllRatingsOfProduct(productId);
  }

  @Patch(':id')
  async updateRating(
    @Param('id') id: string,
    @GetUser() user: User,
    @AddIdParamToBody({ paramDest: 'ratingId' })
    @AddUserToBody()
    @Body()
    updateRatingDto: UpdateRatingDto,
  ) {
    return this.service.updateRating(updateRatingDto);
  }

  @Get('user')
  async getAllRatingOfUser(@GetUser() user: User) {
    return this.service.getAllRatingOfUser(user);
  }

  @Post()
  async createRating(
    @GetUser() user: User,
    @AddUserToBody()
    @Body()
    createRatingDto: CreateRatingDto,
  ) {
    return this.service.createRating(createRatingDto);
  }

  @Delete(':id')
  async deleteRating(@GetUser() user: User, @Param('id') id: string) {
    return this.service.deleteRating({ ratingId: +id, user });
  }

  @Get(':id')
  async getRating(@GetUser() user: User, @Param('id') id: string) {
    return this.service.getRating({ ratingId: +id, user });
  }
}
