import { Column, Entity, OneToMany } from 'typeorm';
import { ShippingEnum } from '@share/enums/shipping.enum';
import { BaseEntity } from '@base/base.entity';
import { Order } from '@libs/order/entity/order.entity';

@Entity()
export class Shipping extends BaseEntity {
  @Column({ name: 'partner_name' })
  partnerName: string;

  @Column({ type: 'enum', enum: ShippingEnum, default: ShippingEnum.AVAILABLE })
  status: ShippingEnum;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;

  @OneToMany(() => Order, (order) => order.shipping)
  order: Order;
}
