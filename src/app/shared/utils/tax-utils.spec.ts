import { TaxUtils } from './tax-utils';
import { Category } from '../enums/product-category.enum';
import {
  TAX_RATE_BOOKS,
  TAX_RATE_DEFAULT,
  TAX_RATE_FOOD_MEDICINE,
  ADDITIONAL_TAX_IMPORTED,
} from '../enums/tax-const';
import { Product, CartItem } from '../models';

describe('TaxUtils', () => {
  const book: Product = {
    id: 1,
    productName: 'Book',
    price: 10,
    category: Category.Books,
    isImported: false,
    quantity: 10,
  };
  const importedBook: Product = { ...book, isImported: true };
  const food: Product = {
    id: 2,
    productName: 'Food',
    price: 20,
    category: Category.Food,
    isImported: false,
    quantity: 5,
  };
  const med: Product = {
    id: 3,
    productName: 'Med',
    price: 30,
    category: Category.Medecine,
    isImported: false,
    quantity: 2,
  };
  const importedOther: Product = {
    id: 4,
    productName: 'Perfume',
    price: 50,
    category: Category.Parfum,
    isImported: true,
    quantity: 1,
  };

  it('should round tax to nearest 0.05', () => {
    expect(TaxUtils.roundTax(1.23)).toBeCloseTo(1.25);
    expect(TaxUtils.roundTax(1.2)).toBeCloseTo(1.2);
    expect(TaxUtils.roundTax(1.21)).toBeCloseTo(1.25);
  });

  it('should calculate product tax amount correctly', () => {
    expect(TaxUtils.calculateProductTaxAmount(book)).toBeCloseTo(
      TaxUtils.roundTax(book.price * TAX_RATE_BOOKS)
    );
    expect(TaxUtils.calculateProductTaxAmount(importedBook)).toBeCloseTo(
      TaxUtils.roundTax(book.price * TAX_RATE_BOOKS) +
        TaxUtils.roundTax(book.price * ADDITIONAL_TAX_IMPORTED)
    );
    expect(TaxUtils.calculateProductTaxAmount(food)).toBeCloseTo(
      TaxUtils.roundTax(food.price * TAX_RATE_FOOD_MEDICINE)
    );
    expect(TaxUtils.calculateProductTaxAmount(med)).toBeCloseTo(
      TaxUtils.roundTax(med.price * TAX_RATE_FOOD_MEDICINE)
    );
    expect(TaxUtils.calculateProductTaxAmount(importedOther)).toBeCloseTo(
      TaxUtils.roundTax(importedOther.price * TAX_RATE_DEFAULT) +
        TaxUtils.roundTax(importedOther.price * ADDITIONAL_TAX_IMPORTED)
    );
  });

  it('should calculate product tax percentage correctly', () => {
    expect(TaxUtils.calculateProductTaxPercentage(book)).toBeCloseTo(
      TAX_RATE_BOOKS * 100
    );
    expect(TaxUtils.calculateProductTaxPercentage(importedBook)).toBeCloseTo(
      TAX_RATE_BOOKS * 100 + ADDITIONAL_TAX_IMPORTED * 100
    );
    expect(TaxUtils.calculateProductTaxPercentage(food)).toBeCloseTo(
      TAX_RATE_FOOD_MEDICINE * 100
    );
    expect(TaxUtils.calculateProductTaxPercentage(importedOther)).toBeCloseTo(
      TAX_RATE_DEFAULT * 100 + ADDITIONAL_TAX_IMPORTED * 100
    );
  });

  it('should calculate product price TTC correctly', () => {
    expect(TaxUtils.calculateProductPriceTTC(book)).toBeCloseTo(
      book.price + TaxUtils.calculateProductTaxAmount(book)
    );
    expect(TaxUtils.calculateProductPriceTTC(importedOther)).toBeCloseTo(
      importedOther.price + TaxUtils.calculateProductTaxAmount(importedOther)
    );
  });

  it('should calculate item tax and cart totals correctly', () => {
    const cart: CartItem[] = [
      { product: book, quantity: 2 },
      { product: importedOther, quantity: 1 },
    ];
    const expectedTaxes =
      TaxUtils.calculateProductTaxAmount(book) * 2 +
      TaxUtils.calculateProductTaxAmount(importedOther) * 1;
    expect(TaxUtils.getTotalTaxes(cart)).toBeCloseTo(expectedTaxes);
    const expectedTTC =
      (book.price + TaxUtils.calculateProductTaxAmount(book)) * 2 +
      (importedOther.price +
        TaxUtils.calculateProductTaxAmount(importedOther)) *
        1;
    expect(TaxUtils.getTotalTTC(cart)).toBeCloseTo(expectedTTC);
  });
});
