import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products-list.component').then((m) => m.ProductsListComponent),
  },
];
