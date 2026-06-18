import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Address } from "./address.value-object";

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
  street!: string;

  @Column({ type: "varchar", length: 120 })
  city!: string;

  @Column({ type: "varchar", length: 20, name: "postal_code" })
  postalCode!: string;

  // Domain relation: work address represented as a value object over flat columns.
  get workAddress(): Address {
    return new Address(this.street, this.city, this.postalCode);
  }

  set workAddress(address: Address) {
    this.street = address.street;
    this.city = address.city;
    this.postalCode = address.postalCode;
  }

  @Column({ type: "text", nullable: true, name: "billing_street" })
  billingStreet!: string | null;

  @Column({ type: "varchar", length: 120, nullable: true, name: "billing_city" })
  billingCity!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true, name: "billing_postal_code" })
  billingPostalCode!: string | null;

  // Domain relation: billing address represented as a value object over flat columns.
  get billingAddress(): Address {
    return new Address(
      this.billingStreet ?? this.street,
      this.billingCity ?? this.city,
      this.billingPostalCode ?? this.postalCode
    );
  }

  set billingAddress(address: Address) {
    this.billingStreet = address.street;
    this.billingCity = address.city;
    this.billingPostalCode = address.postalCode;
  }

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
