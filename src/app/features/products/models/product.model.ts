import { Category } from '../../../shared/enums/product-category.enum';
export interface Product {
  readonly id: number;
  readonly productName: string;
  readonly price: number;
  readonly quantity: number;
  readonly isImported: boolean;
  readonly category: Category;
}
