import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Raw, MoreThan, Repository } from 'typeorm';
import { AppointmentSchema, AppointmentStatus } from './appointment.entity';
import {
  AppointmentPerServiceDto,
  CreateAppointmentDto,
  FilterDto,
  TrendsOverTimeDto,
  UpdateAppointmentDto,
  UserActivityDto,
} from './appointment.dto';

import { MailerService } from 'src/services/email.service';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import * as moment from 'moment';
import { AvailabilitySchema } from '../availability/availability.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentSchema)
    private readonly appointmentRepository: Repository<AppointmentSchema>,
    readonly mailerService: MailerService,
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
    @InjectRepository(ServiceSchema)
    private readonly serviceRepository: Repository<ServiceSchema>,
    @InjectRepository(AvailabilitySchema)
    private readonly availabilityRepository: Repository<AvailabilitySchema>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    userId: string,
  ): Promise<any> {
    const bodyData: any = {
      ...createAppointmentDto,
      user: { id: userId },
      service: { id: createAppointmentDto?.serviceId },
      serviceProvider: { id: createAppointmentDto?.serviceProviderId },
    };

    delete bodyData.serviceProviderId;
    delete bodyData.serviceId;
    const serviceResult = await this.serviceRepository.findOne({
      where: { id: createAppointmentDto?.serviceId },
    });
    if (!serviceResult) {
      throw new BadRequestException(`Service not exist`);
    }
    const providerResult = await this.userRepository.findOne({
      where: { id: createAppointmentDto?.serviceProviderId },
    });
    if (!providerResult) {
      throw new BadRequestException(`Provider not exist`);
    }

    const availabilityResult = await this.availabilityRepository.findOne({
      where: {
        serviceProvider: { id: createAppointmentDto?.serviceProviderId },
        service: { id: createAppointmentDto?.serviceId },
      },
    });
    if (!availabilityResult) {
      throw new BadRequestException(`Availability not exist`);
    }

    const appointment = this.appointmentRepository.create(bodyData);
    const result: any = await this.appointmentRepository.save(appointment);
    const appointmentResult = await this.appointmentRepository.findOne({
      where: { id: result?.id },
      relations: ['user', 'service', 'serviceProvider'],
    });
    await this.mailerService.sendEmail(
      appointmentResult.user.email,
      'Appointment Confirmation',
      `<p>Your appointment is confirmed for ${appointmentResult.appointmentDate}.</p>`,
    );

    await this.mailerService.sendEmail(
      appointmentResult.serviceProvider.email,
      'New Appointment Booked',
      `<p>You have a new appointment on ${appointmentResult.appointmentDate}.</p>`,
    );
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'ASC',
    filterDto: FilterDto,
  ): Promise<{ data: any[]; total: number }> {
    const where: any = {};
    const { serviceId, userId, providerId, status } = filterDto;

    if (serviceId) {
      where.service = { id: serviceId };
    }
    if (userId) {
      where.serviceProvider = { id: userId };
    }
    if (providerId) {
      where.user = { id: providerId };
    }

    if (status) {
      where.status = status;
    }

    const [appointments, total] = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where(where)
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.service', 'service')
      .leftJoinAndSelect('appointment.serviceProvider', 'serviceProvider')
      .select([
        'appointment.id',
        'appointment.appointmentDate',
        'appointment.appointmentStart',
        'appointment.appointmentEnd',
        'appointment.status',
        'appointment.createdAt',
        'user.id', // describe('getAppointmentsPerService', () => {
        //   it('should return appointments per service', async () => {
        //     const result =
        'user.firstName',
        'user.lastName',
        'service.id',
        'service.name',
        'service.description',
        'serviceProvider.id',
        'serviceProvider.firstName',
        'serviceProvider.lastName',
      ])
      .orderBy(`appointment.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data: appointments, total };
  }

  async findOne(id: number): Promise<any> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'service', 'serviceProvider'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    const serviceResult = await this.serviceRepository.findOne({
      where: { id: updateAppointmentDto?.serviceId },
    });
    if (!serviceResult) {
      throw new BadRequestException(`Service not exist`);
    }
    const providerResult = await this.userRepository.findOne({
      where: { id: updateAppointmentDto?.serviceProviderId },
    });
    if (!providerResult) {
      throw new BadRequestException(`Provider not exist`);
    }

    const availabilityResult = await this.availabilityRepository.findOne({
      where: {
        serviceProvider: { id: updateAppointmentDto?.serviceProviderId },
        service: { id: updateAppointmentDto?.serviceId },
      },
    });
    if (!availabilityResult) {
      throw new BadRequestException(`Availability not exist`);
    }

    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const bodyData: any = {
      ...updateAppointmentDto,
      service: { id: updateAppointmentDto?.serviceId },
      serviceProvider: { id: updateAppointmentDto?.serviceProviderId },
    };
    delete bodyData.serviceProviderId;
    delete bodyData.serviceId;
    const result = await this.appointmentRepository.update(id, bodyData);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return {};
  }

  async updateStatus(id: number, status: string): Promise<any> {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    const appointmentDate = moment(appointment?.appointmentDate).format(
      'YYYY-MM-DD',
    );
    const start = moment(
      `${appointmentDate} ${appointment.appointmentStart}:00`,
    ).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(
      `${appointmentDate} ${appointment.appointmentEnd}:00`,
    ).format('YYYY-MM-DD HH:mm:ss');
    const now = moment();
    if (now.diff(start, 'hours') > 24 || now.diff(end, 'hours') > 24) {
      throw new BadRequestException(
        'Appointment cannot be updated. The appointment date is more than 24 hours away.',
      );
    }
    const result: any = await this.appointmentRepository.update(id, {
      ...appointment,
      status,
    });
    const appointmentResult = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'service', 'serviceProvider'],
    });
    await this.mailerService.sendEmail(
      appointmentResult.user.email,
      'Appointment Cancellation',
      `<p>Your appointment on ${appointmentResult.appointmentDate} has been canceled.</p>`,
    );

    await this.mailerService.sendEmail(
      appointmentResult.serviceProvider.email,
      'Appointment Canceled',
      `<p>An appointment on ${appointmentResult.appointmentDate} has been canceled.</p>`,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return {};
  }

  async remove(id: number): Promise<any> {
    const result = await this.appointmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return {};
  }

  async getAppointmentsPerService(): Promise<AppointmentPerServiceDto[]> {
    const res = await this.appointmentRepository
      .createQueryBuilder('appointments')
      .select('service.id', 'serviceId')
      .addSelect('service.name', 'serviceName')
      .addSelect('COUNT(appointments.id)', 'total')
      .innerJoin('appointments.service', 'service')
      .groupBy('service.id')
      .addGroupBy('service.name')
      .getRawMany();

    return res;
  }

  async getUserActivity(): Promise<UserActivityDto[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointments')
      .select('user.id', 'userId')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .addSelect('COUNT(appointments.id)', 'totalAppointments')
      .innerJoin('appointments.user', 'user')
      .groupBy('user.id')
      .addGroupBy('user.firstName')
      .addGroupBy('user.lastName')
      .getRawMany();
  }

  async getTrendsOverTime(): Promise<TrendsOverTimeDto[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointments')
      .select("DATE_FORMAT(appointments.appointmentDate, '%Y-%m')", 'month')
      .addSelect('COUNT(appointments.id)', 'totalAppointments')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async sendReminders() {
    const now = moment();
    const twentyFourHoursLater = moment().add(24, 'hours');
    console.log('hiiiiiiiiiiiiiiii');
    const upcomingAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(now.toDate(), twentyFourHoursLater.toDate()),
        status: AppointmentStatus.Booked,
      },
      relations: ['user'],
    });

    for (const appointment of upcomingAppointments) {
      await this.mailerService.sendEmail(
        appointment.user.email,
        'Appointment Reminder',
        `<p>Reminder: You have an appointment on ${moment(appointment.appointmentDate).format('YYYY-MM-DD')} at ${appointment.appointmentStart}.</p>`,
      );
    }
  }

  async sendFollowUpEmails() {
    const twentyFourHoursAgo = moment().subtract(24, 'hours');
    console.log('hello');
    const pastAppointments = await this.appointmentRepository.find({
      where: {
        appointmentDate: Between(
          twentyFourHoursAgo.toDate(),
          moment().toDate(),
        ),
        status: AppointmentStatus.Completed,
      },
      relations: ['user'],
    });

    for (const appointment of pastAppointments) {
      await this.mailerService.sendEmail(
        appointment.user.email,
        'We Value Your Feedback',
        `<p>Please provide feedback for your appointment on ${moment(appointment.appointmentDate).format('YYYY-MM-DD')}.</p>`,
      );
    }
  }

  async sendWeeklySummary() {
    console.log('hello');

    const oneWeekAgo = moment().subtract(7, 'days');

    const serviceProviders = await this.userRepository.find({
      where: {
        roleType: 'provider',
        isActive: true,
      },
    });

    for (const provider of serviceProviders) {
      const appointments: any = await this.appointmentRepository.find({
        where: {
          serviceProvider: provider,
          appointmentDate: MoreThan(oneWeekAgo.toDate()),
          status: AppointmentStatus.Completed,
        },
        relations: ['user', 'service'],
      });

      const appointmentSummary = appointments
        .map(
          (appointment) => `
          <li>Appointment with ${appointment?.user?.name} for ${appointment.service.name} on ${moment(appointment.appointmentDate).format('YYYY-MM-DD')} at ${appointment.appointmentStart}</li>
        `,
        )
        .join('');

      await this.mailerService.sendEmail(
        provider.email,
        'Weekly Appointment Summary',
        `<p>Here is the summary of your appointments this week:</p><ul>${appointmentSummary}</ul>`,
      );
    }
  }
}
