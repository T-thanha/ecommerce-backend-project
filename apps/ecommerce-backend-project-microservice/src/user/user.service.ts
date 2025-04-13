import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
interface UserServiceInterface {
  SignUp(data);
  SignIn(data);
  ValidateToken(data);
  GetUserProfile(data);
  SignOut(data);
  UpdateUserProfile(data);
  ResetUserPassword(data);
}
@Injectable()
export class UserService implements OnModuleInit {
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}
  private userService: UserServiceInterface;
  async onModuleInit() {
    this.userService =
      this.client.getService<UserServiceInterface>('UserService');
  }
  async SignUp(data) {
    return await lastValueFrom(this.userService.SignUp(data));
  }

  async SignIn(res, data) {
    const result = await lastValueFrom(this.userService.SignIn(data));
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(HttpStatus.OK).json({
      token: result.token,
    });
  }

  async SignOut(req) {
    return await lastValueFrom(this.userService.SignOut(req));
  }

  async ValidateToken(data: { token: string }) {
    return await lastValueFrom(this.userService.ValidateToken(data));
  }

  async GetUserProfile(req) {
    return await lastValueFrom(this.userService.GetUserProfile(req));
  }

  async UpdateUserProfile(data) {
    return await lastValueFrom(this.userService.UpdateUserProfile(data));
  }

  async ResetUserPassword(data) {
    return await lastValueFrom(this.userService.ResetUserPassword(data));
  }
}
