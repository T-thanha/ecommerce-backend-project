import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from './user.guard';

@Controller('api/auth/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  SignUp(@Body() createUserDto: CreateUserDto, @Res() res) {
    return this.userService.SignUp(createUserDto,res);
  }

  @Post('login')
  SignIn(@Body() signUserDto: SignInDto, @Res() res) {
    return this.userService.SignIn(signUserDto, res);
  }

  @UseGuards(UserGuard)
  @Post('profile')
  UpdateUserProfile(@Res() res, @Req() req, updateUserDto: UpdateUserDto) {
    return this.userService.UpdateUserProfile(updateUserDto,res,req);
  }
  @UseGuards(UserGuard)
  @Get('profile')
  GetUserProfile(@Res() res, @Req() req) {
    return this.userService.GetUserProfile(res, req);
  }

  @UseGuards(UserGuard)
  @Get('logout')
  SignOut(@Res() res, @Req() req) {
    return this.userService.SignOut(res,req);
  }
}
