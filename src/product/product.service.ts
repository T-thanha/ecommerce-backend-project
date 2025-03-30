import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, role } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  Product,
  Product_choice,
  Product_image,
} from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Product_image)
    private prodImageRepo: Repository<Product_image>,
    @InjectRepository(Product_choice)
    private prodChoiceRepo: Repository<Product_choice>,
  ) {}

  async GetProduct(res) {
    const prod_property = await this.productRepo.find();
    const prod_img = await this.prodImageRepo.find();
    const prod_and_image = prod_property.map((product) => ({
      ...product,
      image: prod_img.filter((img) => img.productId == product.id),
    }));
    return res.status(HttpStatus.OK).json({
      prod_and_image,
    });
  }
  //------------------------------------------------------------------------
  async GetProductById(res, id) {
    const prod_prop = await this.productRepo.findOne({ where: { id: id } });
    if (!prod_prop) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const prod_img_prop = await this.prodImageRepo.find({
      where: { productId: id },
    });
    const prod_and_image = {
      ...prod_prop,
      image: prod_img_prop,
    };
    return res.status(HttpStatus.OK).json({
      prod_and_image,
    });
  }
  //------------------------------------------------------------------------
  async AddProduct(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
    res,
    req,
  ) {
    try {
      const user = await req.user;
      const user_property = await this.userRepo.findOne({
        where: { id: user.id, email: user.email },
      });
      if (!user_property) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user_property.role != role.ADMIN) {
        throw new HttpException(
          "You don't have permision to access",
          HttpStatus.UNAUTHORIZED,
        );
      }

      const prod_prop = await this.productRepo.save(createProductDto);

      const proImg = new Product_image();
      proImg.productId = prod_prop.id;
      proImg.image_type = image.mimetype;
      proImg.image = image.buffer;
      this.prodImageRepo.save(proImg);

      return res.status(HttpStatus.OK).json({
        message: 'Product created susscessfully',
        product: prod_prop,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //------------------------------------------------------------------------
  async EditProduct(res, req, id, updateProductDto: UpdateProductDto) {
    try {
      const user = await req.user;
      const user_property = await this.userRepo.findOne({
        where: { id: user.id },
      });
      if (!user_property) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user_property.role != role.ADMIN) {
        throw new HttpException(
          "You don't have permission to access",
          HttpStatus.UNAUTHORIZED,
        );
      }
      const prod_prop = await this.productRepo.findOne({ where: { id: id } });
      if (!prod_prop) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const upd_prod_prop = await this.productRepo.save(updateProductDto);
      return res.status(HttpStatus.OK).json({
        upd_prod_prop,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  //------------------------------------------------------------------------
  async DeleteProduct(res, req, id) {
    try {
      const user = await req.user;
      const user_property = await this.userRepo.findOne({
        where: { id: user.id, email: user.email },
      });
      if (!user_property) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (user_property.role != role.ADMIN) {
        throw new HttpException(
          "You don't have permision to access",
          HttpStatus.UNAUTHORIZED,
        );
      }
      const prod_prop = await this.productRepo.findOne({ where: { id: id } });
      if (!prod_prop) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const is_deleted = await this.productRepo.remove(prod_prop);
      if (!is_deleted) {
        throw new HttpException(
          "Can't deleted product",
          HttpStatus.BAD_REQUEST,
        );
      }
      return res.status(HttpStatus.OK).json({
        message: 'Product deleted susscessfully',
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
