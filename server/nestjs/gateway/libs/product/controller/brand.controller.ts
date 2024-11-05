import { Controller, UseFilters } from '@nestjs/common';
import { ExceptionFilter } from '@base/exception/rpc.exception.filter';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from '@libs/product/product.service';
import { BRAND_PATTERN } from '@constants';
import { CreateBrandDto } from '@libs/product/dto/brand/create-brand.dto';
import { UpdateBrandDto } from '@libs/product/dto/brand/update-brand.dto';

@Controller()
@UseFilters(ExceptionFilter)
export class BrandController {
  constructor(private readonly service: ProductService) {}

  @MessagePattern(BRAND_PATTERN.CREATE_BRAND)
  async createBrand(@Payload() createBrand: CreateBrandDto) {
    return this.service.createBrand(createBrand);
  }

  @MessagePattern(BRAND_PATTERN.GET_BRAND)
  async getBrand(@Payload() brandId: string) {
    return this.service.getBrand(brandId);
  }

  @MessagePattern(BRAND_PATTERN.GET_BRAND_BY_NAME)
  async getBrandByName(@Payload() brandId: string) {
    return this.service.getBrandByName(brandId);
  }

  @MessagePattern(BRAND_PATTERN.GET_ALL_BRANDS)
  async getAllBrands() {
    return this.service.getAllBrands();
  }

  @MessagePattern(BRAND_PATTERN.UPDATE_BRAND)
  async updateBrand(@Payload() updateBrandDto: UpdateBrandDto) {
    return this.service.updateBrand(updateBrandDto);
  }
}
