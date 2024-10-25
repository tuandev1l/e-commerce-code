import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { AddAndDeleteItemFromCartDto } from '@libs/cart/dto/ANDItem.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly repository: Repository<Cart>,
  ) {}

  async addToCart(cartPayload: AddAndDeleteItemFromCartDto) {
    const cart = await this.getCart(cartPayload.user);
    const { productItems } = cartPayload;

    productItems.forEach((productItem) => {
      const productItemIdx = cart.productItems.findIndex(
        (product) => product._id === productItem._id,
      );

      if (productItemIdx === -1) {
        cart.productItems.push(productItem);
      } else {
        cart.productItems[productItemIdx].quantity++;
        cart.productItems[productItemIdx].subTotal += productItem.finalPrice;
      }
    });

    return this.repository.save(cart);
  }

  async deleteFromCart(cartPayload: AddAndDeleteItemFromCartDto) {
    const cart = await this.getCart(cartPayload.user);
    const { productItems } = cartPayload;

    productItems.forEach((productItem) => {
      const productItemIdx = cart.productItems.findIndex(
        (product) => product._id === productItem._id,
      );

      if (cart.productItems[productItemIdx].quantity === 1) {
        cart.productItems.splice(productItemIdx, 1);
      } else {
        cart.productItems[productItemIdx].quantity--;
      }
    });

    return this.repository.save(cart);
  }

  async createCart(user: User) {
    return this.repository.save({ customerId: user.id });
  }

  private async getCart(user: User) {
    const cart = await this.repository.findOneBy({ customerId: user.id });
    if (!cart) {
      throw new NotFoundException('There is no cart with this user');
    }
    return cart;
  }
}
