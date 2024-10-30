import { Injectable } from '@nestjs/common';
import {
  CART_PATTERN,
  PRODUCT_PATTERN,
  SEARCHING_PATTERN,
} from '@constants/pattern';
import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/update-product.dto';
import { ISearch } from '@libs/searching/search.interface';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/delItemWithoutUser.dto';
import { ProducerService } from '@gateway/producer.service';
import { AddItemWithoutUserDto } from '@libs/cart/dto/addItemWithoutUser.dto';

@Injectable()
export class GatewayService {
  constructor(private readonly producer: ProducerService) {}

  async createProduct(productDto: CreateProductDto) {
    return this.producer.sendMessage(
      PRODUCT_PATTERN.CREATE_PRODUCT,
      productDto,
    );
  }

  async findAllProduct() {
    return this.producer.sendMessage(PRODUCT_PATTERN.FIND_ALL_PRODUCT);
  }

  async findOneProduct(id: string) {
    return this.producer.sendMessage(PRODUCT_PATTERN.FIND_ONE_PRODUCT, id);
  }

  async updateProduct(id: string, productDto: UpdateProductDto) {
    return this.producer.sendMessage(PRODUCT_PATTERN.UPDATE_PRODUCT, {
      id,
      ...productDto,
    });
  }

  async removeProduct(id: string) {
    return this.producer.sendMessage(PRODUCT_PATTERN.REMOVE_PRODUCT, id);
  }

  async searchProductByElasticsearch(search: ISearch) {
    return this.producer.sendMessage(SEARCHING_PATTERN.SEARCH_PRODUCTS, search);
  }

  async addToCart(user: User, cartPayload: AddItemWithoutUserDto) {
    return this.producer.sendMessage(CART_PATTERN.ADD_TO_CART, {
      user,
      ...cartPayload,
    });
  }

  async deleteFromCart(user: User, cartPayload: DelItemWithoutUserDto) {
    return this.producer.sendMessage(CART_PATTERN.DELETE_FROM_CART, {
      user,
      ...cartPayload,
    });
  }

  async createCart(user: User) {
    return this.producer.sendMessage(CART_PATTERN.CREATE_CART, user);
  }
}
