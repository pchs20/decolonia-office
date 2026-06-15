import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateClientsTable1718394400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: "clients",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()"
          },
          {
            name: "name",
            type: "varchar",
            length: "255"
          },
          {
            name: "type",
            type: "varchar",
            length: "20"
          },
          {
            name: "address",
            type: "text"
          },
          {
            name: "billing_address",
            type: "text",
            isNullable: true
          },
          {
            name: "tax_id",
            type: "varchar",
            length: "20"
          },
          {
            name: "phone",
            type: "varchar",
            length: "20",
            isNullable: true
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: true
          },
          {
            name: "is_active",
            type: "boolean",
            default: true
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP"
          }
        ],
        indices: [
          {
            name: "idx_clients_name",
            columnNames: ["name"]
          },
          {
            name: "idx_clients_is_active",
            columnNames: ["is_active"]
          }
        ]
      }),
      true
    );

    await queryRunner.query(
      "ALTER TABLE clients ADD CONSTRAINT chk_clients_type CHECK (type IN ('individual', 'company'))"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("clients");
  }
}
