import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '@libs/product/product.service';
import { PRODUCT_PATTERN } from '@constants/pattern';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { CreateProductDto } from '@libs/product/dto/product/withUser/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/product/withUser/update-product.dto';
import { ProductFilterDto } from '@libs/product/dto/product/withoutUser/productFilter.dto';
import { DeleteProductDto } from '@libs/product/dto/product/withUser/deleteProduct.dto';
import { Get5ProductsInTheSameCategoryDto } from '@libs/product/dto/product/withUser/get-5-products-in-the-same-category.dto';

@Controller()
@UseFilters(new ExceptionFilter())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get('insert-data')
  // insertData() {
  //   return this.productService.insertData();
  // }

  @MessagePattern(PRODUCT_PATTERN.CREATE_PRODUCT)
  async create(@Payload() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ALL_PRODUCT)
  async findAll(@Payload() productFilterDto: ProductFilterDto) {
    return this.productService.findAll(productFilterDto);
  }

  @MessagePattern(PRODUCT_PATTERN.BACK_TO_SELL)
  async backToSell(@Payload() deleteProductDto: DeleteProductDto) {
    return this.productService.backToSell(deleteProductDto);
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_5_PRODUCTS_IN_THE_SAME_CATEGORY)
  async find5ProductsInTheSameCategory(
    @Payload() dto: Get5ProductsInTheSameCategoryDto,
  ) {
    return this.productService.find5ProductInSameCategory(dto);
  }

  @MessagePattern(PRODUCT_PATTERN.OTHER_RANDOM_PRODUCT)
  async getRandomProducts() {
    return this.productService.getRandomProducts();
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ALL_PRODUCT_OF_SHOP)
  async findAllProductsOfShop(@Payload() shopId: string) {
    return this.productService.findAllProductsOfShop(shopId);
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ONE_PRODUCT)
  async findOne(@Payload() id: string) {
    // return this.productService.findOne(id);
    return this.productService.findOneWithES(id);
  }

  @MessagePattern(PRODUCT_PATTERN.UPDATE_PRODUCT)
  async update(@Payload() productDto: UpdateProductDto) {
    return this.productService.update(productDto);
  }

  @MessagePattern(PRODUCT_PATTERN.REMOVE_PRODUCT)
  async remove(@Payload() deleteProductDto: DeleteProductDto) {
    return this.productService.remove(deleteProductDto);
  }
}
