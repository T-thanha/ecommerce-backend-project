import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'SignUp')
  SignUp(data) {
    return this.userService.SignUp(data);
  }

  @GrpcMethod('UserService', 'SignIn')
  SignIn(data) {
    return this.userService.SignIn(data);
  }
  @GrpcMethod('UserService', 'SignOut')
  SignOut(data) {
    return this.userService.SignOut(data);
  }
  @GrpcMethod('UserService', 'ValidateToken')
  ValidateToken(data) {
    return this.userService.ValidateToken(data);
  }
  @GrpcMethod('UserService', 'GetUserProfile')
  GetUserProfile(data) {
    return this.userService.GetUserProfile(data);
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  UpdateUserProfile(data) {
    return this.userService.UpdateUserProfile(data);
  }

  @GrpcMethod('UserService', 'ResetUserPassword')
  ResetUserPassword(data) {
    return this.userService.ResetUserPassword(data);
  }
}
