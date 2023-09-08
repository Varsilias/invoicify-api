import { MigrationInterface, QueryRunner } from 'typeorm';
import * as data from '../../data.json';
import { UserEntity } from 'src/api/user/entities/user.entity';
import { InvoiceEntity } from 'src/api/invoice/entities/invoice.entity';
import { InvoiceStatusEnum } from 'src/common/types/InvoiceStatusEnum';
import { Utils } from 'src/common/utils';
import { ItemEntity } from 'src/api/invoice/entities/item.entity';

export class SeedTestData1694131611689 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { connection } = queryRunner;

    const builder = connection.createQueryBuilder();

    const InsertResult = await builder
      .insert()
      .into(UserEntity)
      .values({
        firstname: 'John',
        lastname: 'Doee',
        email: 'john2@gmail.com',
        street: "123 St. John's street",
        city: 'London',
        postCode: 'E1 3EZ',
        country: 'United Kingdom',
        password:
          '$2b$10$RK5YveBXkoWvBXLwXdN0BulI5DClfUBgedxo83sv8VL.EEsoE.04W',
      })
      .returning('id')
      .execute();

    // InsertResult {
    //   identifiers: [ { id: 1 } ],
    //   generatedMaps: [ { id: 1 } ],
    //   raw: [ { id: 1 } ]
    // }

    const userId = InsertResult?.raw[0]?.id;

    const user = await builder
      .select('user')
      .from(UserEntity, 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    console.log('DATA --- %o', data);

    const result = await Promise.all(
      data.map(async (invoice) => {
        const items = invoice?.items;
        const invoiceInsertResult = await builder
          .insert()
          .into(InvoiceEntity)
          .values({
            invoiceId: invoice.id,
            description: invoice.description,
            status: Utils.capitalize(invoice.status) as InvoiceStatusEnum,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            clientAddress: invoice.clientAddress.street,
            clientCity: invoice.clientAddress.city,
            clientPostcode: invoice.clientAddress.postCode,
            clientCountry: invoice.clientAddress.country,
            paymentDue: new Date(invoice.paymentDue).toISOString(),
            paymentTerms: invoice.paymentTerms,
            user: user,
          })
          .returning('id')
          .execute();

        const invoiceId = invoiceInsertResult?.raw[0]?.id;

        const itemInsertResult = await builder
          .insert()
          .into(ItemEntity)
          .values(
            items.map((item) => {
              return { ...item, invoice: { id: invoiceId } };
            }),
          )
          .execute();

        return { invoiceInsertResult, itemInsertResult };
      }),
    );

    console.log('User Seeded - %o', user);
    console.log('Invoices Seeded --- %o', result);
    console.log('Seeding Completed');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM items');
    await queryRunner.query('DELETE FROM invoices');
    await queryRunner.query('DELETE FROM users');
  }
}
