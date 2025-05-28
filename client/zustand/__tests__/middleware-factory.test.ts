import { create } from 'zustand';
import { composedMiddlewares, composedPersistMiddlewares, type StateCreatorFnType } from '../middleware-factory';

// Mock the zustand middleware imports
jest.mock('zustand/middleware/immer', () => ({
  immer: jest.fn((fn: any) => fn),
}));

jest.mock('zustand/middleware', () => ({
  devtools: jest.fn((fn: any) => fn),
  persist: jest.fn((fn: any, options: any) => fn),
}));

jest.mock('../log.middle-ware', () => ({
  zustandLogger: jest.fn((fn: any, name: string) => fn),
}));

describe('middleware-factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('composedMiddlewares', () => {
    it('should compose middlewares correctly', () => {
      // Arrange
      type TestState = {
        count: number;
        increment: () => void;
      };
      
      const mockStateCreator: StateCreatorFnType<TestState> = (set, get) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      });
      const storeName = 'testStore';
      
      // Act
      const composedCreator = composedMiddlewares(mockStateCreator, storeName);
      const store = create(composedCreator);
      
      // Assert
      const { devtools } = require('zustand/middleware');
      const { immer } = require('zustand/middleware/immer');
      const { zustandLogger } = require('../log.middle-ware');
      
      expect(immer).toHaveBeenCalled();
      expect(zustandLogger).toHaveBeenCalledWith(expect.any(Function), storeName);
      expect(devtools).toHaveBeenCalled();
      
      // Verify store functionality
      const state = store.getState() as TestState;
      expect(state.count).toBe(0);
      state.increment();
      expect((store.getState() as TestState).count).toBe(1);
    });
  });

  describe('composedPersistMiddlewares', () => {
    it('should compose persist middlewares correctly', () => {
      // Arrange
      type TestState = {
        count: number;
        increment: () => void;
      };
      
      const mockStateCreator: StateCreatorFnType<TestState> = (set, get) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      });
      const storeName = 'testPersistStore';
      
      // Act
      const composedCreator = composedPersistMiddlewares(mockStateCreator, storeName);
      const store = create(composedCreator);
      
      // Assert
      const { devtools, persist } = require('zustand/middleware');
      const { immer } = require('zustand/middleware/immer');
      const { zustandLogger } = require('../log.middle-ware');
      
      expect(immer).toHaveBeenCalled();
      expect(zustandLogger).toHaveBeenCalledWith(expect.any(Function), storeName);
      expect(persist).toHaveBeenCalledWith(expect.any(Function), { name: storeName });
      expect(devtools).toHaveBeenCalled();
      
      // Verify store functionality
      const state = store.getState() as TestState;
      expect(state.count).toBe(0);
      state.increment();
      expect((store.getState() as TestState).count).toBe(1);
    });
  });
}); 