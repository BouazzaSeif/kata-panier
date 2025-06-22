/**
 * Component for displaying a single cart item, including quantity controls and remove functionality.
 */
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Product } from '../../../shared/models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cart-card',
  templateUrl: 'cart-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class CartCardComponent {
  productAvailableQuantity = input<number>(1);
  productInCart = input<Product>();
  removeFromCart = output<number>();
  remove(id: number | undefined) {
    if (id !== undefined) {
      this.removeFromCart.emit(id);
    }
  }
}
