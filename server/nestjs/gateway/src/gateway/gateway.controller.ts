import { Controller, Get, Param } from '@nestjs/common';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { GatewayService } from '@gateway/gateway.service';

@SkipAuth()
@Controller('gateway')
export class GatewayController {
  constructor(private readonly service: GatewayService) {}

  @Get()
  async findAllProducts() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return this.service.create(productDto);
  }

  @Put()
  async updateProduct(@Body() productDto: ProductDto) {
    return this.service.update(productDto);
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
