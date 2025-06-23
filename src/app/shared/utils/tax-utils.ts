/**
 * Utility functions for tax calculations and related helpers.
 */
import { CartItem } from '../../features/cart/models/cart-item.model';
import { Product } from '../../features/products/models';
import { Category } from '../enums/product-category.enum';
import {
  ADDITIONAL_TAX_IMPORTED,
  TAX_RATE_BOOKS,
  TAX_RATE_DEFAULT,
  TAX_RATE_FOOD_MEDICINE,
} from '../enums/tax-const';
/**
 * Utility class for tax calculations and price computations.
 */
export class TaxUtils {
  /**
   * Rounds a tax amount up to the nearest 0.05.
   */
  static roundTax(amount: number): number {
    return Math.ceil(amount * 20) / 20;
  }

  /**
   * Returns the base tax rate for a product category.
   */
  private static getBaseTaxRate(category: Category): number {
    if (category === Category.Books) {
      return TAX_RATE_BOOKS;
    }
    if (category === Category.Food || category === Category.Medecine) {
      return TAX_RATE_FOOD_MEDICINE;
    }
    return TAX_RATE_DEFAULT;
  }

  /**
   * Returns the base tax percentage for a product category (for display).
   */
  private static getBaseTaxPercentage(category: Category): number {
    if (category === Category.Books) {
      return TAX_RATE_BOOKS * 100;
    }
    if (category === Category.Food || category === Category.Medecine) {
      return TAX_RATE_FOOD_MEDICINE * 100;
    }
    return TAX_RATE_DEFAULT * 100;
  }

  /**
   * Calculates the total tax amount for a product (single unit).
   */
  static calculateProductTaxAmount(product: Product): number {
    let tax = this.roundTax(
      product.price * this.getBaseTaxRate(product.category)
    );
    if (product.isImported) {
      tax += this.roundTax(product.price * ADDITIONAL_TAX_IMPORTED);
    }
    return tax;
  }

  /**
   * Calculates the total tax percentage for a product (for display).
   */
  static calculateProductTaxPercentage(product: Product): number {
    let percentage = this.getBaseTaxPercentage(product.category);
    if (product.isImported) {
      percentage += ADDITIONAL_TAX_IMPORTED * 100;
    }
    return percentage;
  }

  /**
   * Calculates the price including tax (TTC) for a single product.
   * Pttc = Pht + somme(arrondi(Pht*t/100))
   */
  static calculateProductPriceTTC(product: Product): number {
    const taxAmount = this.calculateProductTaxAmount(product);
    return Math.round((product.price + taxAmount) * 100) / 100;
  }

  /**
   * Calculates the total tax for a cart item (all units).
   */
  static calculateItemTax(item: CartItem): number {
    return this.calculateProductTaxAmount(item.product) * item.quantity;
  }

  /**
   * Calculates the total taxes for all items in the cart.
   */
  static getTotalTaxes(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + this.calculateItemTax(item), 0);
  }

  /**
   * Calculates the total price including taxes (TTC) for all items in the cart.
   */
  static getTotalTTC(cart: CartItem[]): number {
    return cart.reduce((sum, item) => {
      const itemTTC =
        (item.product.price + this.calculateProductTaxAmount(item.product)) *
        item.quantity;
      return sum + itemTTC;
    }, 0);
  }
}
