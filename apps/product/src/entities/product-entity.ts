import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: '' })
  description: string;
  @Column()
  price: number;
  @Column()
  catagory: number;
  @Column()
  brand: number;
  @Column()
  stock: number;
  @Column({ default: false })
  isFeature: boolean;
}
