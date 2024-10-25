import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CART_PATTERN } from '@constants';
import { CartService } from '@libs/cart/cart.service';
import { User } from '@user/entities/user.entity';
import { AddAndDeleteItemFromCartDto } from '@libs/cart/dto/ANDItem.dto';

@Controller()
export class CartController {
  constructor(private readonly service: CartService) {}

  @MessagePattern(CART_PATTERN.ADD_TO_CART)
  async addToCart(@Payload() cartPayload: AddAndDeleteItemFromCartDto) {
    return this.service.addToCart(cartPayload);
  }

  @MessagePattern(CART_PATTERN.DELETE_FROM_CART)
  async deleteFromCart(@Payload() cartPayload: AddAndDeleteItemFromCartDto) {
    return this.service.deleteFromCart(cartPayload);
  }

  @MessagePattern(CART_PATTERN.CREATE_CART)
  async createCart(@Payload() user: User) {
    return this.service.createCart(user);
  }
}
