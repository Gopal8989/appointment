import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsIn,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from './appointment.entity';

// Base DTO for Pagination
export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number' })
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}

// Base DTO for Sorting
export class SortDto {
  @ApiProperty({ example: 'createdAt', description: 'Field to sort by' })
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @ApiProperty({ example: 'ASC', description: 'Sort order' })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
// import {

export class CreateAppointmentDto {
  // @ApiProperty({
  //   description: 'ID of the user making the appointment',
  //   example: 1,
  // })
  // @IsInt()
  // userId: number;

  @ApiProperty({ description: 'ID of the service being booked', example: 1 })
  @IsInt()
  serviceId: number;

  @ApiProperty({ description: 'ID of the service provider', example: 1 })
  @IsInt()
  serviceProviderId: number;

  @ApiProperty({
    description: 'Date and time of the appointment',
    example: '2024-08-11T10:00:00Z',
  })
  @IsDateString()
  appointmentDate: Date;

  @ApiProperty({ description: 'Start time in HH:mm format' })
  @IsString()
  @IsNotEmpty()
  appointmentStart: string;

  @ApiProperty({ description: 'End time in HH:mm format' })
  @IsString()
  @IsNotEmpty()
  appointmentEnd: string;
}

export class UpdateAppointmentDto {
  @ApiProperty({ description: 'ID of the service being booked', example: 1 })
  @IsInt()
  serviceId: number;

  @ApiProperty({ description: 'ID of the service provider', example: 1 })
  @IsInt()
  serviceProviderId: number;

  @ApiProperty({
    description: 'Date and time of the appointment',
    example: '2024-08-11T10:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  appointmentDate?: Date;

  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2024-08-11T10:00:00Z',
    required: false,
  })
  @ApiProperty({ description: 'Start time in HH:mm format' })
  @IsString()
  @IsNotEmpty()
  appointmentStart: string;

  @ApiProperty({ description: 'End time in HH:mm format' })
  @IsString()
  @IsNotEmpty()
  appointmentEnd: string;
}

export class StatusUpdateDto {
  @ApiProperty({
    description: 'status update appointment',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: string;
}

export class ChangeAppointmentStatusDto {
  @ApiProperty({
    description: 'Status of the appointment',
    example: AppointmentStatus.Completed,
    enum: AppointmentStatus,
    required: true,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}

export class AppointmentPerServiceDto {
  @ApiProperty({ description: 'Service ID' })
  serviceId: number;

  @ApiProperty({ description: 'Total number of appointments' })
  total: number;
}

export class UserActivityDto {
  @ApiProperty({ description: 'User ID' })
  userId: number;

  @ApiProperty({ description: 'Total number of appointments' })
  totalAppointments: number;
}

export class TrendsOverTimeDto {
  @ApiProperty({ description: 'Month of the year' })
  month: string;

  @ApiProperty({ description: 'Total number of appointments' })
  totalAppointments: number;
}

// Filtering DTO
export class FilterDto {
  @ApiPropertyOptional({ example: 1, description: 'userId' })
  @IsInt()
  @IsOptional()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({ example: 10, description: 'serviceId' })
  @IsInt()
  @IsOptional()
  @Min(1)
  serviceId?: number;

  @ApiPropertyOptional({ example: 10, description: 'providerId' })
  @IsInt()
  @IsOptional()
  @Min(1)
  providerId?: number;

  @ApiPropertyOptional({ example: 'booked', description: 'status' })
  @IsString()
  status?: string;
}
