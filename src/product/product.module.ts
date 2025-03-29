import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Token } from 'src/user/entities/user.entity';
import {
  Product,
  Product_choice,
  Product_image,
} from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Token,
      Product,
      Product_image,
      Product_choice,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
