import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  Request,
  BadRequestException,
  UseGuards, // Import UseGuards
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AvailabilityService } from './availability.app.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  PaginationDto,
  SortDto,
  FilterDto,
} from './availability.dto';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from '../../midleware/roles.decorator';

@ApiTags('Availability')
@ApiBearerAuth()
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('slots')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      'Get a list of all availabilities slots with pagination and sorting',
  })
  @ApiResponse({ status: HttpStatus.OK })
  async getAllSlotAvailabilities(
    @Query() filterDto: FilterDto,
  ): Promise<{ data: any[] }> {
    return this.availabilityService.getAllSlotAvailabilities(filterDto);
  }
  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Roles(Role.Provider)
  @ApiOperation({ summary: 'Create a new availability' })
  @ApiBody({ type: CreateAvailabilityDto })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data' })
  async createAvailability(
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @Request() req,
  ): Promise<any> {
    const userId = req.user.id;

    const isServiceValid = await this.availabilityService.checkServiceValidity(
      createAvailabilityDto.serviceId,
    );
    if (!isServiceValid) {
      throw new BadRequestException(
        'Service is not valid or duration is incorrect',
      );
    }
    const diff = await this.availabilityService.dateDifference(
      createAvailabilityDto.startTime,
      createAvailabilityDto.endTime,
    );

    if (diff < Number(isServiceValid?.duration)) {
      throw new BadRequestException(
        'Service duration is greater start and end time',
      );
    }
    return this.availabilityService.createAvailability(
      createAvailabilityDto,
      userId,
      isServiceValid?.duration,
    );
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Roles(Role.Provider)
  @ApiOperation({ summary: 'Update an existing availability' })
  @ApiParam({ name: 'id', type: Number, description: 'Availability ID' })
  @ApiBody({ type: UpdateAvailabilityDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data or ID',
  })
  async updateAvailability(
    @Param('id') id: number,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ): Promise<any> {
    const isServiceValid = await this.availabilityService.checkServiceValidity(
      updateAvailabilityDto.serviceId,
    );
    if (!isServiceValid) {
      throw new BadRequestException(
        'Service is not valid or duration is incorrect',
      );
    }
    const diff = await this.availabilityService.dateDifference(
      updateAvailabilityDto.startTime,
      updateAvailabilityDto.endTime,
    );

    if (diff < Number(isServiceValid?.duration)) {
      throw new BadRequestException(
        'Service duration is greater start and end time',
      );
    }
    return this.availabilityService.updateAvailability(
      id,
      updateAvailabilityDto,
      isServiceValid?.duration,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get availability details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Availability ID' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  async getAvailabilityById(@Param('id') id: number): Promise<any> {
    return this.availabilityService.getAvailabilityById(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a list of all availabilities with pagination and sorting',
  })
  @ApiResponse({ status: HttpStatus.OK })
  async getAllAvailabilities(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortDto,
    @Query() filterDto: FilterDto,
  ): Promise<{ data: any[]; total: number }> {
    return this.availabilityService.getAllAvailabilities(
      paginationDto,
      sortDto,
      filterDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Provider)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an availability by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Availability ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Availability deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  async deleteAvailability(@Param('id') id: number): Promise<void> {
    return this.availabilityService.deleteAvailability(id);
  }
}
