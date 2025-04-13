import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(content: ExecutionContext): Promise<boolean> {
    const req = content.switchToHttp().getRequest();
    const token = req.cookies['token'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const result = await this.userService.ValidateToken({ token });
    if (!result.isValid) {
      throw new UnauthorizedException('Invalid or revoked token');
    }

    req.user = {
      user_id: result.userId,
      email: result.email,
      token: token,
    };
    return true;
  }
}
