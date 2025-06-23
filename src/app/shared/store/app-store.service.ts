/**
 * Centralized store service for managing application state (products, cart) using Angular Signals and RxJS.
 */
import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../features/products/models';
import { CartItem } from '../../features/cart/models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class AppStoreService {
  $products = signal<Product[]>([]);
  $cart = signal<CartItem[]>([]);
  // Derived state
  cartCount = computed(() =>
    this.$cart().reduce((sum, item) => sum + item.quantity, 0)
  );
  cartTotal = computed(() =>
    this.$cart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  setProducts(products: Product[]) {
    this.$products.set(products);
  }

  /**
   * Adds a product to the shopping cart or updates its quantity if it already exists.
   * If the quantity is positive, it also updates the available product stock accordingly.
   */
  addToCart(product: Product, quantity: number) {
    const cart = this.$cart().slice();
    const idx = cart.findIndex((item) => item.product.id === product.id);
    if (idx > -1) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + quantity };
    } else {
      cart.push({ product, quantity });
    }
    if (quantity > 0) {
      const products = this.$products().map((p) =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity || 0) - quantity }
          : p
      );
      this.$products.set(products);
    }
    this.$cart.set(cart);
  }
  /**
   * Returns the total number of items in the cart
   */
  getTotalItems() {
    return this.cartCount();
  }

  /**
   * Removes a product from the cart by its ID
   */
  removeFromCart(productId: number) {
    const cart = this.$cart().filter((item) => item.product.id !== productId);
    this.$cart.set(cart);
  }

  /**
   * Updates the quantity of a specific product in the cart.
   * If the product exists in the cart, its quantity is updated to the specified value.
   * Other cart items remain unchanged.
   */
  updateCartQuantity(productId: number, quantity: number) {
    const cart = this.$cart().map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.$cart.set(cart);
  }

  /**
   * Clears all items from the shopping cart by setting it to an empty array.
   */
  clearCart() {
    this.$cart.set([]);
  }
}
