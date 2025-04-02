import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, Order_Items, order_status } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Cart, Cart_items } from 'src/cart/entities/cart.entity';
import { role, User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Order_Items)
    private orderItemRepo: Repository<Order_Items>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Cart_items) private cartItemRepo: Repository<Cart_items>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async CreateOrder(res, req) {
    const user = await req.user;
    const user_cart = await this.cartRepo.findOne({
      where: { userId: user.id },
    });
    if (!user_cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    const cart_items = await this.cartItemRepo.find({
      where: { cartId: user_cart.id },
    });
    if (!cart_items) {
      throw new HttpException('Cart is empty', HttpStatus.NOT_FOUND);
    }
    let user_order = await this.orderRepo.findOne({
      where: { userId: user.id },
    });
    if (!user_order) {
      const _order = new Order();
      _order.userId = user.id;
      user_order = this.orderRepo.create(_order);
    }
    cart_items.forEach((cart_item) => {
      const _orderitem = new Order_Items();
      _orderitem.productId = cart_item.productId;
      _orderitem.orderId = user_order.id;
      _orderitem.quantity = cart_item.quantity;
      this.orderItemRepo.create(_orderitem);
    });
    const orderItems = await this.orderItemRepo.find({
      where: { orderId: user_order.id },
    });
    return res.status(HttpStatus.OK).json({
      user_order,
      orderItems,
    });
  }

  async GetOrder(res, req) {
    try {
      const user = await req.user;
      const user_order = await this.orderRepo.findOne({
        where: { userId: user.id },
      });
      if (!user_order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      const order_items = await this.orderItemRepo.find({
        where: { orderId: user_order.id },
      });
      return res.status(HttpStatus.OK).json({
        user_order,
        order_items,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async GetOrderById(res, id: number) {
    const user_order = await this.orderRepo.findOne({ where: { userId: id } });
    if (!user_order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    const orderItems = await this.orderItemRepo.find({
      where: { orderId: user_order.id },
    });
    return res.status(HttpStatus.OK).json({
      user_order,
      orderItems,
    });
  }

  async update(res, req, id: number, status: order_status) {
    if (!status || !id) {
      throw new HttpException('Parameter Error', HttpStatus.BAD_REQUEST);
    }
    let user = await req.user;
    user = await this.userRepo.findOne({
      where: { id: user.id, email: user.email },
    });
    if (user.role != role.ADMIN) {
      throw new HttpException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
      );
    }
    let user_order = await this.orderRepo.findOne({ where: { userId: id } });
    if (!user_order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    user_order.status = status;
    user_order = await this.orderRepo.save(user_order);
    return res.status(HttpStatus.OK).json({
      user_order,
    });
  }
}
