import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/user.app.module';
import { ServiceModule } from './modules/appointment-service/appointment-service.app.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contant/user.constant';
import { AvailabilityModule } from './modules/availability/availability.app.module';
import { AppointmentModule } from './modules/appointment/appointment.app.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    UsersModule,
    AvailabilityModule,
    AppointmentModule,
    ServiceModule,
  ],
})
export class AppModule {}
