import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const User = createUserDto;
      User.password = await bcrypt.hash(User.password, 10);
      const is_created = await this.userRepository.save(User);
      if (is_created) {
        throw new HttpException('User created successfully', 200);
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
