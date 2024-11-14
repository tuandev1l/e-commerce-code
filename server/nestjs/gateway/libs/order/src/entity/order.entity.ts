import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { ORDER_STATUS } from '@libs/order/enum';
import { IInvoice, IOrderStatus } from '@libs/order/interface';
import { IProductItem } from '@libs/product/interfaces';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { Payment } from '@libs/order/entity/payment.entity';
import { User } from '@user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Rating } from '@libs/rating/entity/rating.entity';

@Entity()
export class Order extends BaseEntity {
  @Column({ type: 'varchar', enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @Column({ type: 'jsonb', nullable: true })
  invoice: IInvoice;

  @Column({ type: 'jsonb', nullable: true })
  item: IProductItem;

  @Column({ nullable: true })
  uuid: string;

  @Column({ nullable: true, name: 'rating_id' })
  ratingId: number;

  @OneToOne(() => Rating, (order) => order.rating)
  @JoinColumn({ name: 'rating_id' })
  rating: Rating;

  @Exclude()
  @Column({ name: 'shipping_id' })
  shippingId: number;

  @Exclude()
  @Column({ name: 'payment_id' })
  paymentId: number;

  @ManyToOne(() => Shipping, (shipping) => shipping.order)
  @JoinColumn({ name: 'shipping_id' })
  shipping: Shipping;

  @ManyToOne(() => Payment, (payment) => payment.order)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ type: 'jsonb', name: 'status_histories', default: [] })
  statusHistories: IOrderStatus[];

  @Exclude()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
