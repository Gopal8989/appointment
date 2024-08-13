import {
  IsString,
  IsOptional,
  IsInt,
  IsDecimal,
  IsNotEmpty,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Service Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the service',
    example: 'Service Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The duration of the service in minutes',
    example: 60,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'The price of the service', example: 99.99 })
  // @IsDecimal({ decimal_digits: '2', locale: 'en-US' })
  @Min(0)
  price: number;
}

export class UpdateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Updated Service Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the service',
    example: 'Updated Service Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The duration of the service in minutes',
    example: 90,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'The price of the service', example: 99.99 })
  // @IsDecimal({ decimal_digits: '2', locale: 'en-US' })
  @Min(0)
  price: number;
}

export class ServiceCreateRes {
  // @ApiProperty({ description: 'The ID of the created service', example: 1 })
  id: number;

  // @ApiProperty({
  //   description: 'The name of the service',
  //   example: 'Service Name',
  // })
  name: string;

  // @ApiProperty({
  //   description: 'The description of the service',
  //   example: 'Service Description',
  //   required: false,
  // })
  description?: string;

  // @ApiProperty({
  //   description: 'The duration of the service in minutes',
  //   example: 60,
  // })
  duration: number;

  // @ApiProperty({ description: 'The price of the service', example: 99 })
  price: number;
}

export class ServiceDetailsRes extends ServiceCreateRes {
  @ApiProperty({
    description: 'The creation date of the service',
    example: '2024-08-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the service',
    example: '2024-08-02T12:00:00Z',
  })
  updatedAt: Date;
}

export class PaginatedServiceResponse {
  @ApiProperty({ type: [ServiceDetailsRes] })
  data: ServiceDetailsRes[];

  @ApiProperty({ example: 100 })
  total: number;
}

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
