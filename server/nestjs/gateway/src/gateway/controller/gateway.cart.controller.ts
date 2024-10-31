import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { CART_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/withoutUser/delItemWithoutUser.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { AddItemWithoutUserDto } from '@libs/cart/dto/withoutUser/addItemWithoutUser.dto';

@ApiTags('Gateway')
@Controller(CART_PREFIX)
export class GatewayCartController {
  constructor(private readonly service: GatewayService) {}

  @Post('add-to-cart')
  async addToCart(
    @Body() cartPayload: AddItemWithoutUserDto,
    @GetUser() user: User,
  ) {
    return this.service.addToCart(user, cartPayload);
  }

  @Delete('delete-from-cart')
  async deleteFromCart(
    @GetUser() user: User,
    @Body() cartPayload: DelItemWithoutUserDto,
  ) {
    return this.service.deleteFromCart(user, cartPayload);
  }

  @Post()
  async createCart(@GetUser() user: User) {
    return this.service.createCart(user);
  }

  @Get()
  async getCart(@GetUser() user: User) {
    return this.service.getCart(user);
  }
}
