import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

@Entity({ name: 'items' })
export class ItemEntity extends BaseEntity<ItemEntity> {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal' })
  total: number;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  invoice: InvoiceEntity;
}
