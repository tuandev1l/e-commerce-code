import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_PATTERN, SEARCHING_PATTERN } from '@constants/pattern';
import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/update-product.dto';
import { ISearch } from '@libs/searching/search.interface';

@Injectable()
export class GatewayService {
  constructor(@Inject('RABBITMQ_PRODUCER') private producer: ClientProxy) {}

  async createProduct(productDto: CreateProductDto) {
    return this.sendMessage(PRODUCT_PATTERN.CREATE_PRODUCT, productDto);
  }

  async findAllProduct() {
    return this.sendMessage(PRODUCT_PATTERN.FIND_ALL_PRODUCT);
  }

  async findOneProduct(id: string) {
    return this.sendMessage(PRODUCT_PATTERN.FIND_ONE_PRODUCT, id);
  }

  async updateProduct(id: string, productDto: UpdateProductDto) {
    return this.sendMessage(PRODUCT_PATTERN.UPDATE_PRODUCT, {
      id,
      ...productDto,
    });
  }

  async removeProduct(id: string) {
    return this.sendMessage(PRODUCT_PATTERN.REMOVE_PRODUCT, id);
  }

  searchProductByElasticsearch(search: ISearch) {
    console.log('im here');
    return this.sendMessage(SEARCHING_PATTERN.SEARCH_PRODUCTS, search);
  }

  private async sendMessage(pattern: string, data: unknown = '') {
    return this.producer.send(pattern, data);
  }
}
