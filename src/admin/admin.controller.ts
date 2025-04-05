import {
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserGuard } from 'src/user/user.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @UseGuards(UserGuard)
  @Get('status')
  GetStatus(@Res() res, @Req() req) {
    return this.adminService.GetStatus(res, req);
  }
  @UseGuards(UserGuard)
  @Get('order')
  GetOrder(@Res() res, @Req() req) {
    return this.adminService.GetOrder(res, req);
  }
  @UseGuards(UserGuard)
  @Get('user')
  GetUser(@Res() res, @Req() req) {
    return this.adminService.GetUser(res, req);
  }
  @UseGuards(UserGuard)
  @Put(':id/:role')
  ChangeUserRole(@Res() res, @Req() req, @Param('id') id, @Param('role') role) {
    return this.ChangeUserRole(res, req, id, role);
  }
}
