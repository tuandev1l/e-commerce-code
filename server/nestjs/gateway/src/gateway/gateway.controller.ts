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
import { GatewayService } from '@gateway/gateway.service';
import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/update-product.dto';
import { PRODUCT_PREFIX, SEARCHING_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { ISearch } from '@libs/searching/search.interface';

@SkipAuth()
@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  constructor(private readonly service: GatewayService) {}

  @Post(`${SEARCHING_PREFIX}`)
  async searchProducts(@Body() search: ISearch) {
    return this.service.searchProductByElasticsearch(search);
  }

  // PRODUCT
  @Get(`${PRODUCT_PREFIX}`)
  async findAllProducts() {
    return this.service.findAllProduct();
  }

  @Get(`${PRODUCT_PREFIX}/:id`)
  async findOneProduct(@Param('id') id: string) {
    return this.service.findOneProduct(id);
  }

  @Post(`${PRODUCT_PREFIX}`)
  async createProduct(@Body() productDto: CreateProductDto) {
    return this.service.createProduct(productDto);
  }

  @Patch(`${PRODUCT_PREFIX}/:id`)
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ) {
    return this.service.updateProduct(id, productDto);
  }

  @Delete(`${PRODUCT_PREFIX}/:id`)
  async removeProduct(@Param('id') id: string) {
    return this.service.removeProduct(id);
  }
}
