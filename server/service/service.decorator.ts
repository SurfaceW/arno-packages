import { ServiceResult } from './service.result';

/**
 * Service Decorator to define the service method is a service function
 * * which mean it will handle error catching and response with a standard format `ServiceResult`
 */
export function WithServiceResult(customOptions?: {
  catchFn?: (error: any) => ServiceResult;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<
      (...args: any[]) => Promise<any>
    >
  ) {
    const originalMethod = descriptor?.value;

    if (!originalMethod) {
      throw new Error('WithServiceResult decorator can only be used on method');
    }

    descriptor.value = async function (...args: any[]): Promise<ServiceResult<unknown, unknown>> {
      try {
        const result = await originalMethod.apply(this, args);
        return new ServiceResult(true, 'ok', result) as ServiceResult<unknown, unknown> as any;
      } catch (error: unknown) {
        if (customOptions?.catchFn) {
          return customOptions.catchFn(error) as never;
        }
        console.error(
          `Service Error from fn [${target?.name || target?.toString()}][${propertyKey}]: `,
          error
        );
        return new ServiceResult(
          false,
          (error as Error)?.message || 'unknown error',
          error
        ) as never;
      }
    };
  };
}
