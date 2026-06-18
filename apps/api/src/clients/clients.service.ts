import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { Client } from "./entities/client.entity";
import { ClientRepository } from "./entities/client.repository";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { Address } from "./entities/address.value-object";

@Injectable()
export class ClientsService {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  /**
   * Create a new client
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    this.validateClient(createClientDto);

    const billingAddress = this.resolveBillingAddress(createClientDto);

    const client = this.clientRepository.create({
      ...createClientDto,
      isActive: true
    });

    client.workAddress = new Address(
      createClientDto.street.trim(),
      createClientDto.city.trim(),
      createClientDto.postalCode.trim()
    );
    client.billingAddress = billingAddress;

    return this.clientRepository.save(client);
  }

  /**
   * Find client by ID (active only)
   */
  async findById(id: string): Promise<Client> {
    const client = await this.clientRepository.findActiveById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  /**
   * Get all active clients with pagination and optional search
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ clients: Client[]; total: number; page: number; limit: number }> {
    let result;

    if (search) {
      result = await this.clientRepository.searchByName(search, page, limit);
    } else {
      result = await this.clientRepository.findActivePaginated(page, limit);
    }

    return {
      ...result,
      page,
      limit
    };
  }

  /**
   * Update an existing client
   */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // Verify client exists
    const client = await this.findById(id);

    if (updateClientDto.type) {
      this.validateType(updateClientDto.type);
    }

    this.validateBillingCompleteness(updateClientDto);

    const updated = this.clientRepository.merge(client, updateClientDto);

    const hasWorkAddressUpdate =
      updateClientDto.street !== undefined ||
      updateClientDto.city !== undefined ||
      updateClientDto.postalCode !== undefined;
    const hasBillingAddressUpdate =
      updateClientDto.billingStreet !== undefined ||
      updateClientDto.billingCity !== undefined ||
      updateClientDto.billingPostalCode !== undefined;

    if (hasWorkAddressUpdate && !hasBillingAddressUpdate) {
      updated.billingAddress = updated.workAddress;
    }

    if (!updated.billingStreet || !updated.billingCity || !updated.billingPostalCode) {
      updated.billingAddress = updated.workAddress;
    }

    this.validateClient(updated);

    return this.clientRepository.save(updated);
  }

  /**
   * Soft delete (mark as inactive)
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.clientRepository.softDeleteClient(id);
  }

  /**
   * Validate client data
   */
  private validateClient(client: any): void {
    // Validate required fields
    if (!client.name || !client.name.trim()) {
      throw new BadRequestException("Client name is required");
    }

    this.validateType(client.type);

    if (!client.street || !client.street.trim()) {
      throw new BadRequestException("Client street is required");
    }

    if (!client.city || !client.city.trim()) {
      throw new BadRequestException("Client city is required");
    }

    if (!client.postalCode || !client.postalCode.trim()) {
      throw new BadRequestException("Client postal code is required");
    }

    this.validateAddress(client.workAddress, "Client work address");

    if (!client.taxId || !client.taxId.trim()) {
      throw new BadRequestException("Client tax ID is required");
    }

    this.validateBillingCompleteness(client);

    // Validate email format if provided
    if (client.email && !this.isValidEmail(client.email)) {
      throw new BadRequestException("Invalid email format");
    }

    // Validate phone format if provided (basic check for length)
    if (client.phone && client.phone.length < 6) {
      throw new BadRequestException("Phone number must be at least 6 characters");
    }
  }

  /**
   * Validate client type
   */
  private validateType(type: string): void {
    if (!["individual", "company"].includes(type)) {
      throw new BadRequestException("Client type must be either 'individual' or 'company'");
    }
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resolveBillingAddress(client: CreateClientDto): Address {
    const billingStreet = client.billingStreet?.trim() || client.street.trim();
    const billingCity = client.billingCity?.trim() || client.city.trim();
    const billingPostalCode = client.billingPostalCode?.trim() || client.postalCode.trim();

    return new Address(billingStreet, billingCity, billingPostalCode);
  }

  private validateBillingCompleteness(client: any): void {
    const hasAnyBillingField =
      client.billingStreet !== undefined ||
      client.billingCity !== undefined ||
      client.billingPostalCode !== undefined;

    if (!hasAnyBillingField) {
      return;
    }

    const billingStreet = client.billingStreet?.trim();
    const billingCity = client.billingCity?.trim();
    const billingPostalCode = client.billingPostalCode?.trim();

    const hasAllBillingFields = Boolean(billingStreet && billingCity && billingPostalCode);
    const hasNoBillingFields = !billingStreet && !billingCity && !billingPostalCode;

    if (!hasAllBillingFields && !hasNoBillingFields) {
      throw new BadRequestException(
        "Billing street, city, and postal code must all be provided together"
      );
    }
  }

  private validateAddress(address: Address, label: string): void {
    if (!address.street?.trim() || !address.city?.trim() || !address.postalCode?.trim()) {
      throw new BadRequestException(`${label} is incomplete`);
    }
  }
}
