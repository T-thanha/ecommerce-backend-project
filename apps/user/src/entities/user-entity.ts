import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Token } from './token-entity';

export enum role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: '' })
  first_name: string;
  @Column({ default: '' })
  last_name: string;
  @Column({ default: '' })
  tel_number: string;
  @Column({ default: '' })
  address: string;
  @Column({ type: 'enum', enum: role, default: role.USER })
  role: role;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
