import { IRatingData } from './ratingData.interface';

export interface IRatingProduct {
  stars: {
    '1': IRatingData;
    '2': IRatingData;
    '3': IRatingData;
    '4': IRatingData;
    '5': IRatingData;
  };
  ratingAverage: number;
  reviewsCount: number;
  reviewPhoto: {
    total: number;
    totalPhoto: number;
  };
  productId: string;
}
