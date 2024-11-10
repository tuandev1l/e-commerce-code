import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Role } from '@auth';
import { BaseEntity } from '@base/base.entity';
import { Exclude } from 'class-transformer';
import { ACCOUNT_TYPE, GENDER } from '@share/enums';
import { IUserAddress } from '@share/interfaces';
import { Order } from '@libs/order/entity/order.entity';
import { Cart } from '@libs/cart/entity/cart.entity';
import { Rating } from '@libs/rating/entity/rating.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Exclude()
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  birthday?: Date;

  @Column({ type: 'enum', enum: ACCOUNT_TYPE })
  accountType: ACCOUNT_TYPE;

  @Column()
  isPhoneVerified: boolean = false;

  @Column({ type: 'enum', enum: GENDER })
  gender: GENDER;

  @Column()
  isEmailVerified: boolean = false;

  @Column()
  rewardPoint: number = 0;

  @Column({ nullable: true })
  email?: string;

  @Column()
  hasPassword: boolean = true;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'jsonb', default: [] })
  address: IUserAddress[];

  @Column({ nullable: true })
  @Exclude()
  resetToken?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @Exclude()
  resetTokenExpired?: Date;

  @Exclude()
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Exclude()
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @Exclude()
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
