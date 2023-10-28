import { NextResponse } from 'next/server';
import { ILogger, hackStringify, stringifyObjectSafe } from '@arno/shared';

hackStringify();

export const failResponse = async <ErrorObject = unknown>(
  message: string | ErrorObject,
  code: number = 500,
  options?: ResponseInit
) => {
  if (message instanceof Error) {
    message = message?.message || message?.stack || message?.toString();
  } else if (typeof message === 'object') {
    message = stringifyObjectSafe(message);
  }
  return new Response(message as string, {
    ...options,
    status: code,
  });
};

export function successJsonResponse<ContentData = unknown>(
  content: ContentData,
  options?: ResponseInit
) {
  return NextResponse.json(
    {
      success: true,
      content,
    },
    options
  );
}

export type ServiceResultOptions<T> = {
  logger?: ILogger;
  responseOptions?: T;
};

export interface IServiceAdapter<DataType, ResponseStructureType> {
  getData(
    result: ServiceResult<DataType, ResponseStructureType>,
    options?: {
      logger?: ILogger;
    }
  ): DataType;
  isSuccess(result: ServiceResult<DataType, ResponseStructureType>): boolean;
  response(
    result: ServiceResult<DataType, ResponseStructureType>
  ): Promise<ResponseStructureType>;
}

/**
 * 服务端通用 Service 结果返回
 *
 * - 一般 Service 相关的类被 Controller 层复用返回应该是统一的格式
 * - 支持协议适配器模式，可以自定义返回格式，以支持 HSF、HTTP、LWP、gRPC 等
 *
 * Generic Type:
 * - ServiceDataTypeGeneric: 服务端返回的数据类型(内部数据)
 * - ResponseTypeGeneric: 服务端返回的数据类型(外部数据)
 * - ResponseOptionsTypeGeneric: 服务端返回的数据类型(外部数据)的响应配置参数
 */
export class ServiceResult<
  ServiceDataTypeGeneric = unknown,
  ResponseTypeGeneric = unknown
> {
  public success: boolean = false;
  public message: string = '';
  public responseOptions?: unknown;
  // internal data
  public _data: ServiceDataTypeGeneric;

  protected _logger?: ILogger;
  protected _adapter?: IServiceAdapter<ServiceDataTypeGeneric, ResponseTypeGeneric>;

  get data(): ServiceDataTypeGeneric {
    if (this._adapter) {
      return this._adapter.getData(this, {
        logger: this._logger,
      });
    }
    return this._data;
  }

  /**
   * Alias of this.data
   */
  getData(): ServiceDataTypeGeneric {
    return this.data;
  }

  constructor(
    success: boolean,
    message: string,
    data: ServiceDataTypeGeneric,
    options?: ServiceResultOptions<unknown>
  ) {
    this.success = success;
    this.message = message;
    this._data = data;
    this.responseOptions = options?.responseOptions;
    this._logger = options?.logger;

    if (this._logger) {
      this._logger.debug(
        '[ServiceResult] create new ServiceResult, %s %s %o %o',
        success,
        message,
        data,
        this.responseOptions,
      );
    }
  }

  static success<T = unknown>(
    data: T,
    message: string = '',
    options?: ServiceResultOptions<unknown>
  ) {
    return new ServiceResult<T>(true, message, data, options);
  }

  static fail<T = any>(message: string, data: T, options?: ServiceResultOptions<unknown>) {
    return new ServiceResult<T>(false, message, data, options);
  }

  useAdapter(
    adapter: IServiceAdapter<ServiceDataTypeGeneric, ResponseTypeGeneric>
  ) {
    this._adapter = adapter;
    return this as any as ServiceResult<ServiceDataTypeGeneric, ResponseTypeGeneric>;
  }

  isSuccess(): boolean {
    if (this._adapter) {
      return this._adapter.isSuccess(this);
    }
    return this.success;
  }

  async response(): Promise<ResponseTypeGeneric> {
    if (this._adapter) {
      return this._adapter.response(this);
    }
    // fallback to default data-content
    return this._data as any as ResponseTypeGeneric;
  }
}

/**
 * Next HTTP general Service return with HTTP response adapter
 *
 * - support HTTP JSON response
 * - unified Response object，with standard ResponseInit as options
 */
export class NextHTTPServiceResultAdapter<ServiceDataGenericType>
  implements IServiceAdapter<ServiceDataGenericType, Response>
{
  getData(
    result: ServiceResult<ServiceDataGenericType, Response>,
    options?: {
      logger?: ILogger;
    }
  ): ServiceDataGenericType {
    if (result.success) {
      return result._data as ServiceDataGenericType;
    } else if (result.success === false) {
      if (options?.logger) {
        options.logger.error(
          'ServiceResult is not success, can not access response data, %o',
          result
        );
      } else {
        console.error('ServiceResult is not success, can not access response data', result);
      }
    }
    return result._data as ServiceDataGenericType;
  }

  isSuccess(result: ServiceResult<ServiceDataGenericType, Response>): boolean {
    return result.success;
  }

  fail(result: ServiceResult<ServiceDataGenericType, Response> & { status: number }) {
    /**
     * 默认返回 200， 带上错误信息
     * 需要显式抛出错误码
     */
    return failResponse(
      result.message,
      result?.status || (result.responseOptions as ResponseInit)?.status,
      result.responseOptions as ResponseInit
    );
  }

  successJson(result: ServiceResult<ServiceDataGenericType, Response>) {
    return successJsonResponse(result._data, result.responseOptions as ResponseInit);
  }

  async response(
    result: ServiceResult<ServiceDataGenericType, Response> & { status: number }
  ): Promise<Response> {
    return result.success ? this.successJson(result) : this.fail(result);
  }
}

/**
 * Server Side ServiceResult
 * - ServiceResult should not throw error, but return error message
 * - Adapter first, for better future compatibility
 * ```ts
 * const serviceResult = new ServiceResult(true, '', {}, {
 *   responseOptions: {
 *     status: 201
 *   }
 * });
 * serviceResult.useAdapter(new NextHTTPServiceResultAdapter());
 * const res = await serviceResult.response();
 * ```
 */
export class NextHTTPServiceResult<
  ServiceDataTypeGeneric = unknown,
> extends ServiceResult<ServiceDataTypeGeneric, Response> {
  public status: number = 200;

  constructor(
    res: {
      success: boolean;
      message?: string;
      data?: ServiceDataTypeGeneric;
    },
    options?: ServiceResultOptions<ResponseInit>
  ) {
    super(res?.success, res?.message || '', res?.data as ServiceDataTypeGeneric, options);
    if (res?.success) {
      this.status = options?.responseOptions?.status || 200;
    } else {
      // fail with 500
      this.status = options?.responseOptions?.status || 500;
    }
    this.useAdapter(new NextHTTPServiceResultAdapter());
  }

  static success<T>(
    data: T,
    message: string = '',
    options?: ServiceResultOptions<ResponseInit>
  ) {
    return new NextHTTPServiceResult<T>(
      {
        success: true,
        data: data,
        message: message,
      },
      options
    );
  }

  static fail<R = unknown>(
    message: string,
    data: R,
    options?: ServiceResultOptions<ResponseInit>
  ) {
    return new NextHTTPServiceResult<R>(
      {
        success: false,
        data,
        message,
      },
      options
    );
  }

  fail() {
    /**
     * by default with 200, but should come with error message
     * you need throw the error code explicitly
     */
    return failResponse(this.message, this.status, this.responseOptions as ResponseInit);
  }

  successJson() {
    return successJsonResponse(this.data);
  }
}
