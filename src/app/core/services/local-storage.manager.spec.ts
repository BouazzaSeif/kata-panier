import { LocalStorageManager } from './local-storage.manager';
describe('LocalStorageManager', () => {
  let localStorageManager: LocalStorageManager<any>;
  const testPrefix = 'test_';
  const testData = { id: 1, name: 'test' };

  beforeEach(() => {
    localStorage.clear();
    localStorageManager = new LocalStorageManager(testPrefix);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save data to localStorage', () => {
    localStorageManager.save(testData);

    const savedData = localStorage.getItem(testPrefix);
    expect(savedData).toBe(JSON.stringify(testData));
  });

  it('should load data from localStorage', () => {
    localStorage.setItem(testPrefix, JSON.stringify(testData));

    const loadedData = localStorageManager.load();
    expect(loadedData).toEqual(testData);
  });

  it('should return null when loading non-existent data', () => {
    const loadedData = localStorageManager.load();
    expect(loadedData).toBeNull();
  });

  it('should clear data from localStorage', () => {
    localStorage.setItem(testPrefix, JSON.stringify(testData));

    localStorageManager.clear();

    const clearedData = localStorage.getItem(testPrefix);
    expect(clearedData).toBeNull();
  });

  it('should handle JSON parse errors when loading', () => {
    localStorage.setItem(testPrefix, 'invalid json');
    jest.spyOn(console, 'error').mockImplementation();
    const loadedData = localStorageManager.load();
    expect(loadedData).toBeNull();
  });
});
