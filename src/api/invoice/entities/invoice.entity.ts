import { BaseEntity } from 'src/common/entities/base.entity';
import {
  InvoiceStatusEnum,
  PaymentTermsEnum,
} from 'src/common/types/InvoiceStatusEnum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ItemEntity } from './item.entity';
import { UserEntity } from 'src/api/user/entities/user.entity';

@Entity({ name: 'invoices' })
export class InvoiceEntity extends BaseEntity<InvoiceEntity> {
  @Column({ type: 'varchar', unique: true })
  invoiceId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatusEnum,
    default: InvoiceStatusEnum.PENDING,
  })
  status: InvoiceStatusEnum;

  @Column({ type: 'varchar' })
  clientName: string;

  @Column({ type: 'varchar' })
  clientEmail: string;

  @Column({ type: 'varchar' })
  clientAddress: string;

  @Column({ type: 'varchar' })
  clientCity: string;

  @Column({ type: 'varchar' })
  clientPostcode: string;

  @Column({ type: 'varchar' })
  clientCountry: string;

  @Column({ type: 'timestamptz' })
  paymentDue: Date;

  @Column({ type: 'enum', enum: PaymentTermsEnum })
  paymentTerms: PaymentTermsEnum;

  @OneToMany(() => ItemEntity, (items) => items.invoice)
  items: ItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.invoices)
  user: UserEntity;

  //   constructor(partial: Partial<InvoiceEntity>) {
  //     super(partial);
  //   }
}
