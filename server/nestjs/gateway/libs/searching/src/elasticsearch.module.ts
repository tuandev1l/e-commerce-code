import { Global, Module } from '@nestjs/common';
import { ElasticsearchController } from '@libs/searching/elasticsearch.controller';
import { ElasticsearchService } from '@libs/searching/elasticsearch.service';

@Global()
@Module({
  controllers: [ElasticsearchController],
  providers: [ElasticsearchService],
})
export class ElasticsearchModule {}
