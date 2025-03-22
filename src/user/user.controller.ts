import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin-user.dto';

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
}
