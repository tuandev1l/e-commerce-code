import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ShippingEnum } from '@share/enums/shipping.enum';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'partner_name' })
  partnerName: string;

  @Column({ type: 'enum', enum: ShippingEnum, default: ShippingEnum.AVAILABLE })
  status: ShippingEnum;
}
