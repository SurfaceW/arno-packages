import { composeServerActions, ServerActionResult } from './compose-server-actions';

/**
 * Unit tests for the composeServerActions function
 * 
 * Note: These tests reveal some implementation details:
 * 1. The function executes middleware functions in sequence
 * 2. If a middleware returns a result with success=false, the chain stops and that result is returned
 * 3. If a middleware returns undefined, the chain continues
 * 4. If all middleware functions succeed, the last successful result is returned
 * 5. If a middleware throws an error, the chain stops and a standardized error response is returned
 * 6. The context is shared between all middleware functions
 */

describe('composeServerActions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful response', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    const mockResult = { success: true, data: { id: 1, name: 'test' } };

    // Define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValue(mockResult);

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn1]);
    const result = await handler(mockData);

    // Assert final response
    expect(result).toBe(mockResult);

    // Assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockData, expect.any(Map));
  });

  it('should handle multiple functions and return the last successful result', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    const mockResult1 = { success: true, data: { step: 1 } };
    const mockResult2 = { success: true, data: { step: 2 } };

    // Define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValue(mockResult1);
    const mockFn2 = jest.fn().mockResolvedValue(mockResult2);

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn1, mockFn2]);
    const result = await handler(mockData);

    // Assert final response is the last successful result
    expect(result).toBe(mockResult2);

    // Assert both functions were called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockData, expect.any(Map));
    expect(mockFn2).toHaveBeenCalledWith(mockData, expect.any(Map));
  });

  it('should break the chain when a function returns unsuccessful result', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    const mockErrorResult = { success: false, status: 'error', message: 'Test error' };
    const mockSuccessResult = { success: true, data: { id: 1 } };

    // Define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValue(mockErrorResult);
    const mockFn2 = jest.fn().mockResolvedValue(mockSuccessResult);

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn1, mockFn2]);
    const result = await handler(mockData);

    // Assert final response is the error result
    expect(result).toBe(mockErrorResult);

    // Assert mockFn1 was called and mockFn2 was not
    expect(mockFn1).toHaveBeenCalledWith(mockData, expect.any(Map));
    expect(mockFn2).not.toHaveBeenCalled();
  });

  it('should handle functions that return undefined', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    const mockResult = { success: true, data: { id: 1 } };

    // Define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValue(undefined);
    const mockFn2 = jest.fn().mockResolvedValue(mockResult);

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn1, mockFn2]);
    const result = await handler(mockData);

    // Assert final response is the successful result
    expect(result).toBe(mockResult);

    // Assert both functions were called
    expect(mockFn1).toHaveBeenCalledWith(mockData, expect.any(Map));
    expect(mockFn2).toHaveBeenCalledWith(mockData, expect.any(Map));
  });

  it('should handle errors thrown by composed functions', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    const mockError = new Error('Test error');

    // Define mock function to compose
    const mockFn = jest.fn().mockRejectedValue(mockError);

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn]);
    const result = await handler(mockData);

    // Assert error response structure
    expect(result).toEqual({
      success: false,
      status: 'error',
      message: 'Test error',
    });

    // Assert mockFn was called
    expect(mockFn).toHaveBeenCalledWith(mockData, expect.any(Map));
  });

  it('should share context between functions', async () => {
    // Define mock data
    const mockData = { name: 'test' };
    
    // Define mock functions that use the shared context
    const mockFn1 = jest.fn().mockImplementation((data, ctx) => {
      ctx.set('testKey', 'testValue');
      return Promise.resolve({ success: true, data: { step: 1 } });
    });
    
    const mockFn2 = jest.fn().mockImplementation((data, ctx) => {
      const contextValue = ctx.get('testKey');
      return Promise.resolve({ 
        success: true, 
        data: { step: 2, contextValue } 
      });
    });

    // Call the composeServerActions function
    const handler = composeServerActions([mockFn1, mockFn2]);
    const result = await handler(mockData);

    // Assert final response contains the context value
    expect(result).toEqual({
      success: true,
      data: { step: 2, contextValue: 'testValue' }
    });

    // Assert both functions were called
    expect(mockFn1).toHaveBeenCalledWith(mockData, expect.any(Map));
    expect(mockFn2).toHaveBeenCalledWith(mockData, expect.any(Map));
  });
}); 