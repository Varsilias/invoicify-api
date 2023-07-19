import { DataSource, Repository } from 'typeorm';
import { InvoiceEntity } from '../entities/invoice.entity';
import { Injectable } from '@nestjs/common';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class InvoiceRepository extends Repository<InvoiceEntity> {
  constructor(private dataSource: DataSource) {
    super(InvoiceEntity, dataSource.createEntityManager());
  }

  async filterInvoices(user: IDecoratorUser, status: string) {
    return this.createQueryBuilder()
      .select('invoice')
      .from(InvoiceEntity, 'invoice')
      .where('invoice.user = :id', { id: user.id })
      .andWhere('invoice.status = :status', { status })
      .getMany();
  }
}
