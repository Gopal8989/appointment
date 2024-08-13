import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './appointment-service.app.controller';
import { ServicesService } from './appointment-service.app.service.spec';
import {
  CreateServiceDto,
  PaginationDto,
  SortDto,
  ServiceCreateRes,
  ServiceDetailsRes,
} from './appointment-service.dto';

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

  afterEach(() => {
    jest.clearAllMocks();
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
      expect(mockService.serviceCreate).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('serviceUpdate', () => {
    it('should update an existing service', async () => {
      const updateServiceDto: any = {
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
      expect(mockService.serviceUpdate).toHaveBeenCalledWith(
        id,
        updateServiceDto,
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
      expect(mockService.serviceDetails).toHaveBeenCalledWith(id);
    });
  });

  describe('getServices', () => {
    it('should return a list of services with pagination and sorting', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const sortDto: SortDto = { sortBy: 'name', sortOrder: 'ASC' };
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
      expect(mockService.getServices).toHaveBeenCalledWith(
        paginationDto.page,
        paginationDto.limit,
        sortDto.sortBy,
        sortDto.sortOrder,
      );
    });
  });

  describe('serviceDelete', () => {
    it('should delete a service by ID', async () => {
      const id = '1';
      mockService.serviceDelete.mockResolvedValue(true);

      expect(await controller.serviceDelete(id)).toBe(true);
      expect(mockService.serviceDelete).toHaveBeenCalledWith(id);
    });
  });
});
