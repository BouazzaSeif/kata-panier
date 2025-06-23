import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSummaryComponent } from './cart-summary.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStoreService } from '../../../../shared/store/app-store.service';
import { TaxUtils } from '../../../../shared/utils/tax-utils';
import { CartItem } from '../../models/cart-item.model';

describe('CartSummaryComponent', () => {
  let component: CartSummaryComponent;
  let fixture: ComponentFixture<CartSummaryComponent>;
  let mockAppStoreService: jest.Mocked<AppStoreService>;
  let mockTaxUtils: jest.Mocked<typeof TaxUtils>;

  const mockCartItems: CartItem[] = [
    {
      product: {
        id: 1,
        productName: 'Product 1',
        price: 100,
        quantity: 10,
        isImported: false,
        category: 'ELECTRONICS' as any,
      },
      quantity: 2,
    },
    {
      product: {
        id: 2,
        productName: 'Product 2',
        price: 50,
        quantity: 5,
        isImported: true,
        category: 'BOOKS' as any,
      },
      quantity: 1,
    },
  ];

  beforeEach(async () => {
    mockTaxUtils = TaxUtils as jest.Mocked<typeof TaxUtils>;
    mockTaxUtils.getTotalTaxes = jest.fn();
    mockTaxUtils.getTotalTTC = jest.fn();

    mockAppStoreService = {
      $cart: jest.fn(() => []),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartSummaryComponent],
      providers: [{ provide: AppStoreService, useValue: mockAppStoreService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTotalTaxes method', () => {
    it('should call TaxUtils.getTotalTaxes with correct cart parameter', () => {
      const mockTaxAmount = 25.5;
      mockTaxUtils.getTotalTaxes.mockReturnValue(mockTaxAmount);

      const result = component.getTotalTaxes(mockCartItems);

      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledWith(mockCartItems);
      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockTaxAmount);
    });

    it('should handle empty cart', () => {
      const emptyCart: CartItem[] = [];
      const mockTaxAmount = 0;
      mockTaxUtils.getTotalTaxes.mockReturnValue(mockTaxAmount);

      const result = component.getTotalTaxes(emptyCart);

      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledWith(emptyCart);
      expect(result).toBe(0);
    });

    it('should return correct tax amount for single item', () => {
      const singleItemCart = [mockCartItems[0]];
      const mockTaxAmount = 12.25;
      mockTaxUtils.getTotalTaxes.mockReturnValue(mockTaxAmount);

      const result = component.getTotalTaxes(singleItemCart);

      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledWith(singleItemCart);
      expect(result).toBe(mockTaxAmount);
    });

    it('should handle multiple items with different tax rates', () => {
      const mockTaxAmount = 35.75;
      mockTaxUtils.getTotalTaxes.mockReturnValue(mockTaxAmount);

      const result = component.getTotalTaxes(mockCartItems);

      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledWith(mockCartItems);
      expect(result).toBe(mockTaxAmount);
    });
  });

  describe('getTotalTTC method', () => {
    it('should call TaxUtils.getTotalTTC with correct cart parameter', () => {
      const mockTotalTTC = 275.5;
      mockTaxUtils.getTotalTTC.mockReturnValue(mockTotalTTC);

      const result = component.getTotalTTC(mockCartItems);

      expect(TaxUtils.getTotalTTC).toHaveBeenCalledWith(mockCartItems);
      expect(TaxUtils.getTotalTTC).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockTotalTTC);
    });

    it('should handle empty cart', () => {
      const emptyCart: CartItem[] = [];
      const mockTotalTTC = 0;
      mockTaxUtils.getTotalTTC.mockReturnValue(mockTotalTTC);

      const result = component.getTotalTTC(emptyCart);

      expect(TaxUtils.getTotalTTC).toHaveBeenCalledWith(emptyCart);
      expect(result).toBe(0);
    });

    it('should return correct total for single item', () => {
      const singleItemCart = [mockCartItems[1]];
      const mockTotalTTC = 57.5;
      mockTaxUtils.getTotalTTC.mockReturnValue(mockTotalTTC);

      const result = component.getTotalTTC(singleItemCart);

      expect(TaxUtils.getTotalTTC).toHaveBeenCalledWith(singleItemCart);
      expect(result).toBe(mockTotalTTC);
    });

    it('should return correct total for multiple items', () => {
      const mockTotalTTC = 285.75;
      mockTaxUtils.getTotalTTC.mockReturnValue(mockTotalTTC);

      const result = component.getTotalTTC(mockCartItems);

      expect(TaxUtils.getTotalTTC).toHaveBeenCalledWith(mockCartItems);
      expect(result).toBe(mockTotalTTC);
    });
  });

  describe('Both methods together', () => {
    it('should calculate both taxes and total correctly', () => {
      const mockTaxes = 25.5;
      const mockTotal = 275.5;

      mockTaxUtils.getTotalTaxes.mockReturnValue(mockTaxes);
      mockTaxUtils.getTotalTTC.mockReturnValue(mockTotal);

      const taxes = component.getTotalTaxes(mockCartItems);
      const total = component.getTotalTTC(mockCartItems);

      expect(taxes).toBe(mockTaxes);
      expect(total).toBe(mockTotal);
      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledWith(mockCartItems);
      expect(TaxUtils.getTotalTTC).toHaveBeenCalledWith(mockCartItems);
    });

    it('should work independently', () => {
      mockTaxUtils.getTotalTaxes.mockReturnValue(10);
      mockTaxUtils.getTotalTTC.mockReturnValue(110);

      const taxes = component.getTotalTaxes(mockCartItems);
      expect(taxes).toBe(10);
      expect(TaxUtils.getTotalTaxes).toHaveBeenCalledTimes(1);
      const total = component.getTotalTTC(mockCartItems);
      expect(total).toBe(110);
      expect(TaxUtils.getTotalTTC).toHaveBeenCalledTimes(1);
    });
  });
});
