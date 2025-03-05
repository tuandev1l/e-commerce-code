import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import * as path from 'path';
import * as process from 'process';
import axios from 'axios';
import { SearchType } from '@libs/searching/searchType.enum';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

import { readFile } from 'fs/promises';
import { ProductFilterDto } from '@libs/product/dto/product/productFilter.dto';

@Injectable()
export class ElasticsearchService {
  private static isImported = false;
  private static LIMIT = 0;
  private readonly client: Client;
  // private readonly embeddedHost: string;
  // private readonly embeddedPort: string;
  private ngrokUrl = 'https://a540-35-187-226-231.ngrok-free.app';
  private readonly elasticIndex: string;

  constructor(private readonly config: ConfigService) {
    ElasticsearchService.LIMIT = this.config.get('LIMIT_SEARCH');
    // this.embeddedHost = config.get('EMBEDDING_HOST');
    // this.embeddedPort = config.get('EMBEDDING_PORT');

    // this.elasticIndex = config.get('ELASTIC_INDEX');
    // this.elasticIndex = config.get('ELASTIC_INDEX_V2');
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

    if (!ElasticsearchService.isImported) {
      ElasticsearchService.isImported = true;
      (async () => {
        try {
          await this.client.indices.get({
            index: this.elasticIndex,
          });
        } catch (_: any) {
          console.log('Mapping ecommerce does not exist');
          await this.getClient().indices.create({
            index: this.elasticIndex,
            // mappings: {
            //   properties: {
            //     imgVector: {
            //       type: 'dense_vector',
            //       dims: 512,
            //     },
            //     imgDot: {
            //       type: 'dense_vector',
            //       dims: 512,
            //       similarity: 'dot_product',
            //     },
            //   },
            // },
          });
        }

        const records = (
          await this.client.search({
            index: this.elasticIndex,
          })
        ).hits.hits;

        if (records.length === 0) {
          // const data = (await readFile('./vector.json')).toString();
          const data = (await readFile('./raw_products.json')).toString();
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
  }

  async find5ProductsInSameCategory(categoryId: string, productId: string) {
    const data = await this.client.search({
      index: this.elasticIndex,
      size: 5,
      query: {
        bool: {
          must: {
            match: {
              'categories.id': categoryId,
            },
          },
          must_not: {
            match: {
              id: productId,
            },
          },
        },
      },
      _source_includes: [
        'id',
        'name',
        'thumbnailUrl',
        'discountRate',
        'price',
        'ratingAverage',
        'quantitySold.value',
      ],
    });

    return data.hits.hits.map((el) => el._source);
  }

  async otherRandomProducts() {
    const data = await this.client.search({
      query: {
        function_score: {
          random_score: {},
        },
      },
      _source_includes: [
        'id',
        'name',
        'thumbnailUrl',
        'discountRate',
        'price',
        'ratingAverage',
        'quantitySold.value',
      ],
      size: 10,
    });

    return data.hits.hits.map((el) => el._source);
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
      // sort: {
      //   createdAt: {
      //     order: 'desc',
      //   },
      // },
      _source_includes: [
        'id',
        'name',
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
    const res = await axios.post(
      `${this.ngrokUrl}/convert/${productFilterDto.type === SearchType.TEXT ? 'text' : 'img'}`,
      { data: productFilterDto.keyword },
    );

    return {
      totalPage: 1,
      currentPage: 1,
      data: res.data.data,
    };

    // const { page } = productFilterDto;
    // const query = this.createQueryBuilder(productFilterDto);
    //
    // const filterPage = page ? page : 1;
    //
    // const records = await this.getClient().search({
    //   index: this.elasticIndex,
    //   knn: {
    //     query_vector: textEmbedding.data.data,
    //     k: 20,
    //     num_candidates: 20,
    //     field: 'imgVector',
    //   },
    //   query,
    //   // sort: {
    //   //   createdAt: {
    //   //     order: 'desc',
    //   //   },
    //   // },
    //   from: (filterPage - 1) * ElasticsearchService.LIMIT,
    //   size: ElasticsearchService.LIMIT,
    //   _source_includes: [
    //     'id',
    //     'name',
    //     'thumbnailUrl',
    //     'discountRate',
    //     'price',
    //     'ratingAverage',
    //     'quantitySold.value',
    //   ],
    // });
    //
    // return this.returnData(records, filterPage);
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
    return this.client.index({
      index: this.elasticIndex,
      document: product,
    });
  }

  async updateProduct<E>(productId: string, product: E) {
    await this.deleteProduct(productId);
    await this.createProduct(product);
  }

  async stopSellingProduct(id: string) {
    await this.client.updateByQuery({
      index: this.elasticIndex,
      query: {
        match: {
          id,
        },
      },
      script: 'ctx._source.stopSelling=true',
    });
  }

  async deleteProduct(id: string) {
    return this.client.deleteByQuery({
      index: this.elasticIndex,
      query: {
        match: {
          id,
        },
      },
    });
  }

  async backToSell(id: string) {
    await this.client.updateByQuery({
      index: this.elasticIndex,
      query: {
        match: {
          id,
        },
      },
      script: 'ctx._source.stopSelling=false',
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
            {
              match: {
                description: keyword,
              },
            },
          ],
        },
      });

      // if (usingKnn && type === SearchType.TEXT) {
      //   // @ts-ignore
      //   mustQuery[0].bool.should.push({
      //     match: {
      //       description: keyword,
      //     },
      //   });
      // }
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

    if (fromNumber || toNumber) {
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
        must_not: {
          match: {
            stopSelling: true,
          },
        },
      },
    };

    return query;
  }
}
