import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Entity,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  detail: string;
  @Column()
  stock: number;
  @Column({ type: 'float', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => Product_choice, (product_choice) => product_choice.product)
  product_choice: Product_choice[];
  @OneToMany(() => Product_image, (product_image) => product_image.product)
  product_image: Product_image[];
}

@Entity({ name: 'product_image' })
export class Product_image {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  image_type: string;
  @Column({ type: 'blob' })
  image: Buffer;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

@Entity({ name: 'product_choice' })
export class Product_choice {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  choice_name: string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
