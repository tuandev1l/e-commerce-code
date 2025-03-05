import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateBrandDto } from '@libs/product/dto/brand/create-brand.dto';
import { GatewayService } from '@gateway/service/gateway.service';
import { BRAND_PREFIX } from '@constants/requestPrefix';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@auth/decorator/auth.decorator';
import { Role } from '@auth';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { UpdateBrandDto } from '@libs/product/dto/brand/update-brand.dto';
import { AddIdParamToBody } from '@decorator/add-id-to-body.dectorator';

@ApiTags('Gateway')
@Controller(BRAND_PREFIX)
export class GatewayBrandController {
  constructor(private readonly service: GatewayService) {}

  @Auth(Role.ADMIN)
  @Post()
  async createBrand(@Body() createBrand: CreateBrandDto) {
    return this.service.createBrand(createBrand);
  }

  @Get(':id')
  async getBrand(@Param('id') brandId: string) {
    return this.service.getBrand(brandId);
  }

  @Get('brand/:name')
  async getBrandByName(@Param('name') brandName: string) {
    return this.service.getBrandByName(brandName);
  }

  @SkipAuth()
  @Get()
  async getAllBrands() {
    return this.service.getAllBrands();
  }

  @Auth(Role.ADMIN, Role.SHOP)
  @Patch(':id')
  async updateBrand(
    @Param('id') brandId: string,
    @AddIdParamToBody({ paramDest: 'brandId' })
    @Body()
    updateBrandDto: UpdateBrandDto,
  ) {
    return this.service.updateBrand(updateBrandDto);
  }
}
