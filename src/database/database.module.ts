import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost' || process.env.DB_HOST,
        port: 3306 || Number(process.env.DB_PORT),
        username: 'admin' || process.env.DB_USERNAME,
        password: '12345' || process.env.DB_PASSWORD,
        database: 'test' || process.env.DB_DATABASE,
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
