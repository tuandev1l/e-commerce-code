import { Controller, UseFilters } from '@nestjs/common';
import { CreateCategoryDto } from '@libs/product/dto/category/create-category.dto';
import { ProductService } from '@libs/product/product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateCategoryDto } from '@libs/product/dto/category/update-category.dto';
import { CATEGORY_PATTERN } from '@constants';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';

@Controller()
@UseFilters(ExceptionFilter)
export class CategoryController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern(CATEGORY_PATTERN.CREATE_CATEGORY)
  async createCategory(@Payload() createCategory: CreateCategoryDto) {
    return this.service.createCategory(createCategory);
  }

  @MessagePattern(CATEGORY_PATTERN.GET_CATEGORY)
  async getCategory(@Payload() categoryId: string) {
    return this.service.getCategory(categoryId);
  }

  @MessagePattern(CATEGORY_PATTERN.GET_ALL_CATEGORIES)
  async getAllCategories() {
    return this.service.getAllCategories();
  }

  @MessagePattern(CATEGORY_PATTERN.UPDATE_CATEGORY)
  async updateCategory(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.service.updateCategory(updateCategoryDto);
  }
}
