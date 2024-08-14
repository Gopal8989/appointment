// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true, // Makes the configuration globally available
//     }),
//     TypeOrmModule.forRootAsync({
//       useFactory: () => ({
//         type: 'mysql',
//         host: 'localhost' || process.env.DB_HOST,
//         port: 3306 || Number(process.env.DB_PORT),
//         username: 'admin' || process.env.DB_USERNAME,
//         password: '12345' || process.env.DB_PASSWORD,
//         database: 'test' || process.env.DB_DATABASE,
//         entities: [],
//         autoLoadEntities: true,
//         synchronize: true,
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'admin'),
        password: configService.get<string>('DB_PASSWORD', '12345'),
        database: configService.get<string>('DB_DATABASE', 'test'),
        entities: [], // Add your entities here or use `autoLoadEntities: true`
        autoLoadEntities: true,
        synchronize: true, // For development only; set to false in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
