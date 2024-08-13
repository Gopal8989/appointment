import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServicesService } from './appointment-service.app.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  SortDto,
  PaginationDto,
  ServiceCreateRes,
  ServiceDetailsRes,
} from './appointment-service.dto';

import { AuthGuard } from '../../midleware/user.auth.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from '../../midleware/roles.decorator';

@ApiTags('Service')
@ApiBearerAuth()
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: ServiceCreateRes })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  async serviceCreate(
    @Body() serviceData: CreateServiceDto,
  ): Promise<ServiceCreateRes> {
    return this.serviceService.serviceCreate(serviceData);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiParam({ name: 'id', type: String, description: 'Service ID' })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({ status: HttpStatus.OK, type: ServiceCreateRes })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  async serviceUpdate(
    @Param('id') id: string,
    @Body() serviceData: UpdateServiceDto,
  ): Promise<ServiceCreateRes> {
    return this.serviceService.serviceUpdate(id, serviceData);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get service details by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Service ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ServiceDetailsRes })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  async serviceDetails(@Param('id') id: string): Promise<ServiceDetailsRes> {
    return this.serviceService.serviceDetails(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a list of all services with pagination and sorting',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [ServiceDetailsRes] })
  async getServices(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
  ): Promise<{ data: ServiceDetailsRes[]; total: number }> {
    const { data, total } = await this.serviceService.getServices(
      paginationDto.page,
      paginationDto.limit,
      sortDto.sortBy,
      sortDto.sortOrder,
    );

    return { data, total };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  // @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Service ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Service deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  async serviceDelete(@Param('id') id: string): Promise<boolean> {
    return this.serviceService.serviceDelete(id);
  }
}
