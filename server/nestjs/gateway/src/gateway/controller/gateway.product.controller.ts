import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { GatewayService } from '@gateway/service/gateway.service';
import { PRODUCT_PREFIX, SEARCHING_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { ISearch } from '@libs/searching/search.interface';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { CreateProductDtoWithoutUser } from '@libs/product/dto/product/withoutUser/create-product.dto';
import { UpdateProductDtoWithoutUser } from '@libs/product/dto/product/withoutUser/update-product.dto';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { ProductFilterDto } from '@libs/product/dto/product/withoutUser/productFilter.dto';
import { Get5ProductsInTheSameCategoryDto } from '@libs/product/dto/product/withUser/get-5-products-in-the-same-category.dto';

@ApiTags('Gateway')
@Controller(PRODUCT_PREFIX)
export class GatewayProductController {
  constructor(private readonly service: GatewayService) {}

  @SkipAuth()
  @Get('five-products-similar')
  async find5Products(@Query() dto: Get5ProductsInTheSameCategoryDto) {
    return this.service.find5Products(dto);
  }

  @SkipAuth()
  @Get('random-products')
  async randomProducts() {
    return this.service.randomProducts();
  }

  @SkipAuth()
  @Post(SEARCHING_PREFIX)
  async searchProducts(@Body() search: ISearch) {
    return this.service.searchProductByElasticsearch(search);
  }

  @SkipAuth()
  @Get()
  async findAllProducts(@Query() productFilterDto: ProductFilterDto) {
    return this.service.findAllProduct(productFilterDto);
  }

  @SkipAuth()
  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.service.findOneProduct(id);
  }

  @Auth(Role.SHOP)
  @Post()
  async createProduct(
    @GetUser() user: User,
    @Body() productDto: CreateProductDtoWithoutUser,
  ) {
    return this.service.createProduct({ user, ...productDto });
  }

  @Auth(Role.SHOP)
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() productDto: UpdateProductDtoWithoutUser,
  ) {
    return this.service.updateProduct({ productId: id, user, ...productDto });
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Delete(':id')
  async removeProduct(@GetUser() user: User, @Param('id') id: string) {
    return this.service.removeProduct({ user, id });
  }

  // @Auth(Role.ADMIN, Role.SHOP)
  @Get('shop/:id')
  async getAllProductOfShop(@Param('id') id: string) {
    return this.service.getAllProductsOfShop(id);
  }
}
