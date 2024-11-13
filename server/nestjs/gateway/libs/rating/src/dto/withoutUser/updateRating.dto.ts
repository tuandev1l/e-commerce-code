import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IRatingImage } from '@libs/rating/interface/ratingImage.interface';

export class UpdateRatingDtoWithoutUser {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsArray()
  images?: IRatingImage[];

  @IsNotEmpty()
  @IsNumber()
  deliveryRating: number;
}
