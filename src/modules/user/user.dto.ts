import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Min,
  MinLength,
} from 'class-validator';
import { ICreateUser, ISignIn, IUserCreateRes } from './user.interface';
import { Role } from 'src/enum/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto implements Partial<ICreateUser> {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword@123',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Role type of the user',
    example: 'Admin',
    enum: Role,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role)
  roleType: string;

  @ApiPropertyOptional({
    description: 'ProfilePic path upload s3 images',
  })
  @IsOptional()
  @IsString()
  profilePic: string;
}

export class signInDto implements Partial<ISignIn> {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword@123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserCreateRes implements Partial<IUserCreateRes> {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export class UserCreateBody implements Partial<ICreateUser> {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    example: 'StrongPassword@123',
  })
  password?: string;
}

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({
    description: 'userType',
    example: 'user',
    enum: ['user', 'provider'],
  })
  @IsOptional()
  @IsIn(['user', 'provider'])
  userType?: 'user' | 'provider' = 'user';
}
