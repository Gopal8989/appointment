import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityService } from './availability.app.service';
import { AvailabilityController } from './availability.app.controller';
import { AvailabilitySchema } from './availability.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../user/user.app.module';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import { AppointmentSchema } from '../appointment/appointment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      AvailabilitySchema,
      UserSchema,
      ServiceSchema,
      AppointmentSchema,
    ]),
    UsersModule,
    // AvailabilityModule,
    // ServiceModule,
  ],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
})
export class AvailabilityModule {}
