import { InjectionToken } from '@angular/core';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};

export const LOCAL_STORAGE_PREFIX = new InjectionToken<any>(
  'LocalStoragePrefix'
);
