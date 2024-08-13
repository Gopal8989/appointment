// src/db/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserSchema } from './user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(UserSchema);
    await repository.insert({
      firstName: 'admin',
      lastName: 'test',
      email: 'admin@yopmail.com',
      password: '$2b$10$S0TLzLyN2msPjdG4jCTX5e32RdYYbKSyByJjf6mKBWBHt1YBWck9C',
      profilePic: 'profile1.jpg',
      roleType: 'Admin',
      isActive: true,
    });
  }
}
