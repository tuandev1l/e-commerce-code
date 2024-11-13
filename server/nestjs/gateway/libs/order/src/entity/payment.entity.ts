import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { PaymentEnum } from '@share/enums/payment.enum';
import { Order } from '@libs/order/entity/order.entity';

@Entity()
export class Payment extends BaseEntity {
  @Column()
  method: string;

  @Column({ name: 'is_prepaid', default: true })
  isPrepaid: boolean;

  @Column({ type: 'enum', enum: PaymentEnum, default: PaymentEnum.AVAILABLE })
  status: PaymentEnum;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Order, (order) => order.payment)
  order: Order;
}
