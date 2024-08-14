import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.app.service';
import {
  CreateAppointmentDto,
  FilterDto,
  StatusUpdateDto,
  UpdateAppointmentDto,
} from './appointment.dto';
import { AppointmentSchema } from './appointment.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from '../../midleware/roles.decorator';

@ApiTags('Appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('appointments-per-service')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get the number of appointments per service' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The number of appointments per service',
  })
  async getAppointmentsPerService() {
    return this.appointmentService.getAppointmentsPerService();
  }

  @Get('user-activity')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get user activity statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User activity statistics retrieved successfully',
  })
  async getUserActivity() {
    return this.appointmentService.getUserActivity();
  }

  @Get('trends-over-time')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get trends over time for appointments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trends over time for appointments retrieved successfully',
  })
  async getTrendsOverTime() {
    return this.appointmentService.getTrendsOverTime();
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Appointment created successfully',
    type: AppointmentSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req,
  ): Promise<AppointmentSchema> {
    const userId = req.user.id;

    return this.appointmentService.create(createAppointmentDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Retrieve all appointments with pagination and sorting',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    description: 'Field to sort by',
    required: false,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'order',
    type: String,
    description: 'Sort order (ASC/DESC)',
    required: false,
    example: 'ASC',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of appointments retrieved successfully',
    type: [AppointmentSchema],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query() filterDto: FilterDto,
  ): Promise<{ data: AppointmentSchema[]; total: number }> {
    return this.appointmentService.findAll(page, limit, sort, order, filterDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve an appointment by its ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appointment retrieved successfully',
    type: AppointmentSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  async findOne(@Param('id') id: number): Promise<AppointmentSchema> {
    return this.appointmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update an existing appointment' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appointment updated successfully',
    type: AppointmentSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
  })
  async update(
    @Param('id') id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentSchema> {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  @Roles(Role.User)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update the status of an appointment' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiBody({
    type: StatusUpdateDto,
    required: true,
    description: 'Status update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Appointment status updated successfully',
    type: AppointmentSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  async updateStatus(
    @Param('id') id: number,
    @Body() statusDto: { status: string },
  ): Promise<AppointmentSchema> {
    return this.appointmentService.updateStatus(id, statusDto.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an appointment by its ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Appointment deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Appointment not found',
  })
  async remove(@Param('id') id: number): Promise<any> {
    return this.appointmentService.remove(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleReminders() {
    console.log('handleReminders is triggered');
    await this.appointmentService.sendReminders();
    await this.appointmentService.sendFollowUpEmails();
  }

  @Cron(CronExpression.EVERY_WEEKEND)
  async handleWeeklySummaries() {
    console.log('handleWeeklySummaries is triggered');
    await this.appointmentService.sendWeeklySummary();
  }
}
