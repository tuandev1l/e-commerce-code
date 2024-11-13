import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { CART_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/entities/user.entity';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { AddItemWithoutUserDto } from '@libs/cart/dto/withoutUser/addItemWithoutUser.dto';
import { ChangeQuantityWithoutUserDto } from '@libs/cart/dto/withoutUser/changeQuantityWithoutUser.dto';

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

  @Patch('quantity')
  async changeQuantity(
    @Body() changeQuantityDto: ChangeQuantityWithoutUserDto,
    @GetUser() user: User,
  ) {
    return this.service.changeQuantity({ ...changeQuantityDto, user });
  }

  @Delete(':productId')
  async deleteFromCart(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ) {
    return this.service.deleteFromCart({ user, productId });
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
