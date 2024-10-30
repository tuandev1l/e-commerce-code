import { Body, Controller, Delete, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/gateway.service';
import { CART_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/delItemWithoutUser.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { AddItemWithoutUserDto } from '@libs/cart/dto/addItemWithoutUser.dto';

@ApiTags('Gateway')
@Controller()
export class GatewayCartController {
  constructor(private readonly service: GatewayService) {}

  @Post(`${CART_PREFIX}/add-to-cart`)
  async addToCart(
    @Body() cartPayload: AddItemWithoutUserDto,
    @GetUser() user: User,
  ) {
    return this.service.addToCart(user, cartPayload);
  }

  @Delete(`${CART_PREFIX}/delete-from-cart`)
  async deleteFromCart(
    @GetUser() user: User,
    @Body() cartPayload: DelItemWithoutUserDto,
  ) {
    return this.service.deleteFromCart(user, cartPayload);
  }

  @Post(`${CART_PREFIX}`)
  async createCart(@GetUser() user: User) {
    return this.service.createCart(user);
  }
}
