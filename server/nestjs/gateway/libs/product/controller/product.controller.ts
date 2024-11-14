import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '@libs/product/product.service';
import { PRODUCT_PATTERN } from '@constants/pattern';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { CreateProductDto } from '@libs/product/dto/product/withUser/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/product/withUser/update-product.dto';

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
  async findAll(@Payload() page: number) {
    return this.productService.findAll(page);
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ONE_PRODUCT)
  async findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern(PRODUCT_PATTERN.UPDATE_PRODUCT)
  async update(@Payload() productDto: UpdateProductDto) {
    return this.productService.update(productDto);
  }

  @MessagePattern(PRODUCT_PATTERN.REMOVE_PRODUCT)
  async remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
}
