/**
 * Component for displaying the cart summary, including totals, taxes, and checkout actions.
 */
import { DecimalPipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { AppStoreService } from '../../../shared/store/app-store.service';
import { CartItem } from '../../../shared/models';
import { TaxUtils } from '../../../shared/utils/tax-utils';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  imports: [DecimalPipe],
})
export class CartSummaryComponent {
  cart: CartItem[] = [];

  constructor(private _store: AppStoreService) {
    effect(() => {
      // Automatically update cart when store changes
      this.cart = this._store.$cart();
    });
  }

  getTotalTaxes(cart: CartItem[]): number {
    return TaxUtils.getTotalTaxes(cart);
  }

  getTotalTTC(cart: CartItem[]): number {
    return TaxUtils.getTotalTTC(cart);
  }
}
