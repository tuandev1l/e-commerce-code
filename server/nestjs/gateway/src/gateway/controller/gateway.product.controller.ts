import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { GatewayService } from '@gateway/service/gateway.service';
import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/update-product.dto';
import { PRODUCT_PREFIX, SEARCHING_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { ISearch } from '@libs/searching/search.interface';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';

@SkipAuth()
@ApiTags('Gateway')
@Controller(PRODUCT_PREFIX)
export class GatewayProductController {
  constructor(private readonly service: GatewayService) {}

  @Post(SEARCHING_PREFIX)
  async searchProducts(@Body() search: ISearch) {
    return this.service.searchProductByElasticsearch(search);
  }

  @Get()
  async findAllProducts() {
    return this.service.findAllProduct();
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.service.findOneProduct(id);
  }

  @Auth(Role.SHOP)
  @Post()
  async createProduct(@Body() productDto: CreateProductDto) {
    return this.service.createProduct(productDto);
  }

  @Auth(Role.SHOP)
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ) {
    return this.service.updateProduct(id, productDto);
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    return this.service.removeProduct(id);
  }
}
