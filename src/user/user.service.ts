import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
  ) {}
  async SignUp(createUserDto: CreateUserDto, res) {
    try {
      const User = createUserDto;
      User.password = await bcrypt.hash(User.password, 10);
      const is_created = await this.userRepository.save(User);
      if (is_created) {
        return res.status(200).json({ message: 'User created successfully' });
      }
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async SignIn(signUserDto: SignInDto, res: any) {
    try {
      const email = signUserDto.email;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new HttpException('Email or password is incorrect!', 404);
      }
      const isPasswordMatch = await bcrypt.compare(
        signUserDto.password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new HttpException('Email or password is incorrect!', 404);
      }
      const payload = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        tel_num: user.tel_num,
      };
      const token = await this.jwtService.sign(payload);
      const is_token_created = await this.tokenRepository.save({
        userId: user.id,
        token,
      });
      if (!is_token_created) {
        throw new HttpException('Token not created', 500);
      }
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      return res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async GetUserProfile(res, req) {
    try {
      const user = await req.user;
      const user_detail = await this.userRepository.findOne({
        where: { id: user.id },
        select: [
          'username',
          'email',
          'first_name',
          'last_name',
          'address',
          'tel_num',
          'created_at',
          'updated_at',
          'role',
        ],
      });
      if (!user_detail) {
        throw new HttpException('User not found!', 404);
      }
      return res.status(200).json({ user_detail });
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async UpdateUserProfile(updateUserDto: UpdateUserDto, res, req) {
    try {
      const user = await req.user;
      const user_property = await this.userRepository.findOne({
        where: { id: user.id },
      });
      if (!user_property) {
        throw new HttpException('User not found!', 404);
      }
      user_property.first_name = updateUserDto.first_name;
      user_property.last_name = updateUserDto.last_name;
      user_property.address = updateUserDto.address;
      if (!updateUserDto.email) {
        const email_already_exists = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (email_already_exists) {
          throw new HttpException('Email already exists', 409);
        }
        user_property.email = updateUserDto.email;
      }
      if (
        !updateUserDto.old_password &&
        updateUserDto.new_password == updateUserDto.confirm_new_password
      ) {
        user_property.password = await bcrypt.hash(
          updateUserDto.new_password,
          10,
        );
      }
      const updated_user = await this.userRepository.save(user_property);
      return res.status(200).json({ updated_user });
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async SignOut(res, req) {
    try {
      const user = await req.user;
      const token_property = await this.tokenRepository.findOne({
        where: { userId: user.id },
      });
      if (!token_property) {
        throw new HttpException('Token not found!', 404);
      }
      token_property.is_revoked = true;
      await this.tokenRepository.save(token_property);
      res.clearCookie('token');
      return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }
}
