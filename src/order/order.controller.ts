import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UserGuard } from 'src/user/user.guard';
import { order_status } from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  CreateOrder(@Res() res, @Req() req) {
    return this.orderService.CreateOrder(res, req);
  }

  @Get()
  @UseGuards(UserGuard)
  GetOrderUser(@Res() res, @Req() req) {
    return this.orderService.GetOrder(res, req);
  }

  @Get(':id')
  GetOrderById(@Res() res, @Param('id') id: string) {
    return this.orderService.GetOrderById(res, +id);
  }

  @UseGuards(UserGuard)
  @Patch(':id/:status')
  UpdateOrderStatus(
    @Res() res,
    @Req() req,
    @Param('id') id: string,
    @Param('status') status: order_status,
  ) {
    return this.orderService.update(res, req, +id, status);
  }
}
