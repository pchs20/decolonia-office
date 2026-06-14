import { Controller, Get, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConnectivityService } from "./connectivity.service";
import { HealthResponseSchema, ConnectivityResponseSchema } from "./health.schemas";

@ApiTags("Health")
@Controller()
export class HealthController {
  constructor(@Inject(ConnectivityService) private readonly connectivityService: ConnectivityService) {}

  @Get("health")
  @ApiOperation({
    summary: "API Health Check",
    description: "Returns the current health status of the API"
  })
  @ApiResponse({
    status: 200,
    description: "API is healthy",
    schema: HealthResponseSchema
  })
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }

  @Get("health/connectivity")
  @ApiOperation({
    summary: "Infrastructure Connectivity Check",
    description: "Verifies connectivity to all required dependencies (PostgreSQL, Object Storage)"
  })
  @ApiResponse({
    status: 200,
    description: "Connectivity check completed successfully",
    schema: ConnectivityResponseSchema
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error during connectivity check"
  })
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
