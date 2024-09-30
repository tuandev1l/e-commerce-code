import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import * as path from 'path';
import * as process from 'process';
import { readFile } from 'fs/promises';
import axios from 'axios';
import { ISearch } from '@libs/searching/search.interface';
import { SearchType } from '@libs/searching/searchType.enum';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;
  private readonly embeddedHost: string;
  private readonly embeddedPort: string;
  private readonly elasticIndex: string;

  constructor(private readonly config: ConfigService) {
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
              description_vector: {
                type: 'dense_vector',
                dims: 768,
              },
              image_vector: {
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
          delete record['images_vector'];
          void this.client.index({
            index: this.elasticIndex,
            body: record,
          });
        }
      }
    })();
  }

  async searchProduct(search: ISearch) {
    const textEmbedding = await axios.post(
      `http://${this.embeddedHost}:${this.embeddedPort}/convert/${search.type == SearchType.TEXT ? 'text' : 'img'}`,
      { data: search.data },
    );

    const records = await this.getClient().search({
      index: this.elasticIndex,
      knn: {
        query_vector: textEmbedding.data.data,
        k: 10,
        num_candidates: 10,
        field: 'description_vector',
      },
      _source_excludes: ['description_vector', 'image_vector'],
    });

    return records.hits.hits;
  }

  getClient(): Client {
    return this.client;
  }
}
