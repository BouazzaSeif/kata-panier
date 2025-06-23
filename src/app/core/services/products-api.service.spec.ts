/**
 * Unit tests for the ProductsApiService, ensuring correct API interactions and error handling.
 */
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../features/products/models';
import { ProductsApiService } from './products-api.service';

describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      productName: 'Laptop',
      price: 1000,
      quantity: 5,
      isImported: false,
      category: 'ELECTRONICS' as any,
    },
    {
      id: 2,
      productName: 'Book',
      price: 20,
      quantity: 10,
      isImported: true,
      category: 'BOOKS' as any,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct apiUrl', () => {
    const expectedUrl = `${environment.apiUrl}/products`;
    expect(service.apiUrl).toBe(expectedUrl);
  });

  it('should have http client injected', () => {
    expect(service.http).toBeDefined();
  });

  it('should have productsResource defined', () => {
    expect(service.productsResource).toBeDefined();
  });

  describe('loader function logic', () => {
    it('should test async loader logic with firstValueFrom', async () => {
      const testLoader = async (): Promise<Product[]> => {
        const products = await firstValueFrom(
          service.http.get<Product[]>(service.apiUrl)
        );
        return products;
      };

      const loaderPromise = testLoader();

      const req = httpMock.expectOne(service.apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`${environment.apiUrl}/products`);
      req.flush(mockProducts);
      const result = await loaderPromise;
      expect(result).toEqual(mockProducts);
    });

    it('should handle firstValueFrom with empty array', async () => {
      const testLoader = async (): Promise<Product[]> => {
        const products = await firstValueFrom(
          service.http.get<Product[]>(service.apiUrl)
        );
        return products;
      };

      const loaderPromise = testLoader();

      const req = httpMock.expectOne(service.apiUrl);
      req.flush([]);

      const result = await loaderPromise;
      expect(result).toEqual([]);
    });

    it('should handle async errors in loader', async () => {
      const testLoader = async (): Promise<Product[]> => {
        const products = await firstValueFrom(
          service.http.get<Product[]>(service.apiUrl)
        );
        return products;
      };

      const loaderPromise = testLoader();

      const req = httpMock.expectOne(service.apiUrl);
      req.error(new ErrorEvent('Network error'));

      try {
        await loaderPromise;
        fail('Expected promise to reject, but it resolved');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should test firstValueFrom converts Observable to Promise', async () => {
      const observable$ = service.http.get<Product[]>(service.apiUrl);
      const promise = firstValueFrom(observable$);
      expect(promise).toBeInstanceOf(Promise);

      const req = httpMock.expectOne(service.apiUrl);
      req.flush(mockProducts);

      const result = await promise;
      expect(result).toEqual(mockProducts);
    });

    it('should test complete async workflow: http.get -> firstValueFrom -> return', async () => {
      const testAsyncWorkflow = async (): Promise<Product[]> => {
        const httpCall$ = service.http.get<Product[]>(service.apiUrl);

        const products = await firstValueFrom(httpCall$);

        return products;
      };

      const workflowPromise = testAsyncWorkflow();

      const req = httpMock.expectOne(service.apiUrl);
      req.flush(mockProducts);

      const finalResult = await workflowPromise;
      expect(finalResult).toEqual(mockProducts);
    });
  });
});
