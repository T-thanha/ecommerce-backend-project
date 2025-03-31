import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Cart_items, (cart_items) => cart_items.cart)
  cart_items: Cart_items[];
}

@Entity({ name: 'Cart_items' })
export class Cart_items {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  cartId: number;
  @Column()
  productId: number;
  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
