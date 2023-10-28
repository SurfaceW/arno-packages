import { NextResponse } from "next/server";

import { hackStringify } from "@arno/shared";

import {
    failResponse, NextHTTPServiceResult, ServiceResult, successJsonResponse
} from "./service.result";

hackStringify();

describe('ServiceResult', () => {
  beforeAll(() => {
    hackStringify();
  });

  describe('ServiceResult', () => {
    test('should create a success result correctly', () => {
      const expectedData = { foo: 'bar' };
      const expectedMessage = 'success message';
      const result = new ServiceResult(true, expectedMessage, expectedData);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
    });

    test('should create a fail result correctly', () => {
      const expectedData = { baz: 'qux' };
      const expectedMessage = 'fail message';
      const result = new ServiceResult(false, expectedMessage, expectedData);
      expect(result.success).toBe(false);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
    });

    test('should create a success result using static function correctly', () => {
      const expectedData = { foo: 'bar' };
      const expectedMessage = 'success message';
      const result = ServiceResult.success(expectedData, expectedMessage);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
    });

    test('should create a fail result using static function correctly', () => {
      const expectedData = { baz: 'qux' };
      const expectedMessage = 'fail message';
      const result = ServiceResult.fail(expectedMessage, expectedData);
      expect(result.success).toBe(false);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
    });
  });

  describe('NextHTTPServiceResult', () => {
    test('should create a success result correctly', async () => {
      const expectedData = { foo: 'bar' };
      const expectedMessage = 'success message';
      const expectedStatus = {
        responseOptions: {
          status: 200,
        }
      };
      const result = new NextHTTPServiceResult({
        success: true,
        message: expectedMessage,
        data: expectedData
      }, expectedStatus);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
      expect(result.status).toEqual(200);

      const gResponse = await result.response();
      expect(gResponse.status).toEqual(200);
    });

    test('should create a fail result correctly', () => {
      const expectedData = { baz: 'qux' };
      const expectedMessage = 'fail message';
      const expectedStatus = {
        responseOptions: {
          status: 200,
        }
      };
      const result = new NextHTTPServiceResult({
        success: false,
        message: expectedMessage,
        data: expectedData
      }, expectedStatus);
      expect(result.success).toBe(false);
      expect(result.message).toEqual(expectedMessage);
      expect(result.status).toEqual(200);
    });

    test('should create a success result using static function correctly', () => {
      const expectedData = { foo: 'bar' };
      const expectedMessage = 'success message';
      const expectedStatus = {
        responseOptions: {
          status: 200,
        }
      };
      const result = NextHTTPServiceResult.success(expectedData, expectedMessage, expectedStatus);
      expect(result.success).toBe(true);
      expect(result.message).toEqual(expectedMessage);
      expect(result.data).toEqual(expectedData);
      expect(result.status).toEqual(200);
    });

    test('should create a fail result using static function correctly', () => {
      const expectedData = { baz: 'qux' };
      const expectedMessage = 'fail message';
      const expectedStatus = {
        responseOptions: {
          status: 500,
        }
      };
      const result = NextHTTPServiceResult.fail(expectedMessage, expectedData, expectedStatus);
      expect(result.success).toBe(false);
      expect(result.message).toEqual(expectedMessage);
      expect(result.status).toEqual(500);
    });

    test('should create a fail response correctly', async () => {
      const expectedResult = 'fail message';
      const expectedStatus = {
        responseOptions: {
          status: 500,
        }
      };
      const result = new NextHTTPServiceResult({
        success: false,
        data: expectedResult,
        message: 'fail message'
      }, expectedStatus);
      const response = await result.fail();
      expect(response.status).toEqual(500);
      expect(await response.text()).toEqual(expectedResult);

      const gResponse = await result.response();
      expect(gResponse.status).toEqual(500);
      expect(await gResponse.text()).toEqual(expectedResult);
    });

    test('should create a success JSON response correctly', async () => {
      const expectedContent = { foo: 'bar' };
      const result = new NextHTTPServiceResult({
        success: true,
        message: '',
        data: expectedContent
      }, {
        responseOptions: {
          status: 200,
        }
      });
      const response = result.successJson();
      expect(response).toBeInstanceOf(NextResponse);
      expect(await response.json()).toEqual({
        success: true,
        content: expectedContent,
      });
    });

    it('should not access data when response failed', async () => {
      const expectedContent = { foo: 'bar' };
      const result = new NextHTTPServiceResult({
        success: false,
        message: 'false',
        data: expectedContent
      }, {
        responseOptions: {
          status: 400,
        }
      });
      expect(result.message).toBe('false');
    })
  });
});

