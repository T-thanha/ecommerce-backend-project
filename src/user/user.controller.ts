import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin-user.dto';
import { UserGuard } from './user.guard';

@Controller('api/auth/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  SignUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.SignUp(createUserDto);
  }

  @Post('login')
  SignIn(@Body() signUserDto: SignInDto, @Res() res) {
    return this.userService.SignIn(signUserDto, res);
  }
  @UseGuards(UserGuard)
  @Post('logout')
  SignOut(@Res() res, @Req() req) {
    return this.userService.SignOut(res,req);
  }
}
