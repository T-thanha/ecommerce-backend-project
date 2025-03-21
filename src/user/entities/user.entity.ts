import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

enum role {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    username: string;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column({default: ''})
    first_name: string;
    @Column({default: ''})
    last_name: string;
    @Column({default: ''})
    address: string;
    @Column({default: ''})
    tel_num: string;
    @Column({ type: 'enum', enum: role, default: role.USER})
    role: role;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => Token, token => token.user_id)
    tokens: Token[];
}

@Entity({name: 'tokens'})
export class Token {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    user_id: number;
    @Column({default: false})
    is_revoked: boolean;

    @ManyToOne(() => User, user => user.tokens)
    user: User;
}