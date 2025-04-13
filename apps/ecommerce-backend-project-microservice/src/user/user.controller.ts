import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from '../auth/auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  SignUp(@Body() data) {
    return this.userService.SignUp(data);
  }
  @Post('login')
  SignIn(@Res() res, @Body() data) {
    return this.userService.SignIn(res, data);
  }
  @UseGuards(UserGuard)
  @Get('logout')
  SignOut(@Req() req) {
    return this.userService.SignOut(req);
  }

  @UseGuards(UserGuard)
  @Get()
  GetUserProfile(@Req() req) {
    return this.userService.GetUserProfile(req);
  }
  @UseGuards(UserGuard)
  @Post('profile')
  UpdateUserProfile(@Req() req, @Body() data) {
    const combine_data = {
      user_id: req.user.user_id,
      email: data.email,
      token: req.user.token,
      first_name: data.first_name,
      last_name: data.last_name,
      tel_num: data.tel_num,
      address: data.address,
    };
    return this.userService.UpdateUserProfile(combine_data);
  }
  @UseGuards(UserGuard)
  @Post('reset')
  ResetUserPassword(@Req() req, @Body() data) {
    const combine_data = {
      user_id: req.user.user_id,
      email: req.user.email,
      old_password: data.old_password,
      new_password: data.new_password,
    };
    return this.userService.ResetUserPassword(combine_data);
  }
}
