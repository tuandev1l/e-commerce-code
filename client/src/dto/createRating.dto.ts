import { IRatingImage } from '../interfaces/ratingImage.interface';

export interface ICreateRatingDto {
  orderId: number;
  title: string;
  content: string;
  rating: number;
  images?: IRatingImage[];
  productAttributes: string[];
  productId: string;
}
