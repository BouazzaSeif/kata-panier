import { Inject } from '@angular/core';
import { LOCAL_STORAGE_PREFIX } from '../../../environments/environment';

/**
 * Local Storage Manager implementation
 */
export class LocalStorageManager<T> {
  private readonly _storageKey: string;

  constructor(
    @Inject(LOCAL_STORAGE_PREFIX) private localStoragePrefix: string
  ) {
    this._storageKey = localStoragePrefix;
  }

  /**
   * Saves data to local storage
   */
  public save(data: T): void {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Loads data from local storage
   */
  public load(): T | null {
    try {
      const data = localStorage.getItem(this._storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  /**
   * Clears the stored data
   */
  public clear(): void {
    try {
      localStorage.removeItem(this._storageKey);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
