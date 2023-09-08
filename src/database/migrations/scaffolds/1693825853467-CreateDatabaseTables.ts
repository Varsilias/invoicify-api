import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabaseTables1693825853467 implements MigrationInterface {
  name = 'CreateDatabaseTables1693825853467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "items" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "total" numeric NOT NULL, "invoiceId" integer, CONSTRAINT "UQ_af1352e90ae5deb52f3791e43dc" UNIQUE ("publicId"), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")); COMMENT ON COLUMN "items"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "items"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "items"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "items"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "street" character varying, "city" character varying, "postCode" character varying, "country" character varying, "password" character varying NOT NULL, "emailConfirmed" boolean NOT NULL DEFAULT false, "securityToken" character varying(16), "securityTokenRequestedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9099c98f00a1b5aca6b8f7f04a3" UNIQUE ("publicId"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "users"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "users"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "users"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."InvoiceStatusEnum" AS ENUM('Paid', 'Pending', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."PaymentTermsEnum" AS ENUM('1', '7', '14', '30')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "blockedAt" TIMESTAMP WITH TIME ZONE, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "deletedAt" TIMESTAMP WITH TIME ZONE, "invoiceId" character varying NOT NULL, "description" text NOT NULL, "status" "public"."InvoiceStatusEnum" NOT NULL DEFAULT 'Pending', "clientName" character varying NOT NULL, "clientEmail" character varying NOT NULL, "clientAddress" character varying NOT NULL, "clientCity" character varying NOT NULL, "clientPostcode" character varying NOT NULL, "clientCountry" character varying NOT NULL, "paymentDue" TIMESTAMP WITH TIME ZONE NOT NULL, "paymentTerms" "public"."PaymentTermsEnum" NOT NULL, "userId" integer, CONSTRAINT "UQ_ef615089b3d172d2ba85715a682" UNIQUE ("publicId"), CONSTRAINT "UQ_08f5378a442d3a5ef489d43eb3c" UNIQUE ("invoiceId"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id")); COMMENT ON COLUMN "invoices"."isBlocked" IS 'Entity Blocked Status'; COMMENT ON COLUMN "invoices"."createdAt" IS 'Entity Created At'; COMMENT ON COLUMN "invoices"."updatedAt" IS 'Entity Updated At'; COMMENT ON COLUMN "invoices"."deletedAt" IS 'Entity Deleted At'`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_a146908d664d571c4ce8e23749d" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_a146908d664d571c4ce8e23749d"`,
    );
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."PaymentTermsEnum"`);
    await queryRunner.query(`DROP TYPE "public"."InvoiceStatusEnum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "items"`);
  }
}
