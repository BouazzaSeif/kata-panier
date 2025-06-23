import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartCounterComponent } from './cart-counter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStoreService } from '../../store/app-store.service';

describe('CartCounterComponent', () => {
  let component: CartCounterComponent;
  let fixture: ComponentFixture<CartCounterComponent>;
  let mockAppStoreService: jest.Mocked<AppStoreService>;

  beforeEach(async () => {
    mockAppStoreService = {
      getTotalItems: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CartCounterComponent],
      providers: [{ provide: AppStoreService, useValue: mockAppStoreService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCounterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have store service injected', () => {
    expect(component['_store']).toBeDefined();
    expect(component['_store']).toBe(mockAppStoreService);
  });

  it('should call getTotalItems from store when countCartItems is accessed', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(5);
    const result = component.countCartItems();
    expect(mockAppStoreService.getTotalItems).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('should return 0 when cart is empty', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(0);
    const result = component.countCartItems();
    expect(result).toBe(0);
  });

  it('should return correct count for multiple items', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(10);
    const result = component.countCartItems();
    expect(result).toBe(10);
  });

  it('should handle large item counts', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(999);
    const result = component.countCartItems();
    expect(result).toBe(999);
  });

  it('should call getTotalItems each time countCartItems is accessed', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(3);
    component.countCartItems();
    expect(mockAppStoreService.getTotalItems).toHaveBeenCalledTimes(1);
  });

  it('should render the count in template', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(7);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.cart-counter').textContent).toContain('7');
  });

  it('should update template when count changes', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(2);
    fixture.detectChanges();
    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('.cart-counter').textContent).toContain('2');
    mockAppStoreService.getTotalItems.mockReturnValue(8);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    expect(compiled.querySelector('.cart-counter').textContent).toContain('2');
  });

  it('should display 0 in template when cart is empty', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(0);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.cart-counter').textContent).toContain('0');
  });

  it('should have correct CSS class in template', () => {
    mockAppStoreService.getTotalItems.mockReturnValue(1);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const counterElement = compiled.querySelector('.cart-counter');
    expect(counterElement).toBeTruthy();
    expect(counterElement.classList.contains('cart-counter')).toBe(true);
  });
});
