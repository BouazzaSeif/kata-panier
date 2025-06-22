import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartCardComponent } from './cart-card.component';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../../shared/models';
import { Category } from '../../../shared/enums/product-category.enum';

describe('CartCardComponent', () => {
  let component: CartCardComponent;
  let fixture: ComponentFixture<CartCardComponent>;

  const mockProduct: Product = {
    id: 1,
    productName: 'Test Product',
    price: 10,
    quantity: 2,
    category: Category.Books,
    isImported: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecimalPipe, CartCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default productAvailableQuantity of 1', () => {
    expect(component.productAvailableQuantity()).toBe(1);
  });

  it('should set productInCart input', () => {
    fixture.componentRef.setInput('productInCart', mockProduct);
    fixture.detectChanges();
    expect(component.productInCart()).toEqual(mockProduct);
  });

  it('should emit removeFromCart event when remove is called with valid id', () => {
    const spy = jest.spyOn(component.removeFromCart, 'emit');
    component.remove(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not emit removeFromCart event when remove is called with undefined id', () => {
    const spy = jest.spyOn(component.removeFromCart, 'emit');
    component.remove(undefined);
    expect(spy).not.toHaveBeenCalled();
  });
});
