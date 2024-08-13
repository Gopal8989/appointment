import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceDetailsRes } from '../appointment-service/appointment-service.dto';
// import { UserSchema } from './../user/user.entity';
// import { ServiceSchema } from './../appointment-service/appointment-service.entity';

export class CreateAvailabilityDto {
  // @ApiProperty({ description: 'ID of the service provider' })
  // @IsNotEmpty()
  // @IsString()
  // readonly serviceProviderId: string;

  @ApiProperty({
    description: 'Day of the week',
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  })
  @IsNotEmpty()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  readonly dayOfWeek: string;

  @ApiProperty({ description: 'Start time in HH:mm format' })
  @IsNotEmpty()
  @IsString()
  readonly startTime: string;

  @ApiProperty({ description: 'End time in HH:mm format' })
  @IsNotEmpty()
  @IsString()
  readonly endTime: string;

  @ApiProperty({ description: 'ID of the service' })
  @IsNotEmpty()
  @IsNumber()
  readonly serviceId: number;
}

export class UpdateAvailabilityDto {
  // @ApiProperty({ description: 'ID of the service provider', required: false })
  // @IsOptional()
  // @IsString()
  // readonly serviceProviderId?: string;

  @ApiProperty({
    description: 'Day of the week',
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    required: false,
  })
  @IsOptional()
  @IsEnum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ])
  readonly dayOfWeek?: string;

  @ApiProperty({ description: 'Start time in HH:mm format', required: false })
  @IsOptional()
  @IsString()
  readonly startTime?: string;

  @ApiProperty({ description: 'End time in HH:mm format', required: false })
  @IsOptional()
  @IsString()
  readonly endTime?: string;

  @ApiProperty({ description: 'ID of the service', required: false })
  @IsOptional()
  @IsNumber()
  readonly serviceId?: number;
}

export class PaginatedServiceResponse {
  @ApiProperty({ type: [ServiceDetailsRes] })
  data: ServiceDetailsRes[];

  @ApiProperty({ example: 100 })
  total: number;
}
export class SortDto {
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Field to sort by',
  })
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @ApiPropertyOptional({ example: 'ASC', description: 'Sort order' })
  @IsString()
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}

export class PaginationDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}

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

  @ApiPropertyOptional({
    example: 'YYYY-MM-DD',
    description: 'appointmentDate',
  })
  @IsString()
  @IsOptional()
  appointmentDate?: string;
}

export class OptionalQueryDto extends SortDto {
  @ApiPropertyOptional({
    type: PaginationDto,
    description: 'Pagination options',
  })
  @IsOptional()
  pagination?: PaginationDto;

  @ApiPropertyOptional({ type: FilterDto, description: 'Filter options' })
  @IsOptional()
  filter?: FilterDto;
}
