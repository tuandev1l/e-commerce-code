import { Injectable } from '@nestjs/common';
import {
  BRAND_PATTERN,
  CART_PATTERN,
  CATEGORY_PATTERN,
  ORDER_PATTERN,
  PRODUCT_PATTERN,
  RATING_PATTERN,
  SEARCHING_PATTERN,
  SHOP_PATTERN,
} from '@constants/pattern';
import { ISearch } from '@libs/searching/search.interface';
import { User } from '@user/entities/user.entity';
import { DelItemWithoutUserDto } from '@libs/cart/dto/withoutUser/delItemWithoutUser.dto';
import { ProducerService } from '@gateway/service/producer.service';
import { AddItemWithoutUserDto } from '@libs/cart/dto/withoutUser/addItemWithoutUser.dto';
import { CancelOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/cancelOrder.dto';
import { UpdateOrderStatusDto } from '@libs/order/dto/withUser/updateOrderStatus.dto';
import { GetOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/getOrder.dto';
import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';
import { CreateRatingDto } from '@libs/rating/dto/withUser/createRating.dto';
import { UpdateRatingDto } from '@libs/rating/dto/withUser/updateRating.dto';
import { GetAndDeleteRatingDto } from '@libs/rating/dto/withUser/getAndDeleteRating.dto';
import { UpdateProductDto } from '@libs/product/dto/product/withUser/update-product.dto';
import { CreateProductDto } from '@libs/product/dto/product/withUser/create-product.dto';
import { CreateBrandDto } from '@libs/product/dto/brand/create-brand.dto';
import { UpdateBrandDto } from '@libs/product/dto/brand/update-brand.dto';
import { CreateCategoryDto } from '@libs/product/dto/category/create-category.dto';
import { UpdateCategoryDto } from '@libs/product/dto/category/update-category.dto';
import { CreateShopDto } from '@libs/product/dto/shop/create-shop.dto';
import { UpdateShopDto } from '@libs/product/dto/shop/update-shop.dto';
import { ChangeQuantityInCartDto } from '@libs/cart/dto/withUser/changeQuantityInCart.dto';
import { PayOrderDto } from '@libs/order/dto/withUser/payOrder.dto';

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

  async updateProduct(productDto: UpdateProductDto) {
    return this.producer.sendMessage(
      PRODUCT_PATTERN.UPDATE_PRODUCT,
      productDto,
    );
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

  async changeQuantity(changeQuantityDto: ChangeQuantityInCartDto) {
    return this.producer.sendMessage(
      CART_PATTERN.CHANGE_QUANTITY,
      changeQuantityDto,
    );
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
  async getPaymentUrl(payOrderDto: PayOrderDto) {
    return this.producer.sendMessage(ORDER_PATTERN.PAY_ORDER, payOrderDto);
  }

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

  // RATING
  async createRating(createRatingDto: CreateRatingDto) {
    return this.producer.sendMessage(
      RATING_PATTERN.CREATE_RATING,
      createRatingDto,
    );
  }

  async updateRating(updateRatingDto: UpdateRatingDto) {
    return this.producer.sendMessage(
      RATING_PATTERN.UPDATE_RATING,
      updateRatingDto,
    );
  }

  async deleteRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    return this.producer.sendMessage(
      RATING_PATTERN.DELETE_RATING,
      getAndDeleteRatingDto,
    );
  }

  async getAllRatingsOfProduct(productId: string) {
    return this.producer.sendMessage(
      RATING_PATTERN.GET_ALL_RATING_OF_PRODUCT,
      productId,
    );
  }

  async getRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    return this.producer.sendMessage(
      RATING_PATTERN.GET_RATING,
      getAndDeleteRatingDto,
    );
  }

  async getAllRatingOfUser(user: User) {
    return this.producer.sendMessage(
      RATING_PATTERN.GET_ALL_RATING_OF_USER,
      user,
    );
  }

  // BRAND
  async createBrand(createBrand: CreateBrandDto) {
    return this.producer.sendMessage(BRAND_PATTERN.CREATE_BRAND, createBrand);
  }

  async getBrand(brandId: string) {
    return this.producer.sendMessage(BRAND_PATTERN.GET_BRAND, brandId);
  }

  async getBrandByName(brandName: string) {
    return this.producer.sendMessage(
      BRAND_PATTERN.GET_BRAND_BY_NAME,
      brandName,
    );
  }

  async getAllBrands() {
    return this.producer.sendMessage(BRAND_PATTERN.GET_ALL_BRANDS);
  }

  async updateBrand(updateBrandDto: UpdateBrandDto) {
    return this.producer.sendMessage(
      BRAND_PATTERN.UPDATE_BRAND,
      updateBrandDto,
    );
  }

  // CATEGORY
  async createCategory(createCategory: CreateCategoryDto) {
    return this.producer.sendMessage(
      CATEGORY_PATTERN.CREATE_CATEGORY,
      createCategory,
    );
  }

  async getCategory(categoryId: string) {
    return this.producer.sendMessage(CATEGORY_PATTERN.GET_CATEGORY, categoryId);
  }

  async getAllCategories() {
    return this.producer.sendMessage(CATEGORY_PATTERN.GET_ALL_CATEGORIES);
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    return this.producer.sendMessage(
      CATEGORY_PATTERN.UPDATE_CATEGORY,
      updateCategoryDto,
    );
  }

  // SHOP
  async createShop(createShop: CreateShopDto) {
    return this.producer.sendMessage(SHOP_PATTERN.CREATE_SHOP, createShop);
  }

  async getShop(shopId: string) {
    return this.producer.sendMessage(SHOP_PATTERN.GET_SHOP, shopId);
  }

  async getShopByName(shopName: string) {
    return this.producer.sendMessage(SHOP_PATTERN.GET_SHOP_BY_NAME, shopName);
  }

  async getAllShops() {
    return this.producer.sendMessage(SHOP_PATTERN.GET_ALL_SHOPS);
  }

  async updateShop(updateShopDto: UpdateShopDto) {
    return this.producer.sendMessage(SHOP_PATTERN.UPDATE_SHOP, updateShopDto);
  }
}
