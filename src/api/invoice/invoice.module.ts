import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ItemRepository } from './repositories/item.repository';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository, ItemRepository],
})
export class InvoiceModule {}
