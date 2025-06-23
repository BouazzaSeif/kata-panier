import { TestBed } from '@angular/core/testing';
import { AppStoreService } from './app-store.service';

import { Category } from '../enums/product-category.enum';
import { Product } from '../../features/products/models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LocalStorageManager } from '../../core/services/local-storage.manager';
import { LOCAL_STORAGE_PREFIX } from '../../../environments/environment';
import { ProductsApiService } from '../../core/services/products-api.service';
import { CartItem } from '../../features/cart/models/cart-item.model';

describe('AppStoreService', () => {
  let service: AppStoreService;
  let mockProductsApiService: jest.Mocked<ProductsApiService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      productName: 'Laptop',
      price: 1000,
      quantity: 5,
      isImported: false,
      category: Category.Electric,
    },
    {
      id: 2,
      productName: 'Book',
      price: 20,
      quantity: 10,
      isImported: true,
      category: Category.Books,
    },
    {
      id: 3,
      productName: 'Phone',
      price: 800,
      quantity: 3,
      isImported: false,
      category: Category.Electric,
    },
  ];

  beforeEach(() => {
    // Mock ProductsApiService
    mockProductsApiService = {
      productsResource: {
        value: jest.fn().mockReturnValue([]),
      },
    } as any;

    // Mock localStorage for testing
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductsApiService, useValue: mockProductsApiService },

        // Provide the storage prefix
        { provide: LOCAL_STORAGE_PREFIX, useValue: 'test-app-' },

        // Use the same factory pattern as in your app
        {
          provide: LocalStorageManager,
          useFactory: (prefix: string) =>
            new LocalStorageManager<CartItem[]>(prefix),
          deps: [LOCAL_STORAGE_PREFIX],
        },
      ],
    });
    service = TestBed.inject(AppStoreService);
  });

  afterEach(() => {
    service.clearCart();
    service.$products.set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setProducts', () => {
    it('should set products in the store', () => {
      service.setProducts(mockProducts);

      expect(service.$products()).toEqual(mockProducts);
    });

    it('should replace existing products', () => {
      const firstProducts = [mockProducts[0]];
      const secondProducts = [mockProducts[1], mockProducts[2]];

      service.setProducts(firstProducts);
      expect(service.$products()).toEqual(firstProducts);

      service.setProducts(secondProducts);
      expect(service.$products()).toEqual(secondProducts);
    });

    it('should handle empty products array', () => {
      service.setProducts([]);

      expect(service.$products()).toEqual([]);
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
    });

    it('should add new product to empty cart', () => {
      const product = mockProducts[0];
      const quantity = 2;

      service.addToCart(product, quantity);

      const cart = service.$cart();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual({ product, quantity });
    });

    it('should add new product to existing cart', () => {
      const product1 = mockProducts[0];
      const product2 = mockProducts[1];

      service.addToCart(product1, 1);
      service.addToCart(product2, 2);

      const cart = service.$cart();
      expect(cart.length).toBe(2);
      expect(cart[0]).toEqual({ product: product1, quantity: 1 });
      expect(cart[1]).toEqual({ product: product2, quantity: 2 });
    });

    it('should update quantity when adding existing product', () => {
      const product = mockProducts[0];

      service.addToCart(product, 2);
      service.addToCart(product, 1);

      const cart = service.$cart();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual({ product, quantity: 3 });
    });

    it('should reduce product stock when adding to cart', () => {
      const product = mockProducts[0];

      service.addToCart(product, 2);

      const updatedProducts = service.$products();
      const updatedProduct = updatedProducts.find((p) => p.id === product.id);
      expect(updatedProduct?.quantity).toBe(3);
    });

    it('should handle zero quantity', () => {
      const product = mockProducts[0];
      const initialProductQuantity = product.quantity;

      service.addToCart(product, 0);

      const cart = service.$cart();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual({ product, quantity: 0 });
      const updatedProducts = service.$products();
      const updatedProduct = updatedProducts.find((p) => p.id === product.id);
      expect(updatedProduct?.quantity).toBe(initialProductQuantity);
    });

    it('should handle negative quantity', () => {
      const product = mockProducts[0];
      const initialProductQuantity = product.quantity;

      service.addToCart(product, -1);

      const cart = service.$cart();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual({ product, quantity: -1 });

      const updatedProducts = service.$products();
      const updatedProduct = updatedProducts.find((p) => p.id === product.id);
      expect(updatedProduct?.quantity).toBe(initialProductQuantity);
    });
  });

  describe('getTotalItems', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
    });

    it('should return 0 for empty cart', () => {
      expect(service.getTotalItems()).toBe(0);
    });

    it('should return correct total for single item', () => {
      service.addToCart(mockProducts[0], 3);

      expect(service.getTotalItems()).toBe(3);
    });

    it('should return correct total for multiple items', () => {
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 3);
      service.addToCart(mockProducts[2], 1);

      expect(service.getTotalItems()).toBe(6);
    });

    it('should update when cart items change', () => {
      service.addToCart(mockProducts[0], 2);
      expect(service.getTotalItems()).toBe(2);

      service.addToCart(mockProducts[0], 1);
      expect(service.getTotalItems()).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 1);
    });

    it('should remove item from cart', () => {
      service.removeFromCart(mockProducts[0].id);

      const cart = service.$cart();
      expect(cart.length).toBe(1);
      expect(cart[0].product.id).toBe(mockProducts[1].id);
    });

    it('should handle removing non-existent item', () => {
      const initialCartLength = service.$cart().length;

      service.removeFromCart(999);

      expect(service.$cart().length).toBe(initialCartLength);
    });

    it('should remove all instances of the product', () => {
      service.removeFromCart(mockProducts[0].id);
      service.removeFromCart(mockProducts[1].id);

      expect(service.$cart().length).toBe(0);
    });
  });

  describe('updateCartQuantity', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 1);
    });

    it('should update quantity for existing item', () => {
      service.updateCartQuantity(mockProducts[0].id, 5);

      const cart = service.$cart();
      const updatedItem = cart.find(
        (item) => item.product.id === mockProducts[0].id
      );
      expect(updatedItem?.quantity).toBe(5);
    });

    it('should not affect other items', () => {
      service.updateCartQuantity(mockProducts[0].id, 5);

      const cart = service.$cart();
      const otherItem = cart.find(
        (item) => item.product.id === mockProducts[1].id
      );
      expect(otherItem?.quantity).toBe(1);
    });

    it('should handle updating non-existent item', () => {
      const initialCart = service.$cart();

      service.updateCartQuantity(999, 5);

      expect(service.$cart()).toEqual(initialCart);
    });

    it('should handle zero quantity update', () => {
      service.updateCartQuantity(mockProducts[0].id, 0);

      const cart = service.$cart();
      const updatedItem = cart.find(
        (item) => item.product.id === mockProducts[0].id
      );
      expect(updatedItem?.quantity).toBe(0);
    });

    it('should handle negative quantity update', () => {
      service.updateCartQuantity(mockProducts[0].id, -1);

      const cart = service.$cart();
      const updatedItem = cart.find(
        (item) => item.product.id === mockProducts[0].id
      );
      expect(updatedItem?.quantity).toBe(-1);
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 1);
    });

    it('should clear all items from cart', () => {
      service.clearCart();

      expect(service.$cart()).toEqual([]);
      expect(service.getTotalItems()).toBe(0);
    });

    it('should handle clearing empty cart', () => {
      service.clearCart();
      service.clearCart();
      expect(service.$cart()).toEqual([]);
    });
  });

  describe('cartTotal computed property', () => {
    beforeEach(() => {
      service.setProducts(mockProducts);
    });

    it('should return 0 for empty cart', () => {
      expect(service.cartTotal()).toBe(0);
    });

    it('should calculate correct total for single item', () => {
      service.addToCart(mockProducts[0], 2);

      expect(service.cartTotal()).toBe(2000);
    });

    it('should calculate correct total for multiple items', () => {
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 3);
      expect(service.cartTotal()).toBe(2060);
    });

    it('should update when cart changes', () => {
      service.addToCart(mockProducts[0], 1);
      expect(service.cartTotal()).toBe(1000);

      service.addToCart(mockProducts[1], 2);
      expect(service.cartTotal()).toBe(1040);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete workflow', () => {
      service.setProducts(mockProducts);
      expect(service.$products().length).toBe(3);
      service.addToCart(mockProducts[0], 2);
      service.addToCart(mockProducts[1], 1);
      expect(service.getTotalItems()).toBe(3);
      expect(service.cartTotal()).toBe(2020);

      service.updateCartQuantity(mockProducts[0].id, 1);
      expect(service.getTotalItems()).toBe(2);
      expect(service.cartTotal()).toBe(1020);

      service.removeFromCart(mockProducts[1].id);
      expect(service.getTotalItems()).toBe(1);
      expect(service.cartTotal()).toBe(1000);

      service.clearCart();
      expect(service.getTotalItems()).toBe(0);
      expect(service.cartTotal()).toBe(0);
    });
  });
});
