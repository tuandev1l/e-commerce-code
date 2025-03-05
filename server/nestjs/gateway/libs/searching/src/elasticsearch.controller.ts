import { ElasticsearchService } from '@libs/searching/elasticsearch.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { SEARCHING_PATTERN } from '@constants';
import { ProductFilterDto } from '@libs/product/dto/product/productFilter.dto';

@Controller('searching')
@SkipAuth()
export class ElasticsearchController {
  constructor(private readonly service: ElasticsearchService) {}

  @MessagePattern(SEARCHING_PATTERN.SEARCH_PRODUCTS)
  async getAllProductInElasticSearch(
    @Payload() productFilterDto: ProductFilterDto,
  ) {
    return this.service.searchProductNormal(productFilterDto);
  }

  @MessagePattern(SEARCHING_PATTERN.SEARCH_PRODUCTS_USING_KNN)
  async getAllProductInElasticSearchUsingKnn(
    @Payload() productFilterDto: ProductFilterDto,
  ) {
    return this.service.searchProductUsingKnn(productFilterDto);
  }
}
