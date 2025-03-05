import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { Order } from '@libs/order/entity/order.entity';
import { ORDER_STATUS } from '@libs/order/enum';
import { RpcBadRequest, RpcNotFound } from '@base/exception/exception.resolver';
import { ProductRating } from '@libs/rating/entity/productRating.entity';
import { CreateRatingDto } from '@libs/rating/dto/createRating.dto';
import { GetAndDeleteRatingDto } from '@libs/rating/dto/getAndDeleteRating.dto';
import { UpdateRatingDto } from '@libs/rating/dto/updateRating.dto';

enum UpdateProductReviewType {
  'CREATE',
  'UPDATE',
  DELETE,
}

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private readonly repository: Repository<Rating>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductRating)
    private readonly productRatingRepo: Repository<ProductRating>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
    const { orderId, user, productId, rating } = createRatingDto;
    const order = await this.orderRepository.findOneBy({
      id: orderId,
      userId: user.id,
    });

    if (order.status !== ORDER_STATUS.COMPLETE) {
      throw new RpcBadRequest('You have to buy product before rating!');
    }

    user.totalReview += 1;

    void this.userRepo.save(user);

    void this.updateProductReview(
      productId,
      rating,
      UpdateProductReviewType.CREATE,
    );

    const ratingEntity = await this.repository.save({
      userId: createRatingDto.user.id,
      rating: createRatingDto.rating,
      content: createRatingDto.content,
      images: createRatingDto.images,
      hadPhoto: !!createRatingDto.images,
      title: createRatingDto.title,
      orderId: order.id,
      productId: createRatingDto.productId,
      productAttributes: createRatingDto.productAttributes,
    });

    order.ratingId = ratingEntity.id;

    void this.orderRepository.save(order);
    return ratingEntity;
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

    void this.updateProductReview(
      rating.productId,
      updateRatingDto.rating,
      UpdateProductReviewType.UPDATE,
      rating.rating,
    );

    rating.rating = updateRatingDto.rating;
    rating.content = updateRatingDto.content;
    rating.images = updateRatingDto.images;
    rating.title = updateRatingDto.title;

    return this.repository.save(rating);
  }

  async deleteRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    const rating = await this.getRating(getAndDeleteRatingDto);

    const { user } = getAndDeleteRatingDto;
    user.totalReview -= 1;
    void this.userRepo.save(user);

    const order = await this.orderRepository.findOneBy({
      id: rating.orderId,
      userId: user.id,
    });

    order.ratingId = null;
    order.rating = null;

    await this.orderRepository.save(order);

    await this.updateProductReview(
      rating.productId,
      rating.rating,
      UpdateProductReviewType.DELETE,
    );

    await this.repository.delete(rating.id);

    return null;
  }

  async getProductRating(productId: string) {
    return this.productRatingRepo.findOneBy({ productId });
  }

  private async updateProductReview(
    productId: string,
    rating: number,
    type: UpdateProductReviewType,
    oldRating?: number,
  ) {
    const ratingProduct = await this.productRatingRepo.findOneBy({ productId });

    const stars = ratingProduct.stars;
    if (type === UpdateProductReviewType.CREATE) {
      stars[rating].count += 1;
      ratingProduct.ratingAverage =
        (ratingProduct.ratingAverage * ratingProduct.reviewsCount + rating) /
        (ratingProduct.reviewsCount + 1);
      ratingProduct.reviewsCount += 1;
    } else if (type === UpdateProductReviewType.UPDATE) {
      stars[oldRating].count -= 1;
      stars[rating].count += 1;
      ratingProduct.ratingAverage =
        (ratingProduct.ratingAverage * ratingProduct.reviewsCount -
          oldRating +
          rating) /
        ratingProduct.reviewsCount;
    } else {
      stars[rating].count -= 1;
      const ratingRemain =
        ratingProduct.ratingAverage * ratingProduct.reviewsCount - rating;
      if (!ratingRemain) {
        ratingProduct.ratingAverage = 0;
      } else {
        ratingProduct.ratingAverage =
          (ratingProduct.ratingAverage * ratingProduct.reviewsCount - rating) /
          (ratingProduct.reviewsCount - 1);
        ratingProduct.reviewsCount -= 1;
      }
    }
    for (let i = 1; i <= 5; i++) {
      // @ts-ignore
      stars[i].percent = ratingProduct.reviewsCount
        ? +((stars[i].count / ratingProduct.reviewsCount) * 100).toFixed(2)
        : 0;
    }

    void this.productRatingRepo.save(ratingProduct);
  }
}
