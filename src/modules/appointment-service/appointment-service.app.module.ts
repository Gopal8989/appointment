import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './appointment-service.app.service';
import { ServiceController } from './appointment-service.app.controller';
import { ServiceSchema } from './appointment-service.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([ServiceSchema])],
  providers: [ServicesService],
  controllers: [ServiceController],
})
export class ServiceModule {}
