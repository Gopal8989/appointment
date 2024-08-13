import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.app.service';
import { AppointmentSchema, AppointmentStatus } from './appointment.entity';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import { AvailabilitySchema } from '../availability/availability.entity';
import { MailerService } from 'src/services/email.service';
import * as moment from 'moment';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepository: Repository<AppointmentSchema>;
  let userRepository: Repository<UserSchema>;
  let serviceRepository: Repository<ServiceSchema>;
  let availabilityRepository: Repository<AvailabilitySchema>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getRepositoryToken(AppointmentSchema),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserSchema),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ServiceSchema),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AvailabilitySchema),
          useClass: Repository,
        },
        {
          provide: MailerService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentRepository = module.get<Repository<AppointmentSchema>>(
      getRepositoryToken(AppointmentSchema),
    );
    userRepository = module.get<Repository<UserSchema>>(
      getRepositoryToken(UserSchema),
    );
    serviceRepository = module.get<Repository<ServiceSchema>>(
      getRepositoryToken(ServiceSchema),
    );
    availabilityRepository = module.get<Repository<AvailabilitySchema>>(
      getRepositoryToken(AvailabilitySchema),
    );
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new appointment', async () => {
      const createAppointmentDto: any = {
        serviceId: 1,
        serviceProviderId: 1,
        appointmentDate: new Date(),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };
      const userId = 'user1';

      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValueOnce({ id: '1' } as any);
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce({ id: '1', email: 'user@example.com' } as any);
      jest
        .spyOn(availabilityRepository, 'findOne')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(appointmentRepository, 'create')
        .mockReturnValue(createAppointmentDto as any);
      jest
        .spyOn(appointmentRepository, 'save')
        .mockResolvedValue(createAppointmentDto as any);
      jest.spyOn(appointmentRepository, 'findOne').mockResolvedValue({
        ...createAppointmentDto,
        user: { email: 'user@example.com' },
        serviceProvider: { email: 'provider@example.com' },
      } as any);
      jest.spyOn(mailerService, 'sendEmail').mockResolvedValue(undefined);

      const result = await service.create(createAppointmentDto, userId);

      expect(result).toEqual(createAppointmentDto);
      expect(mailerService.sendEmail).toHaveBeenCalledWith(
        'user@example.com',
        'Appointment Confirmation',
        expect.any(String),
      );
      expect(mailerService.sendEmail).toHaveBeenCalledWith(
        'provider@example.com',
        'New Appointment Booked',
        expect.any(String),
      );
    });

    it('should throw BadRequestException if service does not exist', async () => {
      jest.spyOn(serviceRepository, 'findOne').mockResolvedValueOnce(null);

      const createAppointmentDto: any = {
        serviceId: 1,
        serviceProviderId: 1,
        appointmentDate: new Date(),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };
      const userId = 'user1';

      await expect(
        service.create(createAppointmentDto, userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all appointments', async () => {
      const appointments = [{ id: 1, appointmentDate: new Date() }];
      const total = 1;

      jest.spyOn(appointmentRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([appointments, total]),
      } as any);

      const result = await service.findAll(1, 10, 'createdAt', 'ASC', {});

      expect(result).toEqual({ data: appointments, total });
    });
  });

  describe('findOne', () => {
    it('should return an appointment by ID', async () => {
      const appointment = { id: 1, appointmentDate: new Date() };

      jest
        .spyOn(appointmentRepository, 'findOne')
        .mockResolvedValue(appointment as any);

      const result = await service.findOne(1);

      expect(result).toEqual(appointment);
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      jest.spyOn(appointmentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateAppointmentDto: any = {
        serviceId: 1,
        serviceProviderId: 1,
        appointmentDate: new Date(),
      };
      const appointment = { id: 1, appointmentDate: new Date() };

      jest
        .spyOn(serviceRepository, 'findOne')
        .mockResolvedValue({ id: '1' } as any);
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ id: '1' } as any);
      jest
        .spyOn(availabilityRepository, 'findOne')
        .mockResolvedValue({} as any);
      jest
        .spyOn(appointmentRepository, 'findOne')
        .mockResolvedValue(appointment as any);
      jest
        .spyOn(appointmentRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.update(1, updateAppointmentDto);

      expect(result).toEqual({});
    });

    it('should throw NotFoundException if appointment to update does not exist', async () => {
      jest.spyOn(appointmentRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of an appointment', async () => {
      const appointment = {
        id: 1,
        appointmentDate: new Date(),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };

      jest
        .spyOn(appointmentRepository, 'findOneBy')
        .mockResolvedValue(appointment as any);
      jest
        .spyOn(appointmentRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(appointmentRepository, 'findOne')
        .mockResolvedValue(appointment as any);
      jest.spyOn(mailerService, 'sendEmail').mockResolvedValue(undefined);

      const result = await service.updateStatus(1, AppointmentStatus.Canceled);

      expect(result).toEqual({});
      expect(mailerService.sendEmail).toHaveBeenCalledWith(
        'user@example.com',
        'Appointment Cancellation',
        expect.any(String),
      );
      expect(mailerService.sendEmail).toHaveBeenCalledWith(
        'provider@example.com',
        'Appointment Canceled',
        expect.any(String),
      );
    });

    it('should throw BadRequestException if appointment is more than 24 hours away', async () => {
      const appointment = {
        id: 1,
        appointmentDate: moment().add(2, 'days').toDate(),
        appointmentStart: '10:00',
        appointmentEnd: '11:00',
      };

      jest
        .spyOn(appointmentRepository, 'findOneBy')
        .mockResolvedValue(appointment as any);

      await expect(
        service.updateStatus(1, AppointmentStatus.Canceled),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      jest
        .spyOn(appointmentRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(result).toEqual({});
    });

    it('should throw NotFoundException if appointment to remove does not exist', async () => {
      jest
        .spyOn(appointmentRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    describe('getAppointmentsPerService', () => {
      it('should return appointments per service', async () => {
        const result = [
          { serviceId: '1', serviceName: 'Service 1', total: '5' },
          { serviceId: '2', serviceName: 'Service 2', total: '3' },
        ];

        jest
          .spyOn(appointmentRepository, 'createQueryBuilder')
          .mockReturnValue({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(result),
          } as any);

        const res = await service.getAppointmentsPerService();

        expect(res).toEqual(result);
      });
    });

    describe('getUserActivity', () => {
      it('should return user activity', async () => {
        const result = [
          {
            userId: '1',
            firstName: 'John',
            lastName: 'Doe',
            totalAppointments: '10',
          },
          {
            userId: '2',
            firstName: 'Jane',
            lastName: 'Doe',
            totalAppointments: '7',
          },
        ];

        jest
          .spyOn(appointmentRepository, 'createQueryBuilder')
          .mockReturnValue({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            addGroupBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(result),
          } as any);

        const res = await service.getUserActivity();

        expect(res).toEqual(result);
      });
    });

    describe('getTrendsOverTime', () => {
      it('should return trends over time', async () => {
        const result = [
          { month: '2024-01', totalAppointments: '20' },
          { month: '2024-02', totalAppointments: '15' },
        ];

        jest
          .spyOn(appointmentRepository, 'createQueryBuilder')
          .mockReturnValue({
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(result),
          } as any);

        const res = await service.getTrendsOverTime();

        expect(res).toEqual(result);
      });
    });

    describe('sendReminders', () => {
      it('should send reminders for upcoming appointments', async () => {
        const now = moment();
        const twentyFourHoursLater = moment().add(24, 'hours');
        const upcomingAppointments = [
          {
            id: 1,
            appointmentDate: now.add(1, 'hour').toDate(),
            appointmentStart: '10:00',
            user: { email: 'user@example.com' },
          },
        ];

        jest
          .spyOn(appointmentRepository, 'find')
          .mockResolvedValue(upcomingAppointments as any);
        jest.spyOn(mailerService, 'sendEmail').mockResolvedValue(undefined);

        await service.sendReminders();

        expect(mailerService.sendEmail).toHaveBeenCalledWith(
          'user@example.com',
          'Appointment Reminder',
          expect.stringContaining(
            `Reminder: You have an appointment on ${moment(upcomingAppointments[0].appointmentDate).format('YYYY-MM-DD')} at ${upcomingAppointments[0].appointmentStart}.`,
          ),
        );
      });

      it('should not send reminders if no upcoming appointments', async () => {
        jest.spyOn(appointmentRepository, 'find').mockResolvedValue([]);

        await service.sendReminders();

        expect(mailerService.sendEmail).not.toHaveBeenCalled();
      });
    });

    describe('sendFollowUpEmails', () => {
      it('should send follow-up emails for past completed appointments', async () => {
        const twentyFourHoursAgo = moment().subtract(24, 'hours');
        const pastAppointments = [
          {
            id: 1,
            appointmentDate: moment().subtract(1, 'day').toDate(),
            user: { email: 'user@example.com' },
          },
        ];

        jest
          .spyOn(appointmentRepository, 'find')
          .mockResolvedValue(pastAppointments as any);
        jest.spyOn(mailerService, 'sendEmail').mockResolvedValue(undefined);

        await service.sendFollowUpEmails();

        expect(mailerService.sendEmail).toHaveBeenCalledWith(
          'user@example.com',
          'We Value Your Feedback',
          expect.stringContaining(
            `Please provide feedback for your appointment on ${moment(pastAppointments[0].appointmentDate).format('YYYY-MM-DD')}.`,
          ),
        );
      });

      it('should not send follow-up emails if no past appointments', async () => {
        jest.spyOn(appointmentRepository, 'find').mockResolvedValue([]);

        await service.sendFollowUpEmails();

        expect(mailerService.sendEmail).not.toHaveBeenCalled();
      });
    });

    describe('sendWeeklySummary', () => {
      it('should send weekly summary emails to service providers', async () => {
        const oneWeekAgo = moment().subtract(7, 'days');
        const serviceProviders = [{ email: 'provider@example.com' }];
        const appointments = [
          {
            id: 1,
            appointmentDate: moment().subtract(1, 'day').toDate(),
            appointmentStart: '10:00',
            user: { name: 'John Doe' },
            service: { name: 'Service 1' },
          },
        ];

        jest
          .spyOn(userRepository, 'find')
          .mockResolvedValue(serviceProviders as any);
        jest
          .spyOn(appointmentRepository, 'find')
          .mockResolvedValue(appointments as any);
        jest.spyOn(mailerService, 'sendEmail').mockResolvedValue(undefined);

        await service.sendWeeklySummary();

        expect(mailerService.sendEmail).toHaveBeenCalledWith(
          'provider@example.com',
          'Weekly Appointment Summary',
          expect.stringContaining(
            `Here is the summary of your appointments this week:`,
          ),
        );
      });

      it('should not send weekly summaries if no service providers', async () => {
        jest.spyOn(userRepository, 'find').mockResolvedValue([]);

        await service.sendWeeklySummary();

        expect(mailerService.sendEmail).not.toHaveBeenCalled();
      });
    });
  });
});
