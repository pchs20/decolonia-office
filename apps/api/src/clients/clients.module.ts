import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Client } from "./entities/client.entity";
import { ClientRepository } from "./entities/client.repository";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [
    ClientsService,
    {
      provide: ClientRepository,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => new ClientRepository(dataSource)
    }
  ],
  controllers: [ClientsController],
  exports: [ClientsService]
})
export class ClientsModule {}
