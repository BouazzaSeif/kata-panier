/**
 * Application-wide configuration settings, such as providers and global options.
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Aura from '@primeng/themes/aura';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { LOCAL_STORAGE_PREFIX } from '../environments/environment';
import { LocalStorageManager } from './core/services/local-storage.manager';
import { CartItem } from './features/cart/models/cart-item.model';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'primeng, base',
          },
        },
      },
    }),

    { provide: LOCAL_STORAGE_PREFIX, useValue: 'kata-panier-cart' },
    {
      provide: LocalStorageManager,
      useFactory: (prefix: string) =>
        new LocalStorageManager<CartItem[]>(prefix),
      deps: [LOCAL_STORAGE_PREFIX],
    },
  ],
};
