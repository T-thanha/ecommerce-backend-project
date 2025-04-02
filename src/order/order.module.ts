import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Order_Items } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Token, User } from 'src/user/entities/user.entity';
import { Cart, Cart_items } from 'src/cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Order_Items,
      Product,
      User,
      Token,
      Cart,
      Cart_items,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
