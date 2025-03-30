import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  Delete,
  Put,
  Req,
  ParseFilePipeBuilder,
  Body,
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
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  AddProduct(
    @Body()
    createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    image: Express.Multer.File,
    @Res() res,
    @Req() req,
  ) {
    return this.productService.AddProduct(createProductDto, image, res, req);
  }

  @UseGuards(UserGuard)
  @Put(':id')
  UpdateProductById(
    @Res() res,
    @Param() param,
    @Req() req,
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.EditProduct(
      res,
      req,
      param.id,
      updateProductDto,
    );
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  DeleteProduct(@Res() res, @Req() req, @Param() param) {
    return this.productService.DeleteProduct(res, req, param.id);
  }
}
