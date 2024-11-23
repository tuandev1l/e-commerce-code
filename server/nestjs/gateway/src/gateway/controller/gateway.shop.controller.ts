import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { SHOP_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { UpdateShopDtoWithoutId } from '@libs/product/dto/shop/update-shop-wid.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { User } from '@user/entities/user.entity';

@ApiTags('Gateway')
@Controller(SHOP_PREFIX)
export class GatewayShopController {
  constructor(private readonly service: GatewayService) {}

  @Auth(Role.ADMIN)
  @Get('not-approved')
  async getShopsNotApproved() {
    return this.service.getAllShopsNotApproved();
  }

  // @Auth(Role.ADMIN)
  @Post()
  async createShop(@GetUser() user: User, @Body() createShop: CreateShopDto) {
    return this.service.createShop({ ...createShop, user });
  }

  @Get('id/:id')
  async getShop(@Param('id') shopId: string) {
    return this.service.getShop(shopId);
  }

  @Get(':name')
  async getShopByName(@Param('name') shopName: string) {
    return this.service.getShopByName(shopName);
  }

  @Auth(Role.ADMIN)
  @Patch('approved/:id')
  async approveShop(@Param('id') shopId: string) {
    return this.service.approveShop({ shopId });
  }

  @Get()
  async getAllShops() {
    return this.service.getAllShops();
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Patch(':id')
  async updateShop(
    @Param('id') shopId: string,
    @Body() updateShopDto: UpdateShopDtoWithoutId,
  ) {
    return this.service.updateShop({ shopId, ...updateShopDto });
  }
}
