import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailabilitySchema } from './availability.entity';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  PaginationDto,
  SortDto,
  FilterDto,
} from './availability.dto';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import moment from 'moment';
import { AppointmentSchema } from '../appointment/appointment.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilitySchema)
    private readonly availabilityRepository: Repository<AvailabilitySchema>,
    @InjectRepository(UserSchema)
    readonly userRepository: Repository<UserSchema>,
    @InjectRepository(ServiceSchema)
    readonly serviceRepository: Repository<ServiceSchema>,

    @InjectRepository(AppointmentSchema)
    readonly appointmentRepository: Repository<AppointmentSchema>,
  ) {}

  async createAvailability(
    createAvailabilityDto: CreateAvailabilityDto,
    userId: number,
    duration: number,
  ): Promise<any> {
    const slots: any = await this.createTimeSlots(
      createAvailabilityDto?.startTime,
      createAvailabilityDto?.endTime,
      duration,
    );
    const availability = this.availabilityRepository.create({
      ...createAvailabilityDto,
      serviceProvider: { id: userId },
      service: { id: createAvailabilityDto?.serviceId },
      slots: JSON.stringify(slots),
    });

    return this.availabilityRepository.save(availability);
  }

  async createTimeSlots(
    startTimeStr: string,
    endTimeStr: string,
    duration: any,
  ) {
    const slots = [];
    const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes] = endTimeStr.split(':').map(Number);

    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      startHours,
      startMinutes,
    );
    const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      endHours,
      endMinutes,
    );

    let currentTime = startTime;

    const formatTime = (date) => {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    };

    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);

      if (slotEndTime > endTime) {
        break;
      }

      slots.push({
        start: formatTime(currentTime),
        end: formatTime(slotEndTime),
      });

      currentTime = slotEndTime;
    }

    return slots;
  }

  async dateDifference(startTime: string, endTime: string) {
    const today = new Date().toISOString().split('T')[0];

    const startDateTime: any = new Date(`${today}T${startTime}:00`);
    const endDateTime: any = new Date(`${today}T${endTime}:00`);

    const diffInMs = endDateTime - startDateTime;

    const diffInMinutes = diffInMs / 60000;

    console.log(`Difference: ${diffInMinutes} minutes`);
    return diffInMinutes;
  }

  async updateAvailability(
    id: number,
    updateAvailabilityDto: UpdateAvailabilityDto,
    duration: number,
  ): Promise<any> {
    const availability = await this.availabilityRepository.findOne({
      where: { id },
    });
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
    const slots: any = await this.createTimeSlots(
      updateAvailabilityDto?.startTime,
      updateAvailabilityDto?.endTime,
      duration,
    );
    Object.assign(availability, {
      ...updateAvailabilityDto,
      slots: JSON.stringify(slots),
    });
    return this.availabilityRepository.save(availability);
  }

  async getAvailabilityById(id: number): Promise<any> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: Number(id) },
      relations: ['serviceProvider', 'service'],
    });
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
    return availability;
  }

  async getAllAvailabilities(
    paginationDto: PaginationDto,
    sortDto: SortDto,
    filterDto: FilterDto,
  ): Promise<{ data: any[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const { serviceId, userId } = filterDto;
    const { sortBy = 'created_at', sortOrder = 'ASC' } = sortDto;
    const where: any = {};
    if (serviceId) {
      where.service = { id: serviceId };
    }
    if (userId) {
      where.serviceProvider = { id: userId };
    }
    const [result, total] = await this.availabilityRepository
      .createQueryBuilder('availability')
      .leftJoinAndSelect('availability.serviceProvider', 'serviceProvider')
      .leftJoinAndSelect('availability.service', 'service')
      .select([
        'availability.id',
        'availability.startTime',
        'availability.endTime',
        'availability.slots',
        'availability.dayOfWeek',
        'serviceProvider.id',
        'serviceProvider.firstName',
        'serviceProvider.lastName',
        'service.id',
        'service.name',
        'service.description',
      ])
      // .orderBy(`availability.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data: result, total };
  }

  async getAllSlotAvailabilities(
    filterDto: FilterDto,
  ): Promise<{ data: any[] }> {
    const { serviceId, userId, appointmentDate } = filterDto;
    const where: any = {};
    if (serviceId) {
      where.service = { id: serviceId };
    }
    if (userId) {
      where.serviceProvider = { id: userId };
    }
    if (appointmentDate) {
      const date = new Date(appointmentDate);
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      const dayIndex = date.getDay();
      const dayName = daysOfWeek[dayIndex];

      const capitalizedDayOfWeek =
        dayName.charAt(0).toUpperCase() + dayName.slice(1);
      where.dayOfWeek = capitalizedDayOfWeek;
    }

    let result: any = await this.availabilityRepository
      .createQueryBuilder('availability')
      // .where(where)
      .leftJoinAndSelect('availability.serviceProvider', 'serviceProvider')
      .leftJoinAndSelect('availability.service', 'service')
      .select([
        'availability.id',
        'availability.startTime',
        'availability.endTime',
        'availability.slots',
        'availability.dayOfWeek',
        'serviceProvider.id',
        'serviceProvider.firstName',
        'serviceProvider.lastName',
        'service.id',
        'service.name',
        'service.description',
      ])
      .getMany();
    result = await Promise.all(
      result.map(async (e) => {
        const appointment: any = await this.appointmentRepository.findOne({
          where: { service: { id: serviceId || 0 } },
        });
        const slot = JSON.parse(e?.slots);

        return slot.filter(
          (e) =>
            e?.start != appointment?.appointmentStart &&
            e?.end != appointment?.appointmentEnd,
        );
      }),
    );

    return { data: result.flat() };
  }

  async checkServiceValidity(serviceId: number): Promise<any> {
    const service = await this.serviceRepository.findOneById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }
    return service;
  }

  async deleteAvailability(id: number): Promise<void> {
    const result = await this.availabilityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
  }
}
