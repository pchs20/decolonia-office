import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto, UpdateClientDto, ClientResponseDto } from "./dto/client.dto";

@ApiTags("Clients")
@Controller("api/clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a new client",
    description: "Creates a new client record with the provided information"
  })
  @ApiResponse({
    status: 201,
    description: "Client created successfully",
    type: ClientResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Validation error (missing fields, invalid data)"
  })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({
    summary: "List all active clients",
    description: "Retrieve a paginated list of active clients with optional search"
  })
  @ApiQuery({ name: "page", type: Number, required: false, example: 1 })
  @ApiQuery({ name: "limit", type: Number, required: false, example: 10 })
  @ApiQuery({ name: "search", type: String, required: false, example: "João" })
  @ApiResponse({
    status: 200,
    description: "List of clients retrieved successfully"
  })
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("search") search?: string
  ): Promise<{
    clients: ClientResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.clientsService.findAll(page, limit, search);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific client",
    description: "Retrieve details of a specific active client by ID"
  })
  @ApiParam({ name: "id", type: String, description: "Client ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Client retrieved successfully",
    type: ClientResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "Client not found"
  })
  async findById(@Param("id") id: string): Promise<ClientResponseDto> {
    return this.clientsService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a client",
    description: "Update specific fields of an existing client"
  })
  @ApiParam({ name: "id", type: String, description: "Client ID (UUID)" })
  @ApiResponse({
    status: 200,
    description: "Client updated successfully",
    type: ClientResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Validation error"
  })
  @ApiResponse({
    status: 404,
    description: "Client not found"
  })
  async update(
    @Param("id") id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete a client (soft delete)",
    description: "Mark a client as inactive (soft delete - not permanently removed)"
  })
  @ApiParam({ name: "id", type: String, description: "Client ID (UUID)" })
  @ApiResponse({
    status: 204,
    description: "Client deleted successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Client not found"
  })
  async delete(@Param("id") id: string): Promise<void> {
    return this.clientsService.delete(id);
  }
}
