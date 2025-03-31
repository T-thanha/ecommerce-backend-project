import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from 'src/user/entities/user.entity';
import { Cart_items, Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Cart, Cart_items, Product])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
