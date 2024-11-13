import { Column, Entity } from 'typeorm';
import { IRatingData } from '@libs/rating/interface/ratingData.interface';
import { BaseEntity } from '@base/base.entity';

const defaultValue = {
  '1': {
    count: 0,
    percent: 0,
  },
  '2': {
    count: 0,
    percent: 0,
  },
  '3': {
    count: 0,
    percent: 0,
  },
  '4': {
    count: 0,
    percent: 0,
  },
  '5': {
    count: 0,
    percent: 0,
  },
};

@Entity()
export class ProductRating extends BaseEntity {
  @Column({ type: 'jsonb', default: defaultValue })
  stars: {
    '1': IRatingData;
    '2': IRatingData;
    '3': IRatingData;
    '4': IRatingData;
    '5': IRatingData;
  };

  @Column({ name: 'rating_average', type: 'float', default: 0 })
  ratingAverage: number;

  @Column({ name: 'reviews_count', default: 0 })
  reviewsCount: number;

  @Column({ type: 'jsonb' })
  reviewPhoto: {
    total: number;
    totalPhoto: number;
  };

  @Column({ name: 'product_id' })
  productId: string;
}
