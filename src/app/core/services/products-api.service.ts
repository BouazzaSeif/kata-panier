/**
 * Service for interacting with the products API.
 * Handles HTTP requests to fetch product data from the backend.
 */
import { inject, Injectable, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../features/products/models';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  readonly apiUrl = `${environment.apiUrl}/products`;
  readonly http = inject(HttpClient);

  /**
   * Resource object that manages product data fetching.
   * Uses Angular's HttpClient to retrieve products from the API.
   * @returns A Resource object containing a loader function that returns a Promise of Product array
   */
  productsResource = resource({
    loader: async (): Promise<Product[]> => {
      const products = await firstValueFrom(
        this.http.get<Product[]>(this.apiUrl)
      );
      return products;
    },
  });
}
