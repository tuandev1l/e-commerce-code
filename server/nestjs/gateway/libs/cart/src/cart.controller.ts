import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CART_PATTERN } from '@constants';
import { CartService } from '@libs/cart/cart.service';
import { User } from '@user/entities/user.entity';
import { DelItemDto } from '@libs/cart/dto/withUser/delItem.dto';
import { AddItemDto } from '@libs/cart/dto/withUser/addItem.dto';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';

@Controller()
@UseFilters(new ExceptionFilter())
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  constructor(private readonly service: CartService) {}

  @MessagePattern(CART_PATTERN.ADD_TO_CART)
  async addToCart(@Payload() cartPayload: AddItemDto) {
    return this.service.addToCart(cartPayload);
  }

  @MessagePattern(CART_PATTERN.DELETE_FROM_CART)
  async deleteFromCart(@Payload() cartPayload: DelItemDto) {
    return this.service.deleteFromCart(cartPayload);
  }

  @MessagePattern(CART_PATTERN.CREATE_CART)
  async createCart(@Payload() user: User) {
    return this.service.createCart(user);
  }

  @MessagePattern(CART_PATTERN.GET_CART)
  async getCart(@Payload() user: User) {
    return this.service.getCart(user);
  }
}
