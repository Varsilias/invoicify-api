import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import {
  InvoiceStatusEnum,
  PaymentTermsEnum,
} from 'src/common/types/InvoiceStatusEnum';

import { ItemEntity } from '../entities/item.entity';

export class CreateInvoiceDto {
  @IsString({ message: 'Invalid data provided for description' })
  @IsNotEmpty({ message: 'description must not be empty' })
  description: string;

  @IsNotEmpty({ message: 'status must not be empty' })
  @IsIn(Object.values(InvoiceStatusEnum))
  status: InvoiceStatusEnum;

  @IsString({ message: 'Invalid data provided for client name' })
  @IsNotEmpty({ message: 'client name must not be empty' })
  clientName: string;

  @IsString({ message: 'Invalid data provided for client email' })
  @IsNotEmpty({ message: 'client email must not be empty' })
  @IsEmail()
  clientEmail: string;

  @IsString({ message: 'Invalid data provided for client address' })
  @IsNotEmpty({ message: 'client address must not be empty' })
  clientAddress: string;

  @IsString({ message: 'Invalid data provided for client city' })
  @IsNotEmpty({ message: 'client city must not be empty' })
  clientCity: string;

  @IsString({ message: 'Invalid data provided for client Postcode' })
  @IsNotEmpty({ message: 'client postcode must not be empty' })
  clientPostcode: string;

  @IsString({ message: 'Invalid data provided for client country' })
  @IsNotEmpty({ message: 'client country must not be empty' })
  clientCountry: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Payment due date must not be empty' })
  paymentDue: Date;

  @IsIn(Object.values(PaymentTermsEnum))
  paymentTerms: PaymentTermsEnum;

  @IsNotEmpty()
  @IsArray({ message: 'items must be a list of objects' })
  @ArrayNotEmpty({ message: 'items list must contain at least i items' })
  items: ItemEntity[];
}
