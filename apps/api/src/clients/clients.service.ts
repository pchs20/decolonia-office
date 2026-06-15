import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common";
import { Client } from "./entities/client.entity";
import { ClientRepository } from "./entities/client.repository";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";

@Injectable()
export class ClientsService {
  constructor(@Inject(ClientRepository) private clientRepository: ClientRepository) {}

  /**
   * Create a new client
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    this.validateClient(createClientDto);

    const client = this.clientRepository.create({
      ...createClientDto,
      isActive: true
    });

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

    const updated = { ...client, ...updateClientDto };
    this.validateClient(updated);

    await this.clientRepository.update(id, updateClientDto);
    return this.findById(id);
  }

  /**
   * Soft delete (mark as inactive)
   */
  async delete(id: string): Promise<void> {
    const client = await this.findById(id);
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

    if (!client.address || !client.address.trim()) {
      throw new BadRequestException("Client address is required");
    }

    if (!client.taxId || !client.taxId.trim()) {
      throw new BadRequestException("Client tax ID is required");
    }

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
}
