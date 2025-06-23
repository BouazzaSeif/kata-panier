import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from './app-header.component';
import { LOCAL_STORAGE_PREFIX } from '../../../../environments/environment';
import { LocalStorageManager } from '../../../core/services/local-storage.manager';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        { provide: Router },
        { provide: ActivatedRoute, useValue: {} },
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
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
