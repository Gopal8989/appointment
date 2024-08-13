import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.app.controller';
import { UsersService } from './user.app.service';
import { S3Service } from 'src/services/s3.service';
import { CreateUserDto, PaginationDto, signInDto } from './user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UsersService;
  let s3Service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            userCreate: jest.fn(),
            signIn: jest.fn(),
            userProfile: jest.fn(),
            getUsers: jest.fn(),
            toggleActiveStatus: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
    s3Service = module.get<S3Service>(S3Service);
  });

  describe('userCreate', () => {
    it('should create a new user', async () => {
      const createUserDto: any = {
        email: 'test@example.com',
        password: 'strongpassword',
      };

      const userCreateRes: any = {
        id: 1,
        email: 'test@example.com',
      };

      jest.spyOn(userService, 'userCreate').mockResolvedValue(userCreateRes);

      const result = await userController.userCreate(createUserDto);
      expect(result).toEqual(userCreateRes);
      expect(userService.userCreate).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      const signInDto: signInDto = {
        email: 'test@example.com',
        password: 'strongpassword',
      };

      const signInRes = {
        token: 'jwt_token',
      };

      jest.spyOn(userService, 'signIn').mockResolvedValue(signInRes);

      const result = await userController.signIn(signInDto);
      expect(result).toEqual(signInRes);
      expect(userService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('getProfile', () => {
    it('should get user profile details', async () => {
      const userId = 1;
      const userProfile = {
        id: 1,
        email: 'test@example.com',
      };

      jest.spyOn(userService, 'userProfile').mockResolvedValue(userProfile);

      const result = await userController.getProfile(userId);
      expect(result).toEqual(userProfile);
      expect(userService.userProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('uploadProfilePicture', () => {
    it('should upload a profile picture', async () => {
      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const fileUrl = 'https://s3.amazonaws.com/test-bucket/test.jpg';

      jest.spyOn(s3Service, 'uploadFile').mockResolvedValue(fileUrl);

      const result = await userController.uploadProfilePicture(file);
      expect(result).toEqual({ url: fileUrl });
      expect(s3Service.uploadFile).toHaveBeenCalledWith(file);
    });

    it('should throw BadRequestException if no file is provided', async () => {
      await expect(userController.uploadProfilePicture(null)).rejects.toThrow(
        new BadRequestException('File is required'),
      );
    });
  });

  describe('getUsers', () => {
    it('should get a list of users with pagination', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'ASC',
        userType: 'user',
      };

      const usersList = [
        { id: 1, email: 'test1@example.com' },
        { id: 2, email: 'test2@example.com' },
      ];

      jest.spyOn(userService, 'getUsers').mockResolvedValue(usersList);

      const result = await userController.getUsers(paginationDto);
      expect(result).toEqual(usersList);
      expect(userService.getUsers).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('toggleUserActiveStatus', () => {
    it('should toggle user active status', async () => {
      const userId = 1;

      const toggleRes = { success: true };

      jest
        .spyOn(userService, 'toggleActiveStatus')
        .mockResolvedValue(toggleRes);

      const result = await userController.toggleUserActiveStatus(userId);
      expect(result).toEqual(toggleRes);
      expect(userService.toggleActiveStatus).toHaveBeenCalledWith(userId);
    });
  });
});
