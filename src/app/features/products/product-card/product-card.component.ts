/**
 * Represents a card component for displaying product details and handling cart actions.
 */
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  input,
} from '@angular/core';
import { AppStoreService } from '../../../shared/store/app-store.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../../shared/models';
import { TaxUtils } from '../../../shared/utils/tax-utils';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [FormsModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  quantity: number = 1;
  product = input.required<Product>();
  _store = inject(AppStoreService);
  get isAvailable(): boolean {
    return this.product().quantity > 0;
  }

  get taxes(): number {
    return TaxUtils.calculateProductTaxPercentage(this.product());
  }

  get taxAmount(): number {
    return TaxUtils.calculateProductTaxAmount(this.product());
  }

  get priceTTC(): number {
    return TaxUtils.calculateProductPriceTTC(this.product());
  }
  /**
   * Adds the selected product and quantity to the cart if available and within allowed limits.
   */
  addToCart() {
    if (
      this.isAvailable &&
      this.quantity > 0 &&
      this.quantity <= this.product().quantity
    ) {
      this._store.addToCart(this.product(), this.quantity);
    }
  }
  /**
   * Updates the quantity of the product in the cart, ensuring it stays within valid bounds.
   */
  updateQuantity() {
    if (this.quantity < 1) {
      this.quantity = 1;
    } else if (this.quantity > this.product().quantity) {
      this.quantity = this.product().quantity;
    }
    this._store.updateCartQuantity(this.product().id, this.quantity);
  }
}
