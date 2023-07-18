import { DataSource, Repository } from 'typeorm';
import { InvoiceEntity } from '../entities/invoice.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceRepository extends Repository<InvoiceEntity> {
  constructor(private dataSource: DataSource) {
    super(InvoiceEntity, dataSource.createEntityManager());
  }
}
