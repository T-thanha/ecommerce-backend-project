import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/user.entity';
import { Repository } from 'typeorm';

export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  async canActivate(content: ExecutionContext): Promise<boolean> {
    const req = content.switchToHttp().getRequest();
    const token = req.cookies['token'];
    if (!token) {
      throw new HttpException('Unauthorized access', 401);
    }
    const tokenExists = await this.tokenRepository.findOne({
      where: { token },
    });
    if (!tokenExists) {
      // Check if the token exists
      throw new HttpException('Unauthorized access', 401);
    } else if (tokenExists.is_revoked) {
      // Check if the token is revoked
      await this.tokenRepository.delete({ token });
      throw new HttpException('Unauthorized access', 401);
    }
    const payload = this.jwtService.verifyAsync(token, { secret: 'test-key' });
    if (!payload) {
      throw new HttpException('Unauthorized access', 401);
    }
    req['user'] = payload;
    return true;
  }
}
