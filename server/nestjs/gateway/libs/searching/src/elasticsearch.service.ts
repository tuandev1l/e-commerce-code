import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import * as path from 'path';
import * as process from 'process';
import axios from 'axios';
import { SearchType } from '@libs/searching/searchType.enum';
import { ProductFilterDto } from '@libs/product/dto/product/withoutUser/productFilter.dto';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

import { readFile } from 'fs/promises';

@Injectable()
export class ElasticsearchService {
  private static LIMIT = 0;
  private readonly client: Client;
  private readonly embeddedHost: string;
  private readonly embeddedPort: string;
  private readonly elasticIndex: string;

  constructor(private readonly config: ConfigService) {
    ElasticsearchService.LIMIT = this.config.get('LIMIT_SEARCH');
    this.embeddedHost = config.get('EMBEDDING_HOST');
    this.embeddedPort = config.get('EMBEDDING_PORT');
    this.elasticIndex = config.get('ELASTIC_INDEX');

    const node = `https://${config.get('ELASTIC_HOST')}:${config.get('ELASTIC_PORT')}`;
    this.client = new Client({
      node,
      auth: {
        username: config.get('ELASTIC_USERNAME'),
        password: config.get('ELASTIC_PASSWORD'),
      },
      tls: {
        ca: `${path.resolve(process.cwd())}/http_ca.crt`,
        rejectUnauthorized: false,
      },
    });

    (async () => {
      try {
        await this.client.indices.get({
          index: this.elasticIndex,
        });
      } catch (_: any) {
        console.log('Mapping ecommerce does not exist');
        await this.getClient().indices.create({
          index: this.elasticIndex,
          mappings: {
            properties: {
              descriptionVector: {
                type: 'dense_vector',
                dims: 768,
              },
              imgVector: {
                type: 'dense_vector',
                dims: 768,
              },
            },
          },
        });
      }

      const records = (
        await this.client.search({
          index: this.elasticIndex,
        })
      ).hits.hits;

      if (records.length == 0) {
        const data = (await readFile('./vector.json')).toString();
        // console.log(data);
        const jsonData = JSON.parse(data);
        for (const record of jsonData) {
          void this.client.index({
            index: this.elasticIndex,
            body: record,
          });
        }
      }
    })();
  }

  async searchProductNormal(productFilterDto: ProductFilterDto) {
    const { page } = productFilterDto;
    const query = this.createQueryBuilder(productFilterDto);

    const filterPage = page ? page : 1;

    const records = await this.getClient().search({
      index: this.elasticIndex,
      from: (filterPage - 1) * ElasticsearchService.LIMIT,
      size: ElasticsearchService.LIMIT,
      query,
      _source_includes: [
        'id',
        'name',
        'description',
        'thumbnailUrl',
        'discountRate',
        'price',
        'ratingAverage',
        'quantitySold.value',
      ],
    });

    return this.returnData(records, filterPage);
  }

  async searchProductUsingKnn(productFilterDto: ProductFilterDto) {
    const textEmbedding = await axios.post(
      `http://${this.embeddedHost}:${this.embeddedPort}/convert/${productFilterDto.type === SearchType.TEXT ? 'text' : 'img'}`,
      { data: productFilterDto.keyword },
    );

    const { page } = productFilterDto;
    const query = this.createQueryBuilder(productFilterDto);

    const filterPage = page ? page : 1;

    const records = await this.getClient().search({
      index: this.elasticIndex,
      knn: {
        query_vector: textEmbedding.data.data,
        k: 20,
        num_candidates: 20,
        field: SearchType.TEXT ? 'descriptionVector' : 'imgVector',
      },
      query,
      from: (filterPage - 1) * ElasticsearchService.LIMIT,
      size: ElasticsearchService.LIMIT,
      _source_includes: [
        'id',
        'name',
        'description',
        'thumbnailUrl',
        'discountRate',
        'price',
        'ratingAverage',
        'quantitySold.value',
      ],
    });

    return this.returnData(records, filterPage);
  }

  async getProduct(id: string) {
    const data = await this.client.search({
      index: this.elasticIndex,
      query: {
        match: {
          id,
        },
      },
      _source_excludes: ['descriptionVector', 'imgVector'],
    });

    if (data) {
      return data.hits.hits[0]._source;
    }

    return null;
  }

  async createProduct<E>(product: E) {
    void this.client.index({
      index: this.elasticIndex,
      document: product,
    });
  }

  async updateProduct<E>(productId: string, product: E) {
    await this.deleteProduct(productId);
    void this.createProduct(product);
  }

  async deleteProduct(id: string) {
    void this.client.deleteByQuery({
      index: this.elasticIndex,
      query: {
        match: {
          id,
        },
      },
    });
  }

  getClient(): Client {
    return this.client;
  }

  private returnData(records: any, filterPage: number) {
    const count =
      typeof records.hits.total === 'object'
        ? records.hits.total.value
        : (records.hits.total ?? 0);

    return {
      totalPage: Math.ceil(count / ElasticsearchService.LIMIT),
      currentPage: filterPage,
      data: records.hits.hits.map((pd) => pd._source),
    };
  }

  private createQueryBuilder(productFilterDto: ProductFilterDto) {
    const {
      categories,
      fromNumber,
      toNumber,
      brands,
      keyword,
      usingKnn,
      type,
    } = productFilterDto;

    const mustQuery: QueryDslQueryContainer[] = [];

    if (keyword && keyword !== '') {
      mustQuery.push({
        bool: {
          should: [
            {
              match: {
                name: keyword,
              },
            },
          ],
        },
      });

      if (usingKnn && type === SearchType.TEXT) {
        // @ts-ignore
        mustQuery[0].bool.should.push({
          match: {
            description: keyword,
          },
        });
      }
    }

    if (categories?.length && categories?.length > 0) {
      mustQuery.push({
        terms: {
          'categories.id': categories,
        },
      });
    }

    if (brands?.length && brands?.length > 0) {
      mustQuery.push({
        terms: {
          'brand.id': brands,
        },
      });
    }

    if (fromNumber && toNumber) {
      mustQuery.push({
        range: {
          price: {
            gte: fromNumber,
            lte: toNumber,
          },
        },
      });
    }

    const query: QueryDslQueryContainer = {
      bool: {
        must: mustQuery,
      },
    };

    return query;
  }
}
