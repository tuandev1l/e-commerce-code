import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IProductItem } from '@libs/product/interfaces';
import { BaseEntity } from '@base/base.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class Cart extends BaseEntity {
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'int', name: 'total', default: 0 })
  total: number;

  @Column({ type: 'jsonb', name: 'product_items', default: [] })
  productItems: IProductItem[];

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;
}
