import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UserGuard } from 'src/user/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  GetProductById(@Res() res, @Param() param) {
    return this.productService.GetProductById(res, param);
  }

  @Get()
  GetProduct(@Res() res) {
    return this.productService.GetProduct(res);
  }

  @UseGuards(UserGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  AddProduct(
    createProductDto: CreateProductDto,
    @UploadedFiles() image: Array<Express.Multer.File>,
    @Res() res,
  ) {
    return this.productService.AddProduct(createProductDto, image, res);
  }

  @UseGuards(UserGuard)
  @Put(':id')
  UpdateProductById(
    @Res() res,
    @Param() param,
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.EditProduct(res, param.id, updateProductDto);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  DeleteProduct(@Res() res, @Param() param) {
    return this.productService.DeleteProduct(res, param.id);
  }
}
