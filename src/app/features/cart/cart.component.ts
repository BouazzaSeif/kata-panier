/**
 * Component for displaying the list of items in the shopping cart.
 */
import { Component, effect } from '@angular/core';
import { AppStoreService } from '../../shared/store/app-store.service';

import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CartCardComponent } from './components/cart-card/cart-card.component';
import { CartItem } from './models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CartSummaryComponent, CartCardComponent],
})
export class CartListComponent {
  cart: CartItem[] = [];

  constructor(private _store: AppStoreService) {
    effect(() => {
      // Automatically update cart when store changes
      this.cart = this._store.$cart();
    });
  }

  remove(productId: number) {
    this._store.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    this._store.updateCartQuantity(productId, quantity);
  }
}
