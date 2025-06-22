/**
 * Unit tests for the ProductCardComponent, covering UI rendering and user interactions.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStoreService } from '../../../shared/store/app-store.service';
import { TaxUtils } from '../../../shared/utils/tax-utils';
import { Product } from '../../../shared/models';

jest.mock('../../../shared/utils/tax-utils');

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockAppStoreService: jest.Mocked<AppStoreService>;
  let mockTaxUtils: jest.Mocked<typeof TaxUtils>;

  const mockProduct: Product = {
    id: 1,
    productName: 'Test Product',
    price: 100,
    quantity: 10,
    isImported: false,
    category: 'Books' as any,
  };

  beforeEach(async () => {
    mockTaxUtils = TaxUtils as jest.Mocked<typeof TaxUtils>;
    mockTaxUtils.calculateProductTaxPercentage = jest.fn();
    mockTaxUtils.calculateProductTaxAmount = jest.fn();
    mockTaxUtils.calculateProductPriceTTC = jest.fn();

    mockAppStoreService = {
      addToCart: jest.fn(),
      updateCartQuantity: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [{ provide: AppStoreService, useValue: mockAppStoreService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    // Set product input using fixture.componentRef.setInput() for signal inputs
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with quantity 1', () => {
    expect(component.quantity).toBe(1);
  });

  describe('isAvailable getter', () => {
    it('should return true when product quantity is greater than 0', () => {
      const productWithQuantity = { ...mockProduct, quantity: 5 };
      fixture.componentRef.setInput('product', productWithQuantity);
      fixture.detectChanges();

      expect(component.isAvailable).toBe(true);
    });

    it('should return false when product quantity is 0', () => {
      const productWithZeroQuantity = { ...mockProduct, quantity: 0 };
      fixture.componentRef.setInput('product', productWithZeroQuantity);
      fixture.detectChanges();

      expect(component.isAvailable).toBe(false);
    });

    it('should return false when product quantity is negative', () => {
      const productWithNegativeQuantity = { ...mockProduct, quantity: -1 };
      fixture.componentRef.setInput('product', productWithNegativeQuantity);
      fixture.detectChanges();

      expect(component.isAvailable).toBe(false);
    });
  });

  describe('taxes getter', () => {
    it('should call TaxUtils.calculateProductTaxPercentage with product', () => {
      const mockTaxPercentage = 10;
      mockTaxUtils.calculateProductTaxPercentage.mockReturnValue(
        mockTaxPercentage
      );

      const result = component.taxes;

      expect(TaxUtils.calculateProductTaxPercentage).toHaveBeenCalledWith(
        mockProduct
      );
      expect(result).toBe(mockTaxPercentage);
    });

    it('should return 0 for tax-free product', () => {
      mockTaxUtils.calculateProductTaxPercentage.mockReturnValue(0);

      const result = component.taxes;

      expect(result).toBe(0);
    });
  });

  describe('taxAmount getter', () => {
    it('should call TaxUtils.calculateProductTaxAmount with product', () => {
      const mockTaxAmount = 15.5;
      mockTaxUtils.calculateProductTaxAmount.mockReturnValue(mockTaxAmount);

      const result = component.taxAmount;

      expect(TaxUtils.calculateProductTaxAmount).toHaveBeenCalledWith(
        mockProduct
      );
      expect(result).toBe(mockTaxAmount);
    });

    it('should return correct tax amount for imported product', () => {
      const importedProduct = { ...mockProduct, isImported: true };
      fixture.componentRef.setInput('product', importedProduct);
      fixture.detectChanges();

      mockTaxUtils.calculateProductTaxAmount.mockReturnValue(25.75);

      const result = component.taxAmount;

      expect(TaxUtils.calculateProductTaxAmount).toHaveBeenCalledWith(
        importedProduct
      );
      expect(result).toBe(25.75);
    });
  });

  describe('priceTTC getter', () => {
    it('should call TaxUtils.calculateProductPriceTTC with product', () => {
      const mockPriceTTC = 115.5;
      mockTaxUtils.calculateProductPriceTTC.mockReturnValue(mockPriceTTC);

      const result = component.priceTTC;

      expect(TaxUtils.calculateProductPriceTTC).toHaveBeenCalledWith(
        mockProduct
      );
      expect(result).toBe(mockPriceTTC);
    });

    it('should return price including taxes', () => {
      mockTaxUtils.calculateProductPriceTTC.mockReturnValue(110);

      const result = component.priceTTC;

      expect(result).toBe(110);
    });
  });

  describe('addToCart method', () => {
    beforeEach(() => {
      const productWithQuantity = { ...mockProduct, quantity: 10 };
      fixture.componentRef.setInput('product', productWithQuantity);
      component.quantity = 2;
      fixture.detectChanges();
    });

    it('should call store addToCart when product is available and quantity is valid', () => {
      component.addToCart();

      expect(mockAppStoreService.addToCart).toHaveBeenCalledWith(
        { ...mockProduct, quantity: 10 },
        2
      );
      expect(mockAppStoreService.addToCart).toHaveBeenCalledTimes(1);
    });

    it('should not call addToCart when product is not available', () => {
      const unavailableProduct = { ...mockProduct, quantity: 0 };
      fixture.componentRef.setInput('product', unavailableProduct);
      fixture.detectChanges();

      component.addToCart();

      expect(mockAppStoreService.addToCart).not.toHaveBeenCalled();
    });

    it('should not call addToCart when quantity is 0', () => {
      component.quantity = 0;

      component.addToCart();

      expect(mockAppStoreService.addToCart).not.toHaveBeenCalled();
    });

    it('should not call addToCart when quantity is negative', () => {
      component.quantity = -1;

      component.addToCart();

      expect(mockAppStoreService.addToCart).not.toHaveBeenCalled();
    });

    it('should not call addToCart when quantity exceeds product quantity', () => {
      component.quantity = 15;

      component.addToCart();

      expect(mockAppStoreService.addToCart).not.toHaveBeenCalled();
    });

    it('should call addToCart when quantity equals product quantity', () => {
      component.quantity = 10;
      component.addToCart();

      expect(mockAppStoreService.addToCart).toHaveBeenCalledWith(
        { ...mockProduct, quantity: 10 },
        10
      );
    });
  });

  describe('updateQuantity method', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('product', mockProduct);
      fixture.detectChanges();
    });

    it('should set quantity to 1 when quantity is less than 1', () => {
      component.quantity = 0;

      component.updateQuantity();

      expect(component.quantity).toBe(1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        1
      );
    });

    it('should set quantity to product quantity when quantity exceeds product quantity', () => {
      const productWithQuantity = { ...mockProduct, quantity: 10 };
      fixture.componentRef.setInput('product', productWithQuantity);
      fixture.detectChanges();

      component.quantity = 15;

      component.updateQuantity();

      expect(component.quantity).toBe(10);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        10
      );
    });

    it('should keep quantity unchanged when it is valid', () => {
      const productWithQuantity = { ...mockProduct, quantity: 10 };
      fixture.componentRef.setInput('product', productWithQuantity);
      fixture.detectChanges();

      component.quantity = 5;

      component.updateQuantity();

      expect(component.quantity).toBe(5);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        5
      );
    });

    it('should call store updateCartQuantity with correct parameters', () => {
      component.quantity = 3;

      component.updateQuantity();

      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        3
      );
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledTimes(1);
    });

    it('should handle edge case when quantity is exactly 1', () => {
      component.quantity = 1;

      component.updateQuantity();

      expect(component.quantity).toBe(1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        1
      );
    });

    it('should handle negative quantity', () => {
      component.quantity = -5;

      component.updateQuantity();

      expect(component.quantity).toBe(1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        mockProduct.id,
        1
      );
    });
  });

  describe('Integration tests', () => {
    it('should work with all getters', () => {
      mockTaxUtils.calculateProductTaxPercentage.mockReturnValue(10);
      mockTaxUtils.calculateProductTaxAmount.mockReturnValue(10);
      mockTaxUtils.calculateProductPriceTTC.mockReturnValue(110);

      const taxes = component.taxes;
      const taxAmount = component.taxAmount;
      const priceTTC = component.priceTTC;
      const available = component.isAvailable;

      expect(taxes).toBe(10);
      expect(taxAmount).toBe(10);
      expect(priceTTC).toBe(110);
      expect(available).toBe(true);
    });
  });
});
