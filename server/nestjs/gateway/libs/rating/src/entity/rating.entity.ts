import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { User } from '@user/entities/user.entity';
import { IRatingTimeline } from '@libs/rating/interface/ratingTimeline.interface';
import { IVoteAttribute } from '@libs/rating/interface/voteAttribute.interface';
import { IRatingImage } from '@libs/rating/interface/ratingImage.interface';

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

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ type: 'jsonb', default: [] })
  images: IRatingImage[];

  @Column('text', { array: true, name: 'product_attributes' })
  productAttributes: string[];

  @Column({ name: 'had_photo', default: false })
  hadPhoto: boolean;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'jsonb', nullable: true })
  timeline: IRatingTimeline;

  @Column({
    name: 'vote_attributes',
    type: 'jsonb',
    default: { agree: 0, disagree: 0 },
  })
  voteAttributes: IVoteAttribute;
}
