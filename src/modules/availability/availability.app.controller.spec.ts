import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityController } from './availability.app.controller';
import { AvailabilityService } from './availability.app.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  FilterDto,
  PaginationDto,
  SortDto,
} from './availability.dto';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { BadRequestException } from '@nestjs/common';

describe('AvailabilityController', () => {
  let controller: AvailabilityController;
  let service: AvailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        {
          provide: AvailabilityService,
          useValue: {
            getAllSlotAvailabilities: jest.fn(),
            createAvailability: jest.fn(),
            updateAvailability: jest.fn(),
            getAvailabilityById: jest.fn(),
            getAllAvailabilities: jest.fn(),
            deleteAvailability: jest.fn(),
            checkServiceValidity: jest.fn(),
            dateDifference: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AvailabilityController>(AvailabilityController);
    service = module.get<AvailabilityService>(AvailabilityService);
  });

  describe('getAllSlotAvailabilities', () => {
    it('should return a list of slot availabilities', async () => {
      const result = { data: [] };
      jest.spyOn(service, 'getAllSlotAvailabilities').mockResolvedValue(result);

      expect(await controller.getAllSlotAvailabilities({} as FilterDto)).toBe(
        result,
      );
    });
  });

  describe('createAvailability', () => {
    it('should create and return availability', async () => {
      const createDto: any | CreateAvailabilityDto = {
        serviceId: 1,
        startTime: new Date(),
        endTime: new Date(),
      };
      const userId = 1;
      const duration = 30;

      jest
        .spyOn(service, 'checkServiceValidity')
        .mockResolvedValue({ duration });
      jest.spyOn(service, 'dateDifference').mockResolvedValue(duration);
      jest.spyOn(service, 'createAvailability').mockResolvedValue({ id: 1 });

      expect(
        await controller.createAvailability(createDto, {
          user: { id: userId },
        }),
      ).toEqual({ id: 1 });
    });

    it('should throw a BadRequestException if the service is invalid', async () => {
      jest.spyOn(service, 'checkServiceValidity').mockResolvedValue(null);

      await expect(
        controller.createAvailability({} as CreateAvailabilityDto, {
          user: { id: 1 },
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException if the duration is less than the service duration', async () => {
      jest
        .spyOn(service, 'checkServiceValidity')
        .mockResolvedValue({ duration: 30 });
      jest.spyOn(service, 'dateDifference').mockResolvedValue(20);

      await expect(
        controller.createAvailability({} as CreateAvailabilityDto, {
          user: { id: 1 },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateAvailability', () => {
    it('should update and return the availability', async () => {
      const updateDto: UpdateAvailabilityDto = {
        serviceId: 1,
        startTime: String(new Date()),
        endTime: String(new Date()),
      };
      const duration = 30;

      jest
        .spyOn(service, 'checkServiceValidity')
        .mockResolvedValue({ duration });
      jest.spyOn(service, 'dateDifference').mockResolvedValue(duration);
      jest.spyOn(service, 'updateAvailability').mockResolvedValue({ id: 1 });

      expect(await controller.updateAvailability(1, updateDto)).toEqual({
        id: 1,
      });
    });

    it('should throw a BadRequestException if the service is invalid', async () => {
      jest.spyOn(service, 'checkServiceValidity').mockResolvedValue(null);

      await expect(
        controller.updateAvailability(1, {} as UpdateAvailabilityDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException if the duration is less than the service duration', async () => {
      jest
        .spyOn(service, 'checkServiceValidity')
        .mockResolvedValue({ duration: 30 });
      jest.spyOn(service, 'dateDifference').mockResolvedValue(20);

      await expect(
        controller.updateAvailability(1, {} as UpdateAvailabilityDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAvailabilityById', () => {
    it('should return availability by ID', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'getAvailabilityById').mockResolvedValue(result);

      expect(await controller.getAvailabilityById(1)).toBe(result);
    });
  });

  describe('getAllAvailabilities', () => {
    it('should return a list of availabilities', async () => {
      const result = { data: [], total: 0 };
      jest.spyOn(service, 'getAllAvailabilities').mockResolvedValue(result);

      expect(
        await controller.getAllAvailabilities(
          {} as PaginationDto,
          {} as SortDto,
          {} as FilterDto,
        ),
      ).toBe(result);
    });
  });

  describe('deleteAvailability', () => {
    it('should delete an availability', async () => {
      jest.spyOn(service, 'deleteAvailability').mockResolvedValue(undefined);

      expect(await controller.deleteAvailability(1)).toBeUndefined();
    });
  });
});
