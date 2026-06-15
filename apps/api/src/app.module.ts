import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./health/health.module";
import { ClientsModule } from "./clients/clients.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: process.env.DATABASE_NAME || "decolonia",
      entities: [__dirname + "/**/*.entity.ts"],
      migrations: [__dirname + "/migrations/*.ts"],
      migrationsRun: true,
      synchronize: false,
      logging: process.env.DATABASE_LOGGING === "true"
    }),
    HealthModule,
    ClientsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
