import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './appointment.app.controller';
import { ServicesService } from './appointment.app.service';
import {
  CreateServiceDto,
  UpdateServiceDto,
  PaginationDto,
  SortDto,
  ServiceCreateRes,
  ServiceDetailsRes,
} from './appointment.dto';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { Role } from 'src/enum/role.enum';
import { Roles } from '../../midleware/roles.decorator';
import { HttpStatus } from '@nestjs/common';

describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServicesService;

  const mockService = {
    serviceCreate: jest.fn(),
    serviceUpdate: jest.fn(),
    serviceDetails: jest.fn(),
    getServices: jest.fn(),
    serviceDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServicesService>(ServicesService);
  });

  describe('serviceCreate', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service 1',
        description: 'A new service',
        duration: 30,
        price: 100.0,
      };
      const result: ServiceCreateRes = {
        id: 1,
        ...createServiceDto,
      };

      mockService.serviceCreate.mockResolvedValue(result);

      expect(await controller.serviceCreate(createServiceDto)).toEqual(result);
    });
  });

  describe('serviceUpdate', () => {
    it('should update an existing service', async () => {
      const updateServiceDto: UpdateServiceDto = {
        name: 'Updated Service',
      };
      const id = '1';
      const result: ServiceCreateRes = {
        id: 1,
        name: 'Updated Service',
        duration: 30,
        price: 100.0,
      };

      mockService.serviceUpdate.mockResolvedValue(result);

      expect(await controller.serviceUpdate(id, updateServiceDto)).toEqual(
        result,
      );
    });
  });

  describe('serviceDetails', () => {
    it('should return service details by ID', async () => {
      const id = '1';
      const result: ServiceDetailsRes = {
        id: 1,
        name: 'Service 1',
        description: 'A service',
        duration: 30,
        price: 100.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.serviceDetails.mockResolvedValue(result);

      expect(await controller.serviceDetails(id)).toEqual(result);
    });
  });

  describe('getServices', () => {
    it('should return a list of services with pagination and sorting', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const sortDto: SortDto = { sortBy: 'name', sortOrder: 'asc' };
      const result = {
        data: [
          {
            id: 1,
            name: 'Service 1',
            description: 'A service',
            duration: 30,
            price: 100.0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      };

      mockService.getServices.mockResolvedValue(result);

      expect(await controller.getServices(paginationDto, sortDto)).toEqual(
        result,
      );
    });
  });

  describe('serviceDelete', () => {
    it('should delete a service by ID', async () => {
      const id = '1';
      mockService.serviceDelete.mockResolvedValue(true);

      expect(await controller.serviceDelete(id)).toBe(true);
    });
  });
});
