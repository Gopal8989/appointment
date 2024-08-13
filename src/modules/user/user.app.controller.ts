import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.app.service';
import {
  CreateUserDto,
  PaginationDto,
  UserCreateRes,
  signInDto,
} from './user.dto';
import * as fs from 'fs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from '../../midleware/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { diskStorage } from 'multer';
import { S3Service } from 'src/services/s3.service';
// import { Public } from '../../midleware/public.decorator';

@ApiTags('Auth')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UsersService,
    readonly s3Service: S3Service,
  ) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  userCreate(@Body() userData: CreateUserDto): Promise<UserCreateRes> {
    return this.userService.userCreate(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  signIn(@Body() signInData: signInDto) {
    return this.userService.signIn(signInData);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('user/:id')
  @ApiOperation({ summary: 'Get user profile details' })
  @ApiResponse({ status: 200, description: 'User profile data retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  getProfile(@Param('id') id: number) {
    return this.userService.userProfile(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile picture to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File is required' })
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = await this.s3Service.uploadFile(file);
    return { url: fileUrl };
  }

  // @Post('upload-local')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './public/uploads',
  //       filename: (req, file, cb) => {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     dest: './public/uploads',
  //     fileFilter: (req, file, callback) => {
  //       const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  //       if (allowedMimes.includes(file.mimetype)) {
  //         callback(null, true);
  //       } else {
  //         callback(null, false);
  //       }
  //     },
  //   }),
  // )
  // @ApiOperation({ summary: 'Upload file to local storage' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'File to be uploaded',
  //   required: true,
  //   type: 'multipart/form-data',
  // })
  // @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   return file;
  // }

  // @Get(':filename')
  // @ApiOperation({ summary: 'Get a file by filename' })
  // @ApiParam({
  //   name: 'filename',
  //   required: true,
  //   description: 'Name of the file',
  // })
  // @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  // @ApiResponse({ status: 400, description: 'File not found' })
  // async getFile(@Param('filename') filename: string) {
  //   const filePath = path.join(__dirname, '../public/uploads/', filename);

  //   if (!fs.existsSync(filePath)) {
  //     throw new BadRequestException('File not found');
  //   }
  // }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Roles(Role.Admin)
  @Get('users')
  @ApiOperation({ summary: 'Get list of users with pagination and sorting' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'userType', required: false, enum: ['user', 'provider'] })
  getUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getUsers(paginationDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @Roles(Role.Admin)
  @Patch('user/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiResponse({ status: 200, description: 'User status toggled successfully' })
  toggleUserActiveStatus(@Param('id') id: number) {
    return this.userService.toggleActiveStatus(id);
  }
}
