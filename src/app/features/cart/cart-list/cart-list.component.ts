/**
 * Component for displaying the list of items in the shopping cart.
 */
import { DecimalPipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { AppStoreService } from '../../../shared/store/app-store.service';
import { CartItem } from '../../../shared/models';
import { CartSummaryComponent } from '../cart-summary/cart-summary.component';
import { CartCardComponent } from '../cart-card/cart-card.component';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
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
