import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token, User } from 'src/user/entities/user.entity';
import { Order, Order_Items } from 'src/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Order, Order_Items])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
