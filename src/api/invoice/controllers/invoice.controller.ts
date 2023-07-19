import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import {
  CurrentUser,
  IDecoratorUser,
} from 'src/common/decorators/current-user.decorator';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.invoiceService.create(createInvoiceDto, user);
  }

  @Get()
  findAll(
    @CurrentUser() user: IDecoratorUser,
    @Query('status') status: string,
  ) {
    return this.invoiceService.findAll(user, status);
  }

  @Get(':publicId')
  findOne(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.invoiceService.findOne(publicId, user);
  }

  @Put(':publicId')
  update(
    @Param('publicId') publicId: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.invoiceService.update(publicId, updateInvoiceDto, user);
  }

  @Delete(':publicId')
  remove(
    @Param('publicId') publicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.invoiceService.remove(publicId, user);
  }

  @Delete(':invoicePublicId/item/:publicId')
  deleteItem(
    @Param('publicId') publicId: string,
    @Param('invoicePublicId') invoicePublicId: string,
    @CurrentUser() user: IDecoratorUser,
  ) {
    return this.invoiceService.removeInvoiceItem(
      publicId,
      invoicePublicId,
      user,
    );
  }
}
