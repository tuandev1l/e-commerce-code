import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateRatingDto } from '@libs/rating/dto/withUser/createRating.dto';
import { UpdateRatingDto } from '@libs/rating/dto/withUser/updateRating.dto';
import { GetAndDeleteRatingDto } from '@libs/rating/dto/withUser/getAndDeleteRating.dto';
import { Order } from '@libs/order/entity/order.entity';
import { ORDER_STATUS } from '@libs/order/enum';
import { RpcBadRequest, RpcNotFound } from '@base/exception/exception.resolver';
import { ProductRating } from '@libs/rating/entity/productRating.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private readonly repository: Repository<Rating>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductRating)
    private readonly productRatingRepo: Repository<ProductRating>,
  ) {}

  async getAllRatingsOfProduct(productId: string) {
    return this.repository.find({
      where: { productId },
      relations: ['user'],
      order: {
        updatedAt: -1,
      },
    });
  }

  async getAllRatingOfUser(user: User) {
    return this.repository.findBy({ userId: user.id });
  }

  async createRating(createRatingDto: CreateRatingDto) {
    const { orderId, user } = createRatingDto;
    const order = await this.orderRepository.findOneBy({
      id: orderId,
      userId: user.id,
    });

    if (order.status !== ORDER_STATUS.COMPLETE) {
      throw new RpcBadRequest('You have to buy product before rating!');
    }

    return this.repository.save({
      userId: createRatingDto.user.id,
      rating: createRatingDto.rating,
      deliveryRating: createRatingDto.deliveryRating,
      content: createRatingDto.content,
      images: createRatingDto.images,
      hadPhoto: !!createRatingDto.images,
      title: createRatingDto.title,
      productId: createRatingDto.productId,
      productAttributes: createRatingDto.productAttributes,
    });
  }

  async getRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    const { ratingId, user } = getAndDeleteRatingDto;
    const rating = await this.repository.findOneBy({
      id: ratingId,
      userId: user.id,
    });

    if (!rating) {
      throw new RpcNotFound('There is no rating with this ID');
    }

    return rating;
  }

  async updateRating(updateRatingDto: UpdateRatingDto) {
    const { user, ratingId } = updateRatingDto;

    const rating = await this.getRating({ user, ratingId });

    rating.rating = updateRatingDto.rating;
    rating.content = updateRatingDto.content;
    rating.images = updateRatingDto.images;
    rating.title = updateRatingDto.title;

    return this.repository.save(rating);
  }

  async deleteRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    const rating = await this.getRating(getAndDeleteRatingDto);
    void this.repository.delete(rating.id);
    return null;
  }

  async getProductRating(productId: string) {
    return this.productRatingRepo.findOneBy({ productId });
  }
}
