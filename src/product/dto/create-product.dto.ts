import { IsNotEmpty } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  details: string;
  @IsNotEmpty()
  stock: number;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  image: Buffer[];
}
