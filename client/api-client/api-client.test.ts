import { stringifyObjectSafe } from '@arno/shared';
import { api } from './api-client';

describe('api', () => {
  describe('get', () => {
    const requestUrl = 'https://example.com';
    const searchParams = new URLSearchParams({ param1: 'value1', param2: 'value2' });

    it('should return successful response', async () => {
      const expectedResponse = { success: true, content: { data: 'test data' } };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(expectedResponse),
      } as Response);
      global.fetch = mockFetch;

      const result = await api.get(requestUrl, searchParams);

      expect(mockFetch).toHaveBeenCalledWith(`${requestUrl}?${searchParams.toString()}`, {});
      expect(result).toEqual(expectedResponse.content);
    });

    it('should return rejected promise for unsuccessful response', async () => {
      const expectedError = 'Response Error:[500][error status text]:Error message';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'error status text',
        status: 500,
        text: () => Promise.resolve('Error message'),
      } as Response);
      global.fetch = mockFetch;

      await expect(api.get(requestUrl, searchParams)).rejects.toEqual(expectedError);
    });
  });

  describe('post', () => {
    const requestUrl = 'https://example.com';
    const requestBody = { data: 'test data' };

    it('should return successful response', async () => {
      const expectedResponse = { success: true, content: { data: 'test data' } };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(expectedResponse),
      } as Response);
      global.fetch = mockFetch;

      const result = await api.post(requestUrl, requestBody);

      expect(mockFetch).toHaveBeenCalledWith(requestUrl, {
        method: 'POST',
        body: stringifyObjectSafe(requestBody),
      });
      expect(result).toEqual(expectedResponse.content);
    });

    it('should return rejected promise for unsuccessful response', async () => {
      const expectedError = 'Response Error:[502][服务端出错]:Error Post Msg';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: '服务端出错',
        text: () => Promise.resolve('Error Post Msg'),
        status: 502,
      } as Response);
      global.fetch = mockFetch;

      await expect(api.post(requestUrl, requestBody)).rejects.toEqual(expectedError);
    });
  });

  describe('postStream', () => {
    const requestUrl = 'https://example.com';
    const requestBody = { data: 'test data' };

    it('should return successful response', async () => {
      const expectedResponse = { ok: true } as Response;
      const mockFetch = jest.fn().mockResolvedValue(expectedResponse);
      global.fetch = mockFetch;

      const result = await api.postStream(requestUrl, requestBody);

      expect(mockFetch).toHaveBeenCalledWith(requestUrl, {
        method: 'POST',
        body: stringifyObjectSafe(requestBody),
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should return rejected promise for unsuccessful response', async () => {
      const expectedError = 'Response Error:[undefined][error message]:';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'error message',
        text: () => Promise.resolve(''),
      } as Response);
      global.fetch = mockFetch;

      await expect(api.postStream(requestUrl, requestBody)).rejects.toEqual(expectedError);
    });
  });

  describe('delete', () => {
    const requestUrl = 'https://example.com';
    const searchStr = 'id=1';

    it('should return successful response', async () => {
      const expectedResponse = { success: true, content: { data: 'test data' } };
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(expectedResponse),
      } as Response);
      global.fetch = mockFetch;

      const result = await api.delete(requestUrl, searchStr);

      expect(mockFetch).toHaveBeenCalledWith(`${requestUrl}?${searchStr}`, { method: 'DELETE' });
      expect(result).toEqual(expectedResponse.content);
    });

    it('should return rejected promise for unsuccessful response', async () => {
      const expectedError = 'Response Error:[400][error message]:';
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        statusText: 'error message',
        status: 400,
        text: () => Promise.resolve(''),
      } as Response);
      global.fetch = mockFetch;

      await expect(api.delete(requestUrl, searchStr)).rejects.toEqual(expectedError);
    });
  });

  describe('patch', () => {
    const requestUrl = 'https://example.com';
    const requestBody = { data: 'test data' };
    const options = { headers: { 'Content-Type': 'application/json' } };

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, content: 'mockSuccessRes' }),
      } as Response);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call fetch with correct arguments', async () => {
      await api.patch(requestUrl, requestBody, options);

      expect(global.fetch).toHaveBeenCalledWith(requestUrl, {
        method: 'PATCH',
        body: stringifyObjectSafe(requestBody),
        ...options,
      });
    });

    it('should return response content on success', async () => {
      const expectedResponse = 'mockSuccessRes';
      const result = await api.patch(requestUrl, requestBody, options);

      expect(result).toEqual(expectedResponse);
    });

    it('should reject with error content on failure', async () => {
      const expectedError = 'Response Error:[500][error status text]:Error message';
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'error status text',
        status: 500,
        text: () => Promise.resolve('Error message'),
      } as Response);

      await expect(api.patch(requestUrl, requestBody, options)).rejects.toEqual(expectedError);
    });
  });

  describe('put', () => {
    const requestUrl = 'https://example.com';
    const data = { test: 'data' };
    const options = { headers: { 'Content-Type': 'application/json' } };

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, content: 'success content' }),
        } as Response)
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call fetch with the correct arguments', async () => {
      await api.put(requestUrl, data, options);
      expect(global.fetch).toHaveBeenCalledWith(requestUrl, {
        method: 'PUT',
        body: stringifyObjectSafe(data),
        ...options,
      });
    });

    it('should return the processed response on success', async () => {
      const expectedResponse = 'success content';

      const result = await api.put(requestUrl, data, options);

      expect(result).toEqual(expectedResponse);
    });

    it('should reject with the processed error content on failure', async () => {
      const expectedError = 'Response Error:[500][undefined]:Error message';
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve('Error message'),
        } as Response)
      );

      await expect(api.put(requestUrl, data, options)).rejects.toEqual(expectedError);
    });
  });
});
