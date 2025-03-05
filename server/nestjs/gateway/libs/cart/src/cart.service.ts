import { Injectable } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { RpcBadRequest } from '@base/exception/exception.resolver';
import { ProductService } from '@libs/product/product.service';
import { IProductItem } from '@libs/product/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { AddItemDto } from '@libs/cart/dto/addItem.dto';
import { ChangeQuantityInCartDto } from '@libs/cart/dto/changeQuantityInCart.dto';
import { DelItemDto } from '@libs/cart/dto/delItem.dto';

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

    if (!productItem) {
      const product = await this.productService.findOne(cartPayload.productId);

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
        color: cartPayload.color,
        size: cartPayload.size,
      };
      cart.productItems.push(productItem);
    } else {
      productItem.quantity += cartPayload.quantity;
    }

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
    const { productId } = cartPayload;

    const productItemIdx = cart.productItems.findIndex(
      (product) => product.uuid === productId,
    );

    cart.productItems.splice(productItemIdx, 1);

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
