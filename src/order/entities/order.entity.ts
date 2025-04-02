import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum order_status {
  waiting = 'waiting',
  suscess = 'suscess',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column({ type: 'enum', enum: order_status, default: order_status.waiting })
  status: order_status;

  @OneToMany(() => Order_Items, (order_items) => order_items.order)
  order_items: Order_Items[];
}

@Entity({ name: 'order_items' })
export class Order_Items {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  orderId: number;
  @Column()
  productId: number;
  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
