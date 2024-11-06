import { Injectable } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { DelItemDto } from '@libs/cart/dto/withUser/delItem.dto';
import { AddItemDto } from '@libs/cart/dto/withUser/addItem.dto';
import { RpcBadRequest } from '@base/exception/exception.resolver';
import { ProductService } from '@libs/product/product.service';
import { IProductItem } from '@libs/product/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { ChangeQuantityInCartDto } from '@libs/cart/dto/withUser/changeQuantityInCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly repository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {}

  async addToCart(cartPayload: AddItemDto) {
    const cart = await this.getCart(cartPayload.user);

    const productItem = cart.productItems.find(
      (pd) =>
        pd._id.toString() === cartPayload.productId &&
        pd.color === cartPayload.color &&
        pd.size === cartPayload.size,
    );

    let addingPrice;
    if (!productItem) {
      const product = await this.productService.findOne(cartPayload.productId);

      addingPrice = cartPayload.quantity * product.price;
      const productItem: IProductItem = {
        _id: product._id,
        uuid: uuidv4(),
        name: product.name,
        thumbnailUrl: product.thumbnailUrl,
        discount: product.discount,
        originalPrice: product.originalPrice,
        listPrice: product.originalPrice,
        price: product.price,
        seller: product.seller,
        quantity: cartPayload.quantity,
        subTotal: addingPrice,
        color: cartPayload.color,
        size: cartPayload.size,
      };
      cart.productItems.push(productItem);
    } else {
      productItem.quantity += cartPayload.quantity;
      addingPrice = cartPayload.quantity * productItem.price;
      productItem.subTotal += addingPrice;
    }
    cart.total += addingPrice;

    await this.repository.save(cart);
    return this.getCart(cartPayload.user);
  }

  async changeQuantity(changeQuantityDto: ChangeQuantityInCartDto) {
    const { quantity, productId, user } = changeQuantityDto;
    const cart = await this.getCart(user);

    const product = cart.productItems.find((pd) => pd.uuid === productId);
    product.quantity = quantity;
    return this.repository.save(cart);
  }

  async deleteFromCart(cartPayload: DelItemDto) {
    const cart = await this.getCart(cartPayload.user);
    const { quantity, productId } = cartPayload;

    const productItemIdx = cart.productItems.findIndex(
      (product) => product._id.toString() === productId,
    );

    const productItem = cart.productItems[productItemIdx];

    if (productItem.quantity - quantity < 0) {
      throw new RpcBadRequest('Quantity of product is not enough');
    } else if (productItem.quantity - quantity == 0) {
      cart.productItems.splice(productItemIdx, 1);
    } else {
      productItem.quantity -= quantity;
    }

    const removePrice = productItem.price * quantity;
    cart.total -= removePrice;

    return this.repository.save(cart);
  }

  async createCart(user: User) {
    const cart = await this.getCart(user);
    if (cart) {
      throw new RpcBadRequest('Cart existed');
    }
    return this.repository.save({ userId: user.id });
  }

  async getCart(user: User) {
    let cart = await this.repository.findOne({
      where: { userId: user.id },
    });
    if (!cart) {
      cart = await this.repository.save({
        userId: user.id,
        productItems: [],
      });
    }
    return cart;
  }
}
