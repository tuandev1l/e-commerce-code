import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '@libs/rating/entity/rating.entity';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateRatingDto } from '@libs/rating/dto/createRating.dto';
import { GetAndDeleteRatingDto } from '@libs/rating/dto/getAndDeleteRating.dto';
import { UpdateRatingDto } from '@libs/rating/dto/updateRating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private readonly repository: Repository<Rating>,
  ) {}

  async getAllRatingsOfProduct(productId: number) {
    return this.repository.findBy({ productId });
  }

  async getAllRatingOfUser(user: User) {
    return this.repository.findBy({ customerId: user.id });
  }

  async createRating(createRatingDto: CreateRatingDto) {
    const { user, rating } = createRatingDto;

    return this.repository.save({ ...rating, customerId: user.id });
  }

  async getRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    const { ratingId, user } = getAndDeleteRatingDto;
    const rating = this.repository.findOneBy({
      id: ratingId,
      customerId: user.id,
    });

    if (!rating) {
      throw new NotFoundException('There is no rating with this ID');
    }

    return rating;
  }

  async updateRating(updateRatingDto: UpdateRatingDto) {
    const { rating: newRating, user, ratingId } = updateRatingDto;
    await this.getRating({ user, ratingId });
    return this.repository.save({ id: ratingId, ...newRating });
  }

  async deleteRating(getAndDeleteRatingDto: GetAndDeleteRatingDto) {
    const rating = await this.getRating(getAndDeleteRatingDto);
    void this.repository.delete({ id: rating.id });
  }
}
