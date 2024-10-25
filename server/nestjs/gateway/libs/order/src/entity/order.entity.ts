import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { ORDER_STATUS } from '@libs/order/enum';
import { IInvoice, IOrderStatus } from '@libs/order/interface';
import { IProductItem } from '@libs/product/interfaces';
import { Shipping } from '@libs/order/entity/shipping.entity';
import { Payment } from '@libs/order/entity/payment.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class Order extends BaseEntity {
  @Column({ type: 'varchar', enum: ORDER_STATUS })
  status: ORDER_STATUS;

  @Column('jsonb')
  invoice: IInvoice;

  @Column('jsonb')
  items: IProductItem[];

  @Column('jsonb')
  shipping: Shipping;

  @Column('jsonb')
  payment: Payment;

  @Column({ type: 'jsonb', name: 'status_histories' })
  statusHistories: IOrderStatus[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
