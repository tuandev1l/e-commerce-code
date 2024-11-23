import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  // @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn()
  // @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;
}
