import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartListComponent } from './cart.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStoreService } from '../../shared/store/app-store.service';
import { signal } from '@angular/core';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let mockAppStoreService: jest.Mocked<AppStoreService>;

  beforeEach(async () => {
    mockAppStoreService = {
      $cart: jest.fn(() => signal([])),
      removeFromCart: jest.fn(),
      updateCartQuantity: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartListComponent],
      providers: [{ provide: AppStoreService, useValue: mockAppStoreService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('remove method', () => {
    it('should call store removeFromCart with correct productId', () => {
      const productId = 1;
      component.remove(productId);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(
        productId
      );
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledTimes(1);
    });

    it('should call removeFromCart for different product IDs', () => {
      component.remove(5);
      component.remove(10);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(5);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(10);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledTimes(2);
    });

    it('should handle zero productId', () => {
      component.remove(0);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(0);
    });

    it('should handle negative productId', () => {
      component.remove(-1);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(-1);
    });
  });

  describe('updateQuantity method', () => {
    it('should call store updateCartQuantity with correct parameters', () => {
      const productId = 1;
      const quantity = 3;
      component.updateQuantity(productId, quantity);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        productId,
        quantity
      );
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple quantity updates', () => {
      component.updateQuantity(1, 5);
      component.updateQuantity(2, 3);
      component.updateQuantity(3, 1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(1, 5);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(2, 3);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(3, 1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledTimes(3);
    });

    it('should handle zero quantity', () => {
      component.updateQuantity(1, 0);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(1, 0);
    });

    it('should handle negative quantity', () => {
      component.updateQuantity(1, -5);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        1,
        -5
      );
    });

    it('should handle large numbers', () => {
      const productId = 999999;
      const quantity = 1000;
      component.updateQuantity(productId, quantity);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(
        productId,
        quantity
      );
    });
  });

  describe('remove and updateQuantity together', () => {
    it('should handle both operations in sequence', () => {
      component.updateQuantity(1, 5);
      component.remove(1);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledWith(1, 5);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledWith(1);
    });

    it('should call methods independently', () => {
      component.remove(1);
      component.updateQuantity(2, 3);
      component.remove(3);
      component.updateQuantity(1, 1);
      expect(mockAppStoreService.removeFromCart).toHaveBeenCalledTimes(2);
      expect(mockAppStoreService.updateCartQuantity).toHaveBeenCalledTimes(2);
    });
  });
});
