import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("clients")
@Index("idx_clients_name", ["name"])
@Index("idx_clients_is_active", ["isActive"])
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20, enum: ["individual", "company"] })
  type!: "individual" | "company";

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "text", nullable: true, name: "billing_address" })
  billingAddress!: string | null;

  @Column({ type: "varchar", length: 20, name: "tax_id" })
  taxId!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ type: "boolean", default: true, name: "is_active" })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;
}
