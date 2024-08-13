import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserSchema } from '../user/user.entity';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';

export enum AppointmentStatus {
  Booked = 'booked',
  Canceled = 'canceled',
  Completed = 'completed',
}

@Entity('appointments')
export class AppointmentSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSchema, (user) => user.appointmentsAsUser, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @ManyToOne(() => ServiceSchema, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceSchema;

  @ManyToOne(
    () => UserSchema,
    (serviceProvider) => serviceProvider.appointmentsAsProvider,
    { eager: true },
  )
  @JoinColumn({ name: 'serviceProviderId' })
  serviceProvider: UserSchema;

  @Column({ nullable: false })
  appointmentDate: Date;

  @Column({ nullable: false })
  appointmentStart: string;

  @Column({ nullable: false })
  appointmentEnd: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Booked,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
