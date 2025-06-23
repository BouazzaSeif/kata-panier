import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCAL_STORAGE_PREFIX } from '../environments/environment';
import { LocalStorageManager } from './core/services/local-storage.manager';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const mockRouter = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: jest.fn(),
            },
            queryParams: {
              subscribe: jest.fn(),
            },
            data: {
              subscribe: jest.fn(),
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        // Provide the storage prefix
        { provide: LOCAL_STORAGE_PREFIX, useValue: 'test-app-' },

        // Use the same factory pattern as in your app
        {
          provide: LocalStorageManager,
          useFactory: (prefix: string) =>
            new LocalStorageManager<any[]>(prefix),
          deps: [LOCAL_STORAGE_PREFIX],
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title kata-panier', () => {
    expect(component.title).toBe('kata-panier');
  });
});
