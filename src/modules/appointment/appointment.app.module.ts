import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.app.service';
import { AppointmentController } from './appointment.app.controller';
import { AppointmentSchema } from './appointment.entity';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from 'src/services/email.service';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import { AvailabilitySchema } from '../availability/availability.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      AppointmentSchema,
      UserSchema,
      ServiceSchema,
      AvailabilitySchema,
    ]),
  ],
  providers: [AppointmentService, MailerService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
