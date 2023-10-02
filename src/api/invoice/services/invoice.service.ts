import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { IDecoratorUser } from 'src/common/decorators/current-user.decorator';
import { ServerErrorException } from 'src/common/exceptions/server-error.exception';
import { ItemRepository } from '../repositories/item.repository';
import { InvoiceEntity } from '../entities/invoice.entity';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { PostgresError } from 'src/common/helpers/enum';
import { DataSource } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly _invoiceRepository: InvoiceRepository,
    private readonly _itemRepository: ItemRepository,
    private readonly datasource: DataSource,
  ) {}
  async create(createInvoiceDto: CreateInvoiceDto, user: IDecoratorUser) {
    try {
      const entity = this._invoiceRepository.create({
        ...createInvoiceDto,
        invoiceId: this.generateInvoiceId(),
        user,
      });
      const invoice = await this._invoiceRepository.save(entity);

      const { items: invoiceItems } = createInvoiceDto;

      const items = await Promise.all(
        invoiceItems.map(async (item) => {
          const entity = this._itemRepository.create({ ...item, invoice });
          return await this._itemRepository.save(entity);
        }),
      );

      return { invoice, items };
    } catch (error: any) {
      console.log(error);
      throw new ServerErrorException('Something went wrong', error?.stack);
    }
  }

  async findAll(user: IDecoratorUser, status?: string) {
    const { id } = user;

    let data: InvoiceEntity[] = [];

    if (status) {
      data = await this._invoiceRepository.filterInvoices(user, status);
    } else {
      data = await this._invoiceRepository.find({
        where: { user: { id } },
        relations: { items: true },
      });
    }

    return data.map(({ items, ...record }) => {
      return {
        ...record,
        total: items.reduce((acc: number, item) => {
          return acc + Number(item.total);
        }, 0),
      };
    });
  }

  async findOne(publicId: string, user: IDecoratorUser) {
    try {
      const { street, city, postCode, country } = user;
      const data = await this._invoiceRepository.findOne({
        where: { publicId },
        relations: ['items'],
      });

      if (!data) {
        throw new BadRequestException('Invoice not found', data);
      }

      const total = data.items.reduce((curr, acc) => {
        return curr + Number(acc.total);
      }, 0);

      return {
        senderAddress: { street, city, postCode, country },
        ...data,
        total,
      };
    } catch (error: any) {
      if (error.code === PostgresError.INVALID_INPUT_SYNTAX) {
        throw new BadRequestException(
          `Invalid url parameter ${publicId} for publicId`,
        );
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong', null);
    }
  }

  async update(
    publicId: string,
    updateInvoiceDto: UpdateInvoiceDto,
    user: IDecoratorUser,
  ) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(updateInvoiceDto);

      const { items: invoiceItems, ...rest } = updateInvoiceDto;
      const invoice = await this.findOne(publicId, user);
      const updateResult = await this._invoiceRepository.update(
        { id: invoice.id },
        rest,
      );

      if (!updateResult.affected) {
        throw new BadRequestException('Unable to update invoice', null);
      }

      if (invoiceItems) {
        await Promise.all(
          invoiceItems?.map(async (item) => {
            // if the item PublicId is available, we update else create new record
            if (!item.publicId) {
              const entity = this._itemRepository.create({ ...item, invoice });
              return await this._itemRepository.save(entity);
            }

            const entity = await this._itemRepository.update(
              { publicId: item.publicId },
              item,
            );

            if (!entity.affected) {
              throw new BadRequestException('Unable to update invoice', null);
            }
            return await this._itemRepository.findOne({
              where: { publicId: item.publicId },
            });
          }),
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(publicId, user);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.log('Rollback Error', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong', null);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(publicId: string, user: IDecoratorUser) {
    try {
      const invoice = await this.findOne(publicId, user);
      const deletedInvoice = await this._invoiceRepository.softDelete({
        id: invoice.id,
      });

      if (!deletedInvoice.affected) {
        throw new BadRequestException('Unable to delete invoice', null);
      }

      return invoice;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong', null);
    }
  }

  async removeInvoiceItem(
    publicId: string,
    invoicePublicId: string,
    user: IDecoratorUser,
  ) {
    try {
      const invoice = await this.findOne(invoicePublicId, user);
      const item = invoice?.items?.find((item) => item.publicId === publicId);

      if (!item) {
        throw new BadRequestException('Item not found', null);
      }

      const deletedItem = await this._itemRepository.delete({
        publicId: item.publicId,
      });

      if (!deletedItem.affected) {
        throw new BadRequestException('Unable to delete item', null);
      }

      return item;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new ServerErrorException('Something went wrong', null);
    }
  }

  private generateInvoiceId() {
    const length = 6;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }
}
