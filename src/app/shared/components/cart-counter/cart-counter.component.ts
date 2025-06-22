/**
 * Component for displaying the current number of items in the cart.
 */
import { Component, computed, inject } from '@angular/core';
import { AppStoreService } from '../../store/app-store.service';

@Component({
  selector: 'app-cart-counter',
  template: `<span
    class="cart-counter"
    [attr.aria-label]="'Panier avec ' + countCartItems() + ' produits'"
    >{{ countCartItems() }}</span
  >`,
  styleUrls: ['./cart-counter.component.scss'],
})
export class CartCounterComponent {
  private _store = inject(AppStoreService);
  countCartItems = computed(() => this._store.getTotalItems());
}
