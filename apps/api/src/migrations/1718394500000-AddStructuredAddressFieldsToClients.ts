import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStructuredAddressFieldsToClients1718394500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS street text DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS city varchar(120) DEFAULT ''`);
    await queryRunner.query(
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS postal_code varchar(20) DEFAULT ''`
    );

    await queryRunner.query(
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_street text DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_city varchar(120) DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_postal_code varchar(20) DEFAULT ''`
    );

    await queryRunner.query(`ALTER TABLE clients ALTER COLUMN address DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE clients ALTER COLUMN address SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS billing_postal_code`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS billing_city`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS billing_street`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS postal_code`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS city`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS street`);
  }
}
