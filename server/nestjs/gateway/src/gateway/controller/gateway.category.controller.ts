import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { CATEGORY_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '@libs/product/dto/category/create-category.dto';
import { UpdateCategoryDtoWithoutId } from '@libs/product/dto/category/update-category-wid.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';

@ApiTags('Gateway')
@Controller(CATEGORY_PREFIX)
export class GatewayCategoryController {
  constructor(private readonly service: GatewayService) {}

  @Auth(Role.ADMIN)
  @Post()
  async createCategory(@Body() createCategory: CreateCategoryDto) {
    return this.service.createCategory(createCategory);
  }

  @Get(':id')
  async getCategory(@Param('id') categoryId: string) {
    return this.service.getCategory(categoryId);
  }

  @Get()
  async getAllCategories() {
    return this.service.getAllCategories();
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDtoWithoutId,
  ) {
    return this.service.updateCategory({ categoryId, ...updateCategoryDto });
  }
}
