import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GatewayService } from '@gateway/service/gateway.service';
import { CATEGORY_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '@libs/product/dto/category/create-category.dto';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { AddIdParamToBody } from '@decorator/add-id-to-body.dectorator';
import { UpdateCategoryDto } from '@libs/product/dto/category/update-category.dto';

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

  @SkipAuth()
  @Get()
  async getAllCategories() {
    return this.service.getAllCategories();
  }

  @Auth(Role.ADMIN)
  @Patch(':id')
  async updateCategory(
    @Param('id') categoryId: string,
    @AddIdParamToBody({ paramDest: 'categoryId' })
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.service.updateCategory(updateCategoryDto);
  }
}
