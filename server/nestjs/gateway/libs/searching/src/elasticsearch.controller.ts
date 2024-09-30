import { ElasticsearchService } from '@libs/searching/elasticsearch.service';
import { ISearch } from '@libs/searching/search.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SEARCHING_PATTERN } from '@constants';
import { Controller } from '@nestjs/common';

@Controller()
export class ElasticsearchController {
  constructor(private readonly service: ElasticsearchService) {}

  @MessagePattern(SEARCHING_PATTERN.SEARCH_PRODUCTS)
  async getAllProductInElasticSearch(@Payload() search: ISearch) {
    return this.service.searchProduct(search);
  }
}
