import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional, IsEmail } from "class-validator";

enum ClientType {
  Individual = "individual",
  Company = "company"
}

export class CreateClientDto {
  @ApiProperty({
    type: String,
    description: "Client name (individual or company name)",
    example: "João Silva"
  })
  @IsString()
  name!: string;

  @ApiProperty({
    type: String,
    description: "Client type",
    enum: ["individual", "company"],
    example: "individual"
  })
  @IsEnum(ClientType)
  type!: "individual" | "company";

  @ApiProperty({
    type: String,
    description: "Client work address",
    example: "Carrer de la Pau 123, Barcelona"
  })
  @IsString()
  address!: string;

  @ApiProperty({
    type: String,
    description: "Client billing address (optional, defaults to address)",
    example: "Carrer Principal 456, Barcelona",
    required: false
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({
    type: String,
    description: "Tax ID (NIF/NIE for individuals, CIF for companies)",
    example: "12345678X"
  })
  @IsString()
  taxId!: string;

  @ApiProperty({
    type: String,
    description: "Phone number (optional)",
    example: "+34 612 345 678",
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    type: String,
    description: "Email address (optional)",
    example: "joao@example.com",
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateClientDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String, enum: ["individual", "company"], required: false })
  @IsOptional()
  @IsEnum(ClientType)
  type?: "individual" | "company";

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ClientResponseDto {
  @ApiProperty({
    type: String,
    description: "Client ID (UUID)",
    example: "550e8400-e29b-41d4-a716-446655440000"
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: "Client name",
    example: "João Silva"
  })
  name!: string;

  @ApiProperty({
    type: String,
    description: "Client type",
    enum: ["individual", "company"],
    example: "individual"
  })
  type!: "individual" | "company";

  @ApiProperty({
    type: String,
    description: "Client work address",
    example: "Carrer de la Pau 123, Barcelona"
  })
  address!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Client billing address",
    example: "Carrer Principal 456, Barcelona"
  })
  billingAddress!: string | null;

  @ApiProperty({
    type: String,
    description: "Tax ID (NIF/NIE or CIF)",
    example: "12345678X"
  })
  taxId!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Phone number",
    example: "+34 612 345 678"
  })
  phone!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Email address",
    example: "joao@example.com"
  })
  email!: string | null;

  @ApiProperty({
    type: Boolean,
    description: "Whether the client is active",
    example: true
  })
  isActive!: boolean;

  @ApiProperty({
    type: String,
    format: "date-time",
    description: "Client creation timestamp",
    example: "2026-06-15T18:30:00Z"
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: "date-time",
    description: "Client last update timestamp",
    example: "2026-06-15T18:30:00Z"
  })
  updatedAt!: Date;
}
