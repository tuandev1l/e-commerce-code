import { Controller, UseFilters } from '@nestjs/common';
import { ProductService } from '@libs/product/product.service';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { UpdateShopDto } from '@libs/product/dto/shop/update-shop.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SHOP_PATTERN } from '@constants';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';

@Controller()
@UseFilters(ExceptionFilter)
export class ShopController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern(SHOP_PATTERN.CREATE_SHOP)
  async createShop(@Payload() createShop: CreateShopDto) {
    return this.service.createShop(createShop);
  }

  @MessagePattern(SHOP_PATTERN.GET_SHOP)
  async getShop(@Payload() shopId: string) {
    return this.service.getShop(shopId);
  }

  @MessagePattern(SHOP_PATTERN.GET_SHOP_BY_NAME)
  async getShopByName(@Payload() shopName: string) {
    return this.service.getShopByName(shopName);
  }

  @MessagePattern(SHOP_PATTERN.GET_ALL_SHOPS)
  async getAllShops() {
    return this.service.getAllShops();
  }

  @MessagePattern(SHOP_PATTERN.UPDATE_SHOP)
  async updateShop(@Payload() updateShopDto: UpdateShopDto) {
    return this.service.updateShop(updateShopDto);
  }
}
