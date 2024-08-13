import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceSchema } from './appointment-service.entity';
import {
  CreateServiceDto,
  UpdateServiceDto,
  ServiceCreateRes,
  ServiceDetailsRes,
} from './appointment-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceSchema)
    private servicesRepository: Repository<ServiceSchema>,
  ) {}

  async serviceCreate(
    serviceData: CreateServiceDto,
  ): Promise<ServiceCreateRes> {
    const serviceRes = await this.servicesRepository.findOne({
      where: { name: serviceData?.name },
    });
    if (serviceRes) {
      throw new BadRequestException('Service name already exists');
    }

    const newService = this.servicesRepository.create(serviceData);
    return this.servicesRepository.save(newService);
  }

  async serviceUpdate(
    id: string,
    serviceData: UpdateServiceDto,
  ): Promise<ServiceCreateRes> {
    const service = await this.servicesRepository.findOne({
      where: { id: Number(id) },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.servicesRepository.update(id, serviceData);
    return this.servicesRepository.findOne({ where: { id: Number(id) } });
  }

  async serviceDetails(id: string): Promise<ServiceDetailsRes> {
    const service = await this.servicesRepository.findOne({
      where: { id: Number(id) },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async getServices(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: ServiceSchema[]; total: number }> {
    const [data, total] = await this.servicesRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sortBy]: sortOrder,
      },
    });

    return { data, total };
  }
  async serviceDelete(id: string): Promise<boolean> {
    const service = await this.servicesRepository.findOne({
      where: { id: Number(id) },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return !!(await this.servicesRepository.delete(id));
  }
}
