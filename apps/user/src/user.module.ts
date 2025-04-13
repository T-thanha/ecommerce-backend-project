import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user-entity';
import { Token } from './entities/token-entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_USER_HOST || 'localhost',
      port: parseInt(process.env.DB_USER_PORT || '3306'),
      database: process.env.DB_USER_DATABASE || 'ecommerce-user',
      username: process.env.DB_USER_USERNAME || 'root',
      password: process.env.DB_USER_PASSWORD || 'root',
      entities: [User, Token],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Token]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY || 'test-key',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
