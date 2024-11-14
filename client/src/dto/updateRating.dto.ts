import { IRatingImage } from '../interfaces/ratingImage.interface';

export interface IUpdateRatingDto {
  ratingId: number;
  title: string;
  content: string;
  rating: number;
  images?: IRatingImage[];
}
