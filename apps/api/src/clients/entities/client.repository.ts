import { DataSource, Repository, ILike, UpdateResult } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Client } from "./client.entity";

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor(dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }

  /**
   * Find all active clients
   */
  async findActive(): Promise<Client[]> {
    return this.find({
      where: { isActive: true }
    });
  }

  /**
   * Find active client by ID
   */
  async findActiveById(id: string): Promise<Client | null> {
    return this.findOne({
      where: { id, isActive: true }
    });
  }

  /**
   * Search active clients by name (case-insensitive substring match)
   */
  async searchByName(
    name: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ clients: Client[]; total: number }> {
    const skip = (page - 1) * limit;

    const [clients, total] = await this.findAndCount({
      where: {
        isActive: true,
        name: ILike(`%${name}%`)
      },
      order: { createdAt: "DESC" },
      skip,
      take: limit
    });

    return { clients, total };
  }

  /**
   * Get paginated list of active clients
   */
  async findActivePaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ clients: Client[]; total: number }> {
    const skip = (page - 1) * limit;

    const [clients, total] = await this.findAndCount({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      skip,
      take: limit
    });

    return { clients, total };
  }

  /**
   * Soft delete: mark client as inactive
   */
  async softDeleteClient(id: string): Promise<UpdateResult> {
    return this.update({ id } as any, { isActive: false });
  }
}
