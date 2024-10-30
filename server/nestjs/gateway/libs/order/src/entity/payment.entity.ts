import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@base/base.entity';
import { PaymentEnum } from '@share/enums/payment.enum';

@Entity()
export class Payment extends BaseEntity {
  @Column()
  method: string;

  @Column({ name: 'is_prepaid' })
  isPrepaid: boolean;

  @Column({ type: 'enum', enum: PaymentEnum, default: PaymentEnum.AVAILABLE })
  status: PaymentEnum;

  @Column()
  description: string;
}
