import { IsNotEmpty } from 'class-validator';

export class UpdateQuantityItemDto {
  @IsNotEmpty()
  productId: number;
  @IsNotEmpty()
  quantity: number;
}
