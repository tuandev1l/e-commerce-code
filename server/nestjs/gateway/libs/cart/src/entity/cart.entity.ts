import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IProductItem } from '@libs/product/interfaces';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'customer_id' })
  customerId: number;

  @Column({ type: 'jsonb', name: 'product_items' })
  productItems: IProductItem[] = [];
}
