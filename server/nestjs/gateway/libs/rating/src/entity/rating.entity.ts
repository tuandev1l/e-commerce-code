import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class Rating extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0, name: 'thank_count' })
  thankCount: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0, name: 'comment_count' })
  commentCount: number;

  @Column()
  rating: number;

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column('text', { array: true, name: 'product_attributes' })
  productAttributes: string[];

  @Column({ name: 'had_photo' })
  hadPhoto: boolean;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'delivery_rating' })
  deliveryRating: number;
}
