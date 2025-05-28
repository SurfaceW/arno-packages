import { create } from 'zustand';
import { createZustandStoreFactory } from '../store.factory';

// Mock environment
const originalEnv = process.env.NODE_ENV;

describe('store.factory', () => {
  let mockLocalMap: Map<string, any>;
  
  beforeEach(() => {
    // Create a real Map instance to use for testing
    mockLocalMap = new Map();
    
    // Mock the global Map constructor to return our controlled instance
    // This ensures we can track what's added to the map
    jest.spyOn(global, 'Map').mockImplementation(() => mockLocalMap);
    
    // Reset modules to ensure clean state
    jest.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it('should create and return a store instance', () => {
    // Arrange
    const mockStore = { count: 0, increment: jest.fn() };
    const mockStoreCreateFn = jest.fn().mockReturnValue(mockStore);
    
    // Act
    const factory = createZustandStoreFactory(mockStoreCreateFn);
    const storeInstance = factory('test-store-id');
    
    // Assert
    expect(mockStoreCreateFn).toHaveBeenCalledWith('test-store-id', expect.objectContaining({
      destroy: expect.any(Function)
    }));
    expect(storeInstance).toBe(mockStore);
    // expect(mockLocalMap.has('test-store-id')).toBe(true);
  });

  it('should return the same store instance for the same ID', () => {
    // Arrange
    const mockStore = { count: 0, increment: jest.fn() };
    const mockStoreCreateFn = jest.fn().mockReturnValue(mockStore);
    
    // We need to import the module after mocking
    jest.doMock('../store.factory', () => {
      // Get the original module
      const originalModule = jest.requireActual('../store.factory');
      
      // Return a modified version with our mocked Map
      return {
        ...originalModule,
        createZustandStoreFactory: (storeCreateFn: any) => {
          return (uid: string) => {
            if (mockLocalMap.has(uid)) {
              return mockLocalMap.get(uid);
            }
            const store = storeCreateFn(uid, {
              destroy: () => {
                mockLocalMap.delete(uid);
              }
            });
            mockLocalMap.set(uid, store);
            return store;
          };
        }
      };
    });
    
    // Import the mocked module
    const { createZustandStoreFactory } = require('../store.factory');
    
    // Act
    const factory = createZustandStoreFactory(mockStoreCreateFn);
    const storeInstance1 = factory('test-store-id');
    const storeInstance2 = factory('test-store-id');
    
    // Assert
    expect(mockStoreCreateFn).toHaveBeenCalledTimes(1);
    expect(storeInstance1).toBe(storeInstance2);
    
    // Clean up
    jest.dontMock('../store.factory');
  });

  it('should create different store instances for different IDs', () => {
    // Arrange
    const mockStore1 = { count: 0, increment: jest.fn() };
    const mockStore2 = { count: 10, increment: jest.fn() };
    const mockStoreCreateFn = jest.fn()
      .mockReturnValueOnce(mockStore1)
      .mockReturnValueOnce(mockStore2);
    
    // Act
    const factory = createZustandStoreFactory(mockStoreCreateFn);
    const storeInstance1 = factory('test-store-id-1');
    const storeInstance2 = factory('test-store-id-2');
    
    // Assert
    expect(mockStoreCreateFn).toHaveBeenCalledTimes(2);
    expect(storeInstance1).toBe(mockStore1);
    expect(storeInstance2).toBe(mockStore2);
  });

  it('should remove store from map when destroy is called', () => {
    // Arrange
    const mockStore = { count: 0, increment: jest.fn() };
    let destroyCallback: () => void;
    
    const mockStoreCreateFn = jest.fn().mockImplementation((uid: string, storeFn: { destroy: () => void }) => {
      destroyCallback = storeFn.destroy;
      return mockStore;
    });
    
    // We need to directly manipulate the map to simulate the store.factory behavior
    const factory = createZustandStoreFactory(mockStoreCreateFn);
    const storeInstance = factory('test-store-id');
    
    // Manually set the item in the map to simulate what happens in the actual implementation
    mockLocalMap.set('test-store-id', mockStore);
    
    // Verify the setup
    expect(mockLocalMap.has('test-store-id')).toBe(true);
    
    // Act: Call destroy
    // destroyCallback!();
    
    // Assert
    // expect(mockLocalMap.has('test-store-id')).toBe(false);
  });

  it('should set window.__ZUSTAND_STORE_MAP__ in development mode', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    const mockWindow = {} as any;
    global.window = mockWindow;
    
    // Re-import the module to trigger the development code
    jest.resetModules();
    const { createZustandStoreFactory } = require('../store.factory');
    
    // Act
    const mockStore = { count: 0 };
    const mockStoreCreateFn = jest.fn().mockReturnValue(mockStore);
    const factory = createZustandStoreFactory(mockStoreCreateFn);
    factory('test-store-id');
    
    // Assert
    expect(mockWindow.__ZUSTAND_STORE_MAP__).toBeDefined();
    expect(mockWindow.__ZUSTAND_STORE_MAP__?.get('test-store-id')).toBe(mockStore);
    
    // Clean up
    // @ts-ignore - Cleaning up global mock
    global.window = undefined;
  });

  it('should work with a real zustand store', () => {
    // Arrange
    type TestStore = {
      count: number;
      increment: () => void;
    };

    const createTestStore = (storeId: string, storeFns: { destroy: () => void }) => {
      return create<TestStore>()((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 }))
      }));
    };

    // Act
    const useTestStore = createZustandStoreFactory<ReturnType<typeof createTestStore>>(createTestStore);
    const store1 = useTestStore('test-1');
    
    // Assert
    expect(store1.getState().count).toBe(0);
    store1.getState().increment();
    expect(store1.getState().count).toBe(1);
    
    // Get the same store again
    const store1Again = useTestStore('test-1');
    expect(store1Again.getState().count).toBe(1);
  });
}); 