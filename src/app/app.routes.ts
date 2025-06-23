/**
 * Defines the application's routing configuration, mapping URLs to components.
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/product.routes').then((m) => m.routes),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.routes),
  },
];
