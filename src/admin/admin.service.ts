import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, Order_Items } from 'src/order/entities/order.entity';
import { role, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Order_Items)
    private orderItemRepo: Repository<Order_Items>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async GetStatus(res, req) {}
  async GetOrder(res, req) {
    const user_admin = await req.user;
    const user_admin_prop = await this.userRepo.findOne({
      where: { id: user_admin.id, email: user_admin.email },
    });
    if (user_admin_prop?.role != role.ADMIN) {
      throw new HttpException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const order = await this.orderRepo.find();
    const order_items = await this.orderItemRepo.find();
    const order_and_items = order.map((eorder) => ({
      ...eorder,
      items: order_items.filter((item) => item.orderId == eorder.id),
    }));
    return res.status(HttpStatus.OK).json({
      order_and_items,
    });
  }
  async GetUser(res, req) {
    const user_admin = await req.user;
    const user_admin_prop = await this.userRepo.findOne({
      where: { id: user_admin.id, email: user_admin.email },
    });
    if (user_admin_prop?.role != role.ADMIN) {
      throw new HttpException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepo.find();
    return res.status(HttpStatus.OK).json({
      user,
    });
  }
  async ChangeUserRole(res, req, user_id, user_role) {
    const user_admin = await req.user;
    const user_admin_prop = await this.userRepo.findOne({
      where: { id: user_admin.id, email: user_admin.email },
    });
    if (user_admin_prop?.role != role.ADMIN) {
      throw new HttpException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user_prop = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user_prop) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user_prop.role = user_role;
    const updated_user = this.userRepo.save(user_prop);
    return res.status(HttpStatus.OK).json({
      updated_user,
    });
  }
}
