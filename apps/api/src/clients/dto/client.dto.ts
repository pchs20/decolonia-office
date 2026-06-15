import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsOptional, IsEmail } from "class-validator";

enum ClientType {
  Individual = "individual",
  Company = "company"
}

export class CreateClientDto {
  @ApiProperty({
    description: "Client name (individual or company name)",
    example: "João Silva"
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: "Client type",
    enum: ClientType,
    example: "individual"
  })
  @IsEnum(ClientType)
  type!: "individual" | "company";

  @ApiProperty({
    description: "Client work address",
    example: "Carrer de la Pau 123, Barcelona"
  })
  @IsString()
  address!: string;

  @ApiProperty({
    description: "Client billing address (optional, defaults to address)",
    example: "Carrer Principal 456, Barcelona",
    required: false
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({
    description: "Tax ID (NIF/NIE for individuals, CIF for companies)",
    example: "12345678X"
  })
  @IsString()
  taxId!: string;

  @ApiProperty({
    description: "Phone number (optional)",
    example: "+34 612 345 678",
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: "Email address (optional)",
    example: "joao@example.com",
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ClientType)
  type?: "individual" | "company";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ClientResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  type!: "individual" | "company";

  @ApiProperty()
  address!: string;

  @ApiProperty()
  billingAddress!: string | null;

  @ApiProperty()
  taxId!: string;

  @ApiProperty()
  phone!: string | null;

  @ApiProperty()
  email!: string | null;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
