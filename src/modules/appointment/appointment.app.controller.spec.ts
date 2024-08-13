import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.app.controller';
import { AppointmentService } from './appointment.app.service';
import {
  CreateAppointmentDto,
  FilterDto,
  UpdateAppointmentDto,
} from './appointment.dto';
import { AppointmentSchema } from './appointment.entity';
import { AuthGuard } from '../../midleware/user.auth.guard';
import { HttpStatus } from '@nestjs/common';

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  let appointmentService: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        {
          provide: AppointmentService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getAppointmentsPerService: jest.fn(),
            getUserActivity: jest.fn(),
            getTrendsOverTime: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    appointmentController = module.get<AppointmentController>(
      AppointmentController,
    );
    appointmentService = module.get<AppointmentService>(AppointmentService);
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const dto: CreateAppointmentDto = {
        serviceId: 1,
        serviceProviderId: 1,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };
      const result: AppointmentSchema = {
        id: 1,
        service: { id: 1, name: 'Service Name' } as any,
        serviceProvider: { id: 1, name: 'Provider Name' } as any,
        user: { id: 1, name: 'User Name' } as any,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(appointmentService, 'create').mockResolvedValue(result);

      expect(
        await appointmentController.create(dto, { user: { id: '1' } }),
      ).toBe(result);
      expect(appointmentService.create).toHaveBeenCalledWith(dto, '1');
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      const result = {
        data: [],
        total: 0,
      };

      jest.spyOn(appointmentService, 'findAll').mockResolvedValue(result);

      expect(
        await appointmentController.findAll(
          1,
          10,
          'createdAt',
          'ASC',
          {} as FilterDto,
        ),
      ).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single appointment', async () => {
      const result: AppointmentSchema = {
        id: 1,
        service: { id: 1, name: 'Service Name' } as any,
        serviceProvider: { id: 1, name: 'Provider Name' } as any,
        user: { id: 1, name: 'User Name' } as any,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(appointmentService, 'findOne').mockResolvedValue(result);

      expect(await appointmentController.findOne(1)).toBe(result);
      expect(appointmentService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const dto: UpdateAppointmentDto = {
        serviceId: 1,
        serviceProviderId: 1,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };
      const result: AppointmentSchema = {
        id: 1,
        service: { id: 1, name: 'Service Name' } as any,
        serviceProvider: { id: 1, name: 'Provider Name' } as any,
        user: { id: 1, name: 'User Name' } as any,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(appointmentService, 'update').mockResolvedValue(result);

      expect(await appointmentController.update(1, dto)).toBe(result);
      expect(appointmentService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete an appointment', async () => {
      const result = { affected: 1 };

      jest.spyOn(appointmentService, 'remove').mockResolvedValue(result);

      expect(await appointmentController.remove(1)).toBe(result);
      expect(appointmentService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getAppointmentsPerService', () => {
    it('should return appointments per service', async () => {
      const result = [{ serviceId: 1, total: 10 }];

      jest
        .spyOn(appointmentService, 'getAppointmentsPerService')
        .mockResolvedValue(result);

      expect(await appointmentController.getAppointmentsPerService()).toBe(
        result,
      );
      expect(appointmentService.getAppointmentsPerService).toHaveBeenCalledWith(
        1,
      );
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity', async () => {
      const result = [{ userId: 1, totalAppointments: 5 }];

      jest
        .spyOn(appointmentService, 'getUserActivity')
        .mockResolvedValue(result);

      expect(await appointmentController.getUserActivity()).toBe(result);
      expect(appointmentService.getUserActivity).toHaveBeenCalledWith(1);
    });
  });

  describe('getTrendsOverTime', () => {
    it('should return trends over time', async () => {
      const result = [{ month: 'January', totalAppointments: 20 }];

      jest
        .spyOn(appointmentService, 'getTrendsOverTime')
        .mockResolvedValue(result);

      expect(await appointmentController.getTrendsOverTime()).toBe(result);
      expect(appointmentService.getTrendsOverTime).toHaveBeenCalledWith(1);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an appointment', async () => {
      const dto: any = {
        status: 'completed',
      };
      const result: AppointmentSchema = {
        id: 1,
        service: { id: 1, name: 'Service Name' } as any,
        serviceProvider: { id: 1, name: 'Provider Name' } as any,
        user: { id: 1, name: 'User Name' } as any,
        appointmentDate: new Date('2024-08-11T10:00:00Z'),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(appointmentService, 'updateStatus').mockResolvedValue(result);

      expect(await appointmentController.updateStatus(1, dto)).toBe(result);
      expect(appointmentService.updateStatus).toHaveBeenCalledWith(1, dto);
    });
  });
});
