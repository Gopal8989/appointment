// import { Role } from 'src/enum/role.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServiceSchema } from '../appointment-service/appointment-service.entity';
import { AppointmentSchema } from '../appointment/appointment.entity';

export enum Role {
  User = 'user',
  Admin = 'admin',
  Provider = 'provider',
}

@Entity('user')
export class UserSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  profilePic: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  roleType: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Optional One-to-Many relationship with ServiceSchema
  @OneToMany(() => ServiceSchema, (service) => service.serviceProvider, {
    nullable: true,
  })
  services?: ServiceSchema[];

  // Optional One-to-Many relationship with AppointmentSchema for the 'user' field
  @OneToMany(() => AppointmentSchema, (appointment) => appointment.user, {
    nullable: true,
  })
  appointmentsAsUser?: AppointmentSchema[];

  // Optional One-to-Many relationship with AppointmentSchema for the 'serviceProvider' field
  @OneToMany(
    () => AppointmentSchema,
    (appointment) => appointment.serviceProvider,
    { nullable: true },
  )
  appointmentsAsProvider?: AppointmentSchema[];
}
