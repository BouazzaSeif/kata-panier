import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsApiService } from '../../core/services/products-api.service';
import { AppStoreService } from '../../shared/store/app-store.service';
import { ProductsListComponent } from './products-list.component';

import { Category } from '../../shared/enums/product-category.enum';
import { Product } from './models';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let mockAppStoreService: jest.Mocked<AppStoreService>;
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
    {
      id: 4,
      productName: 'Bleu de chanel',
      price: 50,
      quantity: 8,
      isImported: true,
      category: Category.Parfum,
    },
  ];

  beforeEach(async () => {
    mockAppStoreService = {
      $products: jest.fn(() => mockProducts),
      setProducts: jest.fn(),
    } as any;

    mockProductsApiService = {
      productsResource: {
        value: jest.fn(() => mockProducts),
      },
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [
        { provide: AppStoreService, useValue: mockAppStoreService },
        { provide: ProductsApiService, useValue: mockProductsApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filterByCategory method', () => {
    it('should update selectedCategory when called with valid category', () => {
      const category = 'Electric';

      component.filterByCategory(category);

      expect(component.selectedCategory()).toBe(category);
    });

    it('should update selectedCategory to All', () => {
      component.filterByCategory('All');

      expect(component.selectedCategory()).toBe('All');
    });

    it('should handle multiple category changes', () => {
      component.filterByCategory('Books');
      expect(component.selectedCategory()).toBe('Books');
      component.filterByCategory('CLOTHING');
      expect(component.selectedCategory()).toBe('CLOTHING');

      component.filterByCategory('All');
      expect(component.selectedCategory()).toBe('All');
    });

    it('should handle empty string category', () => {
      component.filterByCategory('');
      expect(component.selectedCategory()).toBe('');
    });

    it('should handle non-existent category', () => {
      const nonExistentCategory = 'NON_EXISTENT';

      component.filterByCategory(nonExistentCategory);

      expect(component.selectedCategory()).toBe(nonExistentCategory);
    });
  });

  describe('isActiveCategory method', () => {
    it('should return true when category matches selectedCategory', () => {
      component.filterByCategory('Electric');

      const result = component.isActiveCategory('Electric');

      expect(result).toBe(true);
    });

    it('should return false when category does not match selectedCategory', () => {
      component.filterByCategory('Electric');

      const result = component.isActiveCategory('Books');

      expect(result).toBe(false);
    });

    it('should return true for All when selectedCategory is All', () => {
      component.filterByCategory('All');

      const result = component.isActiveCategory('All');

      expect(result).toBe(true);
    });

    it('should return false for All when selectedCategory is not All', () => {
      component.filterByCategory('Electric');

      const result = component.isActiveCategory('All');

      expect(result).toBe(false);
    });

    it('should handle case sensitivity', () => {
      component.filterByCategory('Electric');

      const resultExact = component.isActiveCategory('Electric');
      const resultDifferentCase = component.isActiveCategory('Electric');

      expect(resultExact).toBe(true);
      expect(resultDifferentCase).toBe(true);
    });

    it('should handle empty string comparison', () => {
      component.filterByCategory('');

      const result = component.isActiveCategory('');

      expect(result).toBe(true);
    });

    it('should return false for null or undefined category', () => {
      component.filterByCategory('Electric');

      const resultNull = component.isActiveCategory(null as any);
      const resultUndefined = component.isActiveCategory(undefined as any);

      expect(resultNull).toBe(false);
      expect(resultUndefined).toBe(false);
    });
  });

  describe('Both methods together', () => {
    it('should work together for category filtering workflow', () => {
      expect(component.isActiveCategory('All')).toBe(true);

      component.filterByCategory('Electric');
      expect(component.isActiveCategory('Electric')).toBe(true);
      expect(component.isActiveCategory('All')).toBe(false);
      expect(component.isActiveCategory('Books')).toBe(false);

      component.filterByCategory('Books');
      expect(component.isActiveCategory('Books')).toBe(true);
      expect(component.isActiveCategory('Electric')).toBe(false);

      component.filterByCategory('All');
      expect(component.isActiveCategory('All')).toBe(true);
      expect(component.isActiveCategory('Books')).toBe(false);
    });

    it('should handle rapid category changes', () => {
      const categories = ['Electric', 'Books', 'CLOTHING', 'All'];

      categories.forEach((category) => {
        component.filterByCategory(category);
        expect(component.isActiveCategory(category)).toBe(true);

        categories
          .filter((c) => c !== category)
          .forEach((otherCategory) => {
            expect(component.isActiveCategory(otherCategory)).toBe(false);
          });
      });
    });

    it('should maintain state consistency', () => {
      component.filterByCategory('Electric');

      expect(component.isActiveCategory('Electric')).toBe(true);
      expect(component.isActiveCategory('Electric')).toBe(true);
      expect(component.isActiveCategory('Electric')).toBe(true);

      expect(component.isActiveCategory('Books')).toBe(false);
      expect(component.isActiveCategory('All')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in category names', () => {
      const specialCategory = 'SPECIAL@#$%';

      component.filterByCategory(specialCategory);

      expect(component.selectedCategory()).toBe(specialCategory);
      expect(component.isActiveCategory(specialCategory)).toBe(true);
    });

    it('should handle very long category names', () => {
      const longCategory = 'A'.repeat(1000);

      component.filterByCategory(longCategory);

      expect(component.selectedCategory()).toBe(longCategory);
      expect(component.isActiveCategory(longCategory)).toBe(true);
    });

    it('should handle numeric category names', () => {
      const numericCategory = '12345';

      component.filterByCategory(numericCategory);

      expect(component.selectedCategory()).toBe(numericCategory);
      expect(component.isActiveCategory(numericCategory)).toBe(true);
    });

    it('should handle whitespace in category names', () => {
      const whitespaceCategory = '  Electric  ';

      component.filterByCategory(whitespaceCategory);

      expect(component.selectedCategory()).toBe(whitespaceCategory);
      expect(component.isActiveCategory(whitespaceCategory)).toBe(true);
      expect(component.isActiveCategory('Electric')).toBe(false);
    });
  });

  describe('Component initialization', () => {
    it('should have default selectedCategory as All', () => {
      expect(component.selectedCategory()).toBe('All');
      expect(component.isActiveCategory('All')).toBe(true);
    });

    it('should have store service injected', () => {
      expect(component['_store']).toBeDefined();
      expect(component['_store']).toBe(mockAppStoreService);
    });

    it('should have products api service injected', () => {
      expect(component['_productsApiService']).toBeDefined();
      expect(component['_productsApiService']).toBe(mockProductsApiService);
    });
  });
  describe('filteredProducts computed', () => {
    it('should return all products when selectedCategory is All', () => {
      component.filterByCategory('All');
      expect(component.filteredProducts()).toEqual(mockProducts);
    });

    it('should return filtered products when selectedCategory is Electric', () => {
      component.filterByCategory('Electric');

      const expectedProducts = mockProducts.filter(
        (p) => p.category === 'Electric'
      );
      expect(component.filteredProducts()).toEqual(expectedProducts);
    });

    it('should return empty array when no products match selected category', () => {
      component.filterByCategory('NonExistentCategory');

      expect(component.filteredProducts()).toEqual([]);
    });

    it('should update filtered products when category changes', () => {
      component.filterByCategory('Electric');
      expect(component.filteredProducts().length).toBe(2);

      component.filterByCategory('Books');
      expect(component.filteredProducts().length).toBe(1);

      component.filterByCategory('All');
      expect(component.filteredProducts().length).toBe(4);
    });

    it('should preserve original products array when filtering', () => {
      const originalProducts = [...mockProducts];

      component.filterByCategory('Electric');
      component.filterByCategory('Books');
      component.filterByCategory('All');

      expect(component.products()).toEqual(originalProducts);
    });
  });
});
