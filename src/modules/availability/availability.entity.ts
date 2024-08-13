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

@Entity('availability')
export class AvailabilitySchema {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSchema, { eager: true })
  @JoinColumn({ name: 'serviceProviderId' })
  serviceProvider: UserSchema;

  @Column({
    type: 'enum',
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    nullable: false,
  })
  dayOfWeek: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  startTime: string; // HH:mm format

  @Column({ type: 'varchar', length: 5, nullable: false })
  endTime: string; // HH:mm format

  @Column({ type: 'text', nullable: true })
  slots: string; // New slots column with text data type

  @ManyToOne(() => ServiceSchema, { eager: true })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceSchema;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
