import { NextRequest, NextResponse } from 'next/server';
import { IRequestContext, composeAPIRoute } from './compose-api-route';

describe('composeAPIRoute', () => {
  it('should handle successful response', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;
    const mockRes = { status: 200, body: 'Hello world' } as any;

    // define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValueOnce(mockRes);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1);
    const result = await handler(mockReq, {});

    // assert final response
    expect(result).toBe(mockRes);

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));
  });

  it('should handle redirected response', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;
    const mockRes1 = { status: 302, redirected: true } as NextResponse;
    const mockRes2 = { status: 200, body: 'Hello world' } as any as NextResponse;

    // define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValueOnce(mockRes1);
    const mockFn2 = jest.fn().mockResolvedValueOnce(mockRes2);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1, mockFn2);
    const result = await handler(mockReq, {});

    // assert final response
    expect(result).toBe(mockRes1);

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));

    // assert mockFn2 was not called
    expect(mockFn2).not.toHaveBeenCalled();
  });

  it('should handle error thrown by composed function', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;
    const mockRes = { status: 200, body: 'Hello world' } as any as NextResponse;

    // define mock function to compose
    const mockFn1 = jest.fn().mockRejectedValueOnce(new Error('Test error'));

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1);

    const res = await handler(mockReq, {});
    expect(res).toBeInstanceOf(Response);
    expect(res?.status).toBe(500);
    expect(res?.ok).toBe(false);
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));
  });

  it('should handle 200 standard compose invokers response', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;

    // define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValue(new Response());
    const mockFn2 = jest.fn().mockResolvedValue(null);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn2, mockFn1);
    const resultResponse = await handler(mockReq, {});

    // assert final response
    expect(resultResponse?.status).toBe(200);

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));
  });

  it('should handle compose invokers response return the last response', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;

    // define mock functions to compose
    // 模拟登录检测函数不返回内容
    const mockFn1 = jest.fn().mockResolvedValue(null);
    const mockFn2 = jest.fn().mockResolvedValue(new Response('test1', { statusText: 'test1' }));
    const mockFn3 = jest.fn().mockResolvedValue(new Response('test1', { statusText: 'test2' }));
    const mockFn4 = jest.fn().mockResolvedValue(null);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1, mockFn2, mockFn3, mockFn4);
    const resultResponse = await handler(mockReq, {});

    // assert final response
    expect(resultResponse?.status).toBe(200);
    expect(resultResponse?.statusText).toBe('test2');

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));
  });

  it('should handle 500 standard compose invokers response', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;

    // define mock functions to compose
    // 模拟登录检测函数不返回内容
    const mockFn1 = jest.fn().mockResolvedValue(null);
    const mockFn2 = jest.fn().mockResolvedValue(new Response());
    const mockFn3 = jest.fn().mockRejectedValueOnce(new Error('Test error'));
    const mockFn4 = jest.fn().mockResolvedValue(null);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1, mockFn2, mockFn3, mockFn4);
    const resultResponse = await handler(mockReq, {});

    // assert final response
    expect(resultResponse?.status).toBe(500);

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));
  });

  it('should handle redirected response and break it', async () => {
    // define mock request and response
    const mockReq = {} as NextRequest;
    const mockRes1 = { status: 304, body: null } as NextResponse;
    const mockRes2 = { status: 200, body: 'Hello world' } as any as NextResponse;

    // define mock functions to compose
    const mockFn1 = jest.fn().mockResolvedValueOnce(mockRes1);
    const mockFn2 = jest.fn().mockResolvedValueOnce(mockRes2);

    // call the composeAPIRoute function
    const handler = composeAPIRoute(mockFn1, mockFn2);
    const result = await handler(mockReq, {});

    // assert final response
    expect(result?.status).toBe(304);

    // assert mockFn1 was called with correct parameters
    expect(mockFn1).toHaveBeenCalledWith(mockReq, null, expect.any(Map));

    // assert mockFn2 was not called
    expect(mockFn2).not.toHaveBeenCalled();
  });

  it('should consume the prev response context setter', async () => {
    // define mock request and response
    const mockReq = {
      nextUrl: {
        search: '?test=1',
      },
    } as NextRequest;

    // define mock functions to compose
    // 模拟登录检测函数不返回内容
    const mockFn1 = (req: any, finalRes: any, reqContext: any) => {
      reqContext.set('test1', 'test1');
      expect(reqContext.get(IRequestContext)?.searchParams?.get('test')).toBe('1');
      return new Response();
    };
    const mockFn2 = (req: any, finalRes: any, reqContext: any) => {
      reqContext.set('test2', reqContext.get('test1') + '|test2');
      return new Response('', {
        statusText: reqContext.get('test2'),
      });
    };

    // call the composeAPIRoute function
    // @ts-ignore
    const handler = composeAPIRoute(mockFn1, mockFn2);
    const resultResponse = await handler(mockReq, {});

    // assert final response
    expect(resultResponse?.status).toBe(200);
    expect(resultResponse?.statusText).toBe('test1|test2');
  });
});
