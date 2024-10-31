import { Injectable } from '@nestjs/common';
import {
  CART_PATTERN,
  ORDER_PATTERN,
  PRODUCT_PATTERN,
  SEARCHING_PATTERN,
} from '@constants/pattern';
import { CreateProductDto } from '@libs/product/dto/create-product.dto';
import { UpdateProductDto } from '@libs/product/dto/update-product.dto';
import { ISearch } from '@libs/searching/search.interface';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/withoutUser/delItemWithoutUser.dto';
import { ProducerService } from '@gateway/service/producer.service';
import { AddItemWithoutUserDto } from '@libs/cart/dto/withoutUser/addItemWithoutUser.dto';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';
import { UpdateOrderStatusDto } from '@libs/order/dto/withoutUser/updateOrderStatus.dto';
import { GetOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/getOrder.dto';
import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';

@Injectable()
export class GatewayService {
  constructor(private readonly producer: ProducerService) {}

  // PRODUCT
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

  // CART
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

  async getCart(user: User) {
    return this.producer.sendMessage(CART_PATTERN.GET_CART, user);
  }

  // ORDER
  async createOrder(user: User, orderPayload: BulkCreateOrderDtoWithoutUser) {
    return this.producer.sendMessage(ORDER_PATTERN.CREATE_ORDER, {
      user,
      ...orderPayload,
    });
  }

  async cancelOrder(user: User, orderPayload: CancelOrderDtoWithoutUser) {
    return this.producer.sendMessage(ORDER_PATTERN.CANCEL_ORDER, {
      user,
      ...orderPayload,
    });
  }

  async updateOrderStatus(orderPayload: UpdateOrderStatusDto) {
    return this.producer.sendMessage(
      ORDER_PATTERN.UPDATE_ORDER_STATUS,
      orderPayload,
    );
  }

  async getAllOrders(user: User) {
    return this.producer.sendMessage(ORDER_PATTERN.GET_ALL_ORDERS, user);
  }

  async getOrder(user: User, getOrderDto: GetOrderDtoWithoutUser) {
    return this.producer.sendMessage(ORDER_PATTERN.GET_ORDER, {
      user,
      ...getOrderDto,
    });
  }

  async getAllPaymentMethod() {
    return this.producer.sendMessage(ORDER_PATTERN.GET_ALL_PAYMENT_METHOD);
  }

  async getPaymentMethod(id: number) {
    return this.producer.sendMessage(ORDER_PATTERN.GET_PAYMENT_METHOD, id);
  }

  async getAllShippingMethod() {
    return this.producer.sendMessage(ORDER_PATTERN.GET_ALL_SHIPPING_METHOD);
  }

  async getShippingMethod(id: number) {
    return this.producer.sendMessage(ORDER_PATTERN.GET_SHIPPING_METHOD, id);
  }
}
