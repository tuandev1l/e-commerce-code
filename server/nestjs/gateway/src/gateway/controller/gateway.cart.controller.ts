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
import { AddItemDto } from '@libs/cart/dto/addItem.dto';
import { AddUserToBody } from '@decorator/add-user-to-body.dectorator';
import { ChangeQuantityInCartDto } from '@libs/cart/dto/changeQuantityInCart.dto';

@ApiTags('Gateway')
@Controller(CART_PREFIX)
export class GatewayCartController {
  constructor(private readonly service: GatewayService) {}

  @Post('add-to-cart')
  async addToCart(
    @AddUserToBody()
    @Body()
    cartPayload: AddItemDto,
  ) {
    return this.service.addToCart(cartPayload);
  }

  @Patch('quantity')
  async changeQuantity(
    @AddUserToBody()
    @Body()
    changeQuantityDto: ChangeQuantityInCartDto,
  ) {
    return this.service.changeQuantity(changeQuantityDto);
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
