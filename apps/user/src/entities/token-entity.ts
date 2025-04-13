import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user-entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  token: string;
  @Column({ default: false })
  is_revoked: boolean;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: User;
}
