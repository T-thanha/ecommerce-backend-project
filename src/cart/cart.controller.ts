import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserGuard } from 'src/user/user.guard';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  @UseGuards(UserGuard)
  GetCartItem(@Res() res, @Req() req) {}

  @Post()
  @UseGuards(UserGuard)
  AddCartItem(@Res() res, @Req() req) {}

  @Put()
  @UseGuards(UserGuard)
  UpdateQuantityItem(@Res() res, @Req() req) {}

  @Delete()
  @UseGuards(UserGuard)
  DeleteCartItem(@Res() res, @Req() req) {}
}
