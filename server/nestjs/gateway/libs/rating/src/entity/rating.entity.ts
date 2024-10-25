import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@base/base.entity';

@Entity()
export class Rating extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  thankCount: number;

  @Column()
  customerId: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column()
  rating: number;

  @Column()
  images: string[];

  @Column('text', { array: true })
  productAttributes: string[];

  @Column()
  hadPhoto: boolean;

  @Column()
  productId: number;

  @Column()
  deliveryRating: number;
}
