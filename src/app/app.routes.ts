/**
 * Defines the application's routing configuration, mapping URLs to components.
 */
import { Routes } from '@angular/router';
import { ProductsListComponent } from './features/products/products-list/products-list.component';
import { CartListComponent } from './features/cart/cart-list/cart-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsListComponent },
  { path: 'cart', component: CartListComponent },
];
