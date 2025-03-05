import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { SHOP_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { AddUserToBody } from '@decorator/add-user-to-body.dectorator';
import { AddIdParamToBody } from '@decorator/add-id-to-body.dectorator';
import { UpdateShopDto } from '@libs/product/dto/shop/update-shop.dto';

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
  async createShop(@AddUserToBody() @Body() createShop: CreateShopDto) {
    return this.service.createShop(createShop);
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
    @AddIdParamToBody({ paramDest: 'shopId' })
    @Body()
    updateShopDto: UpdateShopDto,
  ) {
    return this.service.updateShop(updateShopDto);
  }
}
