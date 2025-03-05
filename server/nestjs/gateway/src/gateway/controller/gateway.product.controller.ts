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
import { GetUser } from '@auth/decorator/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { AddUserToBody } from '@decorator/add-user-to-body.dectorator';
import { CreateProductDto } from '@libs/product/dto/product/create-product.dto';
import { Get5ProductsInTheSameCategoryDto } from '@libs/product/dto/product/get-5-products-in-the-same-category.dto';
import { AddIdParamToBody } from '@decorator/add-id-to-body.dectorator';
import { UpdateProductDto } from '@libs/product/dto/product/update-product.dto';
import { ProductFilterDto } from '@libs/product/dto/product/productFilter.dto';

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
    @AddUserToBody()
    @Body()
    productDto: CreateProductDto,
  ) {
    return this.service.createProduct(productDto);
  }

  @Auth(Role.SHOP)
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @AddIdParamToBody({ paramDest: 'productId' })
    @AddUserToBody()
    @Body()
    productDto: UpdateProductDto,
  ) {
    return this.service.updateProduct(productDto);
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Delete(':id')
  async removeProduct(@GetUser() user: User, @Param('id') id: string) {
    return this.service.removeProduct({ user, id });
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Get('shop/:id')
  async getAllProductOfShop(@Param('id') id: string) {
    return this.service.getAllProductsOfShop(id);
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Patch('back-to-sell/:id')
  async backToSell(@GetUser() user: User, @Param('id') id: string) {
    return this.service.backToSell({ user, id });
  }
}
