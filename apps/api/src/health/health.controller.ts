import { Controller, Get, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ConnectivityService } from "./connectivity.service";

@Controller()
export class HealthController {
  constructor(@Inject(ConnectivityService) private readonly connectivityService: ConnectivityService) {}

  @Get("health")
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }

  @Get("health/connectivity")
  async connectivity() {
    try {
      return await this.connectivityService.runChecks();
    } catch (error) {
      throw new HttpException(
        {
          status: "error",
          message: error instanceof Error ? error.message : String(error)
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
