import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { PRODUCT_PATTERN } from '@app/constants';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get('insert-data')
  // insertData() {
  //   return this.productService.insertData();
  // }

  @MessagePattern(PRODUCT_PATTERN.CREATE_PRODUCT)
  async create(@Payload() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ALL_PRODUCT)
  async findAll() {
    return this.productService.findAll();
  }

  @MessagePattern(PRODUCT_PATTERN.FIND_ONE_PRODUCT)
  async findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern(PRODUCT_PATTERN.UPDATE_PRODUCT)
  async update(@Payload() productDto: ProductDto) {
    return this.productService.update(productDto);
  }

  @MessagePattern(PRODUCT_PATTERN.REMOVE_PRODUCT)
  async remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
}
