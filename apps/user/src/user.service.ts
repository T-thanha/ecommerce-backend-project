import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user-entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as grpc from '@grpc/grpc-js';
import { JwtService } from '@nestjs/jwt';
import { Token } from './entities/token-entity';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
  ) {}

  async SignUp(data) {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      const save_user = await this.userRepo.save(data);
      return {
        id: save_user.id,
        email: save_user.email,
        created_at: save_user.created_at.toISOString(),
      };
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }

  async SignIn(data) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: data.email },
      });
      if (!user) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'User not found',
        };
      }
      const isPasswordMatch = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordMatch) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'Email or password is incorrect!',
        };
      }
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const token = this.jwtService.sign(payload);
      const createToken = await this.tokenRepo.save({
        userId: user.id,
        token,
      });
      if (!createToken) {
        return {
          code: grpc.status.DATA_LOSS,
          message: 'Token not created',
        };
      }
      return {
        token: token,
      };
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }

  async SignOut(data: { user_id: string; email: string; token: string }) {
    try {
      const token = await this.tokenRepo.findOne({
        where: { token: data.token },
      });
      if (!token) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'Token not found',
        };
      }
      token.is_revoked = true;
      this.tokenRepo.save(token);
      return {
        is_success: true,
      };
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }

  async ValidateToken(data: { token: string }) {
    try {
      const tokenRecord = await this.tokenRepo.findOne({
        where: { token: data.token },
      });
      if (!tokenRecord || tokenRecord.is_revoked) {
        return { is_valid: false };
      }
      const payload = await this.jwtService.verifyAsync(data.token, {
        secret: process.env.SECRET_KEY || 'test-key',
      });
      if (!payload) {
        return { is_valid: false };
      }
      return { is_valid: true, user_id: payload.sub, email: payload.email };
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.messsge || 'Internal server error',
      });
    }
  }

  async GetUserProfile(data) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: data.user_id, email: data.email },
      });
      if (!user) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'User not found',
        };
      }
      return user;
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }

  async UpdateUserProfile(data) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: data.user_id, email: data.email },
      });
      if (!user) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'User not found',
        };
      }
      if (data.email) user.email = data.email;
      if (data.first_name) user.first_name = data.first_name;
      if (data.last_name) user.last_name = data.last_name;
      if (data.tel_num) user.tel_number = data.tel_num;
      if (data.address) user.address = data.address;
      this.userRepo.save(user);
      return data;
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }
  async ResetUserPassword(data) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: data.user_id, email: data.email },
      });
      if (!user) {
        return {
          code: grpc.status.NOT_FOUND,
          message: 'User not found',
        };
      }
      const compare_old_password = await bcrypt.compare(
        data.old_password,
        user.password,
      );
      if (!compare_old_password) {
        return {
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Password does not match',
        };
      }
      data.new_password = bcrypt.hash(data.new_password, 10);
      user.password = data.new_password;
      this.userRepo.save(user);
      return {
        code: grpc.status.OK,
        message: 'Password has been changed',
      };
    } catch (error) {
      throw new RpcException({
        code: grpc.status.INTERNAL,
        message: error.message || 'Internal server error',
      });
    }
  }
}
