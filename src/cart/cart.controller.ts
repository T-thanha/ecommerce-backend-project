import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UserGuard } from 'src/user/user.guard';
import { UpdateQuantityItemDto } from './entities/dto/update-quantity-item.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  @UseGuards(UserGuard)
  GetCartItem(@Res() res, @Req() req) {
    return this.cartService.GetCartItems(res, req);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  AddCartItem(@Res() res, @Req() req, @Param() param) {
    return this.cartService.AddCartItem(res, req, param.id);
  }

  @Put()
  @UseGuards(UserGuard)
  UpdateQuantityItem(
    @Res() res,
    @Req() req,
    updateItemDto: UpdateQuantityItemDto,
  ) {
    return this.UpdateQuantityItem(res, req, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  DeleteCartItem(@Res() res, @Req() req, @Param() param) {
    return this.DeleteCartItem(res, req, param.id);
  }
}