describe('Response handler functions', () => {
  describe('failResponse', () => {
    test('should create a fail response with message', async () => {
      const expectedMessage = 'fail message';
      const expectedStatus = 500;
      const response = await failResponse(expectedMessage, expectedStatus);
      expect(response.status).toEqual(expectedStatus);
      expect(await response.text()).toEqual(expectedMessage);
    });

    test('should create a fail response with error object', async () => {
      const expectedError = new Error('fail error');
      const expectedMessage = expectedError.toString();
      const expectedStatus = 500;
      const response = await failResponse(expectedError, expectedStatus);
      expect(response.status).toEqual(expectedStatus);
      expect(await response.text()).toEqual("fail error");
    });

    test('should create a fail response with object', async () => {
      const expectedObject = { foo: 'bar', baz: 'qux' };
      const expectedMessage = JSON.stringify(expectedObject);
      const expectedStatus = 500;
      const response = await failResponse(expectedObject, expectedStatus);
      expect(response.status).toEqual(expectedStatus);
      expect(await response.text()).toEqual(expectedMessage);
    });
  });

  describe('successJsonResponse', () => {
    test('should create a success JSON response with content', async () => {
      const expectedContent = { foo: 'bar', baz: 'qux' };
      const expectedResult = {
        success: true,
        content: expectedContent,
      };
      const response = successJsonResponse(expectedContent);
      expect(response).toBeInstanceOf(NextResponse);
      expect(await response.json()).toEqual(expectedResult);
    });

    test('should create a success JSON response with options', async () => {
      const expectedContent = { foo: 'bar', baz: 'qux' };
      const expectedOptions = {
        status: 201,
        headers: { 'X-Custom-Header': 'custom value' },
      };
      const expectedResult = {
        success: true,
        content: expectedContent,
      };
      const response = successJsonResponse(expectedContent, expectedOptions);
      expect(response).toBeInstanceOf(NextResponse);
      expect(await response.json()).toEqual(expectedResult);
      expect(response.status).toEqual(expectedOptions.status);
      expect(response.headers.get('X-Custom-Header')).toEqual(expectedOptions.headers['X-Custom-Header']);
    });
  });
});


describe('ServiceResultResult', () => {
  describe('constructor', () => {
    it('should create a ServiceResult instance with the correct properties', () => {
      const data = { foo: 'bar' };
      const options = { responseOptions: { headers: { 'Content-Type': 'application/json' } } };
      const serviceResult = new ServiceResult(true, 'success', data, options);

      expect(serviceResult.success).toBe(true);
      expect(serviceResult.message).toBe('success');
      expect(serviceResult.data).toBe(data);
      expect(serviceResult.responseOptions).toBe(options.responseOptions);
    });
  });

  describe('success', () => {
    it('should create a ServiceResult instance with success=true', () => {
      const data = { foo: 'bar' };
      const message = 'success';
      const serviceResult = ServiceResult.success(data, message);

      expect(serviceResult.success).toBe(true);
      expect(serviceResult.message).toBe(message);
      expect(serviceResult.data).toBe(data);
    });
  });

  describe('fail', () => {
    it('should create a ServiceResult instance with success=false', () => {
      const data = { foo: 'bar' };
      const message = 'failure';
      const serviceResult = ServiceResult.fail(message, data);

      expect(serviceResult.success).toBe(false);
      expect(serviceResult.message).toBe(message);
      expect(serviceResult.data).toBe(data);
    });
  });

  describe('useAdapter', () => {
    it('should set the adapter property and return the instance', () => {
      const adapter = {
        getData: jest.fn(),
        isSuccess: jest.fn(),
        response: jest.fn(),
      };
      const serviceResult = new ServiceResult(true, 'success', {});

      expect(serviceResult.useAdapter(adapter)).toBe(serviceResult);
      expect(serviceResult['_adapter']).toBe(adapter);
    });
  });

  describe('isSuccess', () => {
    it('should return the success property if no adapter is set', () => {
      const serviceResult = new ServiceResult(true, 'success', {});

      expect(serviceResult.isSuccess()).toBe(true);
    });

    it('should return the result of the adapter.isSuccess method if an adapter is set', () => {
      const adapter = {
        isSuccess: jest.fn().mockReturnValue(true),
      };
      // @ts-ignore
      const serviceResult = new ServiceResult(true, 'success', {}).useAdapter(adapter);

      expect(serviceResult.isSuccess()).toBe(true);
      expect(adapter.isSuccess).toHaveBeenCalledWith(serviceResult);
    });
  });

  describe('response', () => {
    it('should return the data property if no adapter is set', async () => {
      const data = { foo: 'bar' };
      const serviceResult = new ServiceResult(true, 'success', data);
      const response = await serviceResult.response();

      expect(response).toBe(data);
    });

    it('should return the result of the adapter.response method if an adapter is set', async () => {
      const adapter = {
        response: jest.fn().mockResolvedValue({}),
      };
      // @ts-ignore
      const serviceResult = new ServiceResult(true, 'success', {}).useAdapter(adapter);
      const response = await serviceResult.response();

      expect(response).toEqual({});
      expect(adapter.response).toHaveBeenCalledWith(serviceResult);
    });
  });
});


