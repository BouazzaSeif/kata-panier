import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cart.component').then((m) => m.CartListComponent),
  },
];
