import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cart, Cart_items } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { UpdateQuantityItemDto } from './entities/dto/update-quantity-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Cart_items) private cartItemRepo: Repository<Cart_items>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}
  async GetCartItems(res, req) {
    try {
      const user = await req.user;
      let user_cart = await this.cartRepo.findOne({
        where: { userId: user.id },
      });
      if (!user_cart) {
        const _cart = new Cart();
        _cart.userId = user.id;
        user_cart = await this.cartRepo.create(_cart);
      }
      const cart_items = this.cartItemRepo.find({
        where: { cartId: user_cart.id },
      });
      return res.status(HttpStatus.OK).json({
        cart_items,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async AddCartItem(res, req, prodId) {
    try {
      const user = await req.user;
      const prod_prop = await this.productRepo.findOne({
        where: { id: prodId },
      });
      if (!prod_prop) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      let user_cart = await this.cartRepo.findOne({
        where: { userId: user.id },
      });
      if (!user_cart) {
        const _cart = new Cart();
        _cart.userId = user.id;
        user_cart = await this.cartRepo.create(_cart);
      }
      const is_has_item = await this.cartItemRepo.findOne({
        where: { cartId: user_cart.id, id: prodId },
      });
      if (!is_has_item) {
        const _cartitem = new Cart_items();
        _cartitem.cartId = user_cart.id;
        _cartitem.productId = prodId;
        _cartitem.quantity = 1;
        const cartitem = this.cartItemRepo.create(_cartitem);
        return res.status(HttpStatus.OK).json({
          cartitem,
        });
      } else {
        is_has_item.quantity += 1;
        const cartitem = this.cartItemRepo.save(is_has_item);
        return res.status(HttpStatus.OK).json({
          cartitem,
        });
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async UpdateQuantityItem(res, req, updateItemDto: UpdateQuantityItemDto) {
    try {
      const user = await req.user;
      const prod_prop = await this.productRepo.findOne({
        where: { id: updateItemDto.productId },
      });
      if (!prod_prop) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      let user_cart = await this.cartRepo.findOne({
        where: { userId: user.id },
      });
      if (!user_cart) {
        const _cart = new Cart();
        _cart.userId = user.id;
        user_cart = await this.cartRepo.create(_cart);
      }
      let cart_item = await this.cartItemRepo.findOne({
        where: { cartId: user_cart.id, productId: updateItemDto.productId },
      });
      if (!cart_item) {
        const _cartitem = new Cart_items();
        _cartitem.cartId = user_cart.id;
        _cartitem.productId = updateItemDto.productId;
        _cartitem.quantity = updateItemDto.quantity;
        cart_item = await this.cartItemRepo.create(_cartitem);
      } else {
        cart_item.quantity = updateItemDto.quantity;
        cart_item = await this.cartItemRepo.save(cart_item);
      }
      return res.status(HttpStatus.OK).json({
        cart_item,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async DeleteItem(res, req, prodId) {
    try {
      const user = await req.user;
      const user_cart = await this.cartRepo.findOne({
        where: { userId: user.id },
      });
      if (!user_cart) {
        throw new HttpException('User cart not found', HttpStatus.NOT_FOUND);
      }
      const deleted_item = await this.cartItemRepo.findOne({
        where: { productId: prodId, cartId: user_cart.id },
      });
      if (!deleted_item) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      this.cartItemRepo.delete(deleted_item);
      return res.status(HttpStatus.OK).json({
        message: 'Product has been remove from cart',
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
