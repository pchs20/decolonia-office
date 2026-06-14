import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { ConnectivityService } from "./connectivity.service";

@Module({
  controllers: [HealthController],
  providers: [ConnectivityService],
  exports: [ConnectivityService]
})
export class HealthModule {}
