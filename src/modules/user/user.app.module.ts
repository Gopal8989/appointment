import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.app.service';
import { UserController } from './user.app.controller';
import { UserSchema } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from 'src/services/s3.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserSchema])],
  providers: [UsersService, S3Service],
  controllers: [UserController],
})
export class UsersModule {}
