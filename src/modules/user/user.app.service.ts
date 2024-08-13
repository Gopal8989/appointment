import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from './user.entity';
import { PaginationDto, UserCreateBody, UserCreateRes } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserSchema)
    private usersRepository: Repository<UserSchema>,
    private jwtService: JwtService,
  ) {}

  async userCreate(userData: UserCreateBody): Promise<UserCreateRes> {
    const userRes = await this.usersRepository.findOne({
      where: { email: userData?.email },
    });
    if (userRes) {
      throw new BadRequestException('Email exist');
    }
    const saltOrRounds = 10;
    userData.password = await bcrypt.hash(userData?.password, saltOrRounds);
    return this.usersRepository.save(userData);
  }

  async signIn(payload: any): Promise<any> {
    const userRes = await this.usersRepository.findOne({
      where: { email: payload?.email },
    });
    if (!userRes) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const isMatch = await bcrypt.compare(payload?.password, userRes?.password);
    if (isMatch == false) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    delete userRes.password;
    return {
      accessToken: await this.jwtService.signAsync({ ...userRes }),
      ...userRes,
    };
  }

  async userProfile(id: number): Promise<any> {
    const userRes = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
        'roleType',
      ], // Exclude password field
    });
    if (!userRes) {
      throw new BadRequestException('User not found');
    }
    return userRes;
  }

  async getUsers(paginationDto: PaginationDto): Promise<any> {
    const { page, limit, sortBy, sortOrder, userType } = paginationDto;
    const where: any = {};
    if (userType) {
      where.roleType = userType;
    }
    const [users, totalUsers] = await this.usersRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
        'roleType',
      ], // Exclude p
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    };
  }

  async toggleActiveStatus(userId: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = !user.isActive;
    return this.usersRepository.save(user);
  }
}
