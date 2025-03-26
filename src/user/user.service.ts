import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin-user.dto';
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
  async SignUp(createUserDto: CreateUserDto) {
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

  async SignIn(signUserDto: SignInDto, res: any) {
    try {
      const email = signUserDto.email;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      const isPasswordMatch = await bcrypt.compare(
        signUserDto.password,
        user.password,
      );
      if (!isPasswordMatch) {
        throw new HttpException('Invalid credentials', 401);
      }
      const payload = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        tel_num: user.tel_num,
      };
      const token = await this.jwtService.sign(payload);
      const is_token_created = await this.tokenRepository.save({
        user_id: user.id,
        token,
      });
      if (!is_token_created) {
        throw new HttpException('Token not created', 500);
      }
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      throw new HttpException('User logged in successfully', 200);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async SignOut(res, req) {
    try {
      const user = req['user'];
      const revoke_token = await this.tokenRepository.update(
        { user_id: user.id },
        { is_revoked: true },
      );
      res.clearCookie('token');
      throw new HttpException('User logged out successfully', 200);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
