import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { SHOP_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { UpdateShopDtoWithoutId } from '@libs/product/dto/shop/update-shop-wid.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';

@Auth(Role.ADMIN)
@ApiTags('Gateway')
@Controller(SHOP_PREFIX)
export class GatewayShopController {
  constructor(private readonly service: GatewayService) {}

  @Post()
  async createShop(@Body() createShop: CreateShopDto) {
    return this.service.createShop(createShop);
  }

  @Get(':id')
  async getShop(@Param('id') shopId: string) {
    return this.service.getShop(shopId);
  }

  @Get('shop/:name')
  async getShopByName(@Param('name') shopName: string) {
    return this.service.getShopByName(shopName);
  }

  @Get()
  async getAllShops() {
    return this.service.getAllShops();
  }

  @Patch(':id')
  async updateShop(
    @Param('id') shopId: string,
    @Body() updateShopDto: UpdateShopDtoWithoutId,
  ) {
    return this.service.updateShop({ shopId, ...updateShopDto });
  }
}
