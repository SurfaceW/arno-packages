import { ServiceResult } from './service.result';

/**
 * Service Decorator to define the service method is a service function
 * * which mean it will handle error catching and response with a standard format `ServiceResult`
 */
export function WithServiceResult(customOptions?: {
  catchFn?: (error: any) => ServiceResult<Error, unknown>;
}) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor?.value;
    if (!originalMethod) {
      throw new Error('WithServiceResult decorator can only be used on method');
    }
    
    descriptor.value = async function (this: any, ...args: any[]): Promise<ServiceResult<any, unknown>> {
      try {
        const result = await originalMethod.apply(this, args);
        return new ServiceResult(true, 'ok', result);
      } catch (error: unknown) {
        if (customOptions?.catchFn) {
          return customOptions.catchFn(error);
        }
        console.error(
          `Service Error from fn [${target?.name || target?.toString()}][${propertyKey}]: `,
          error
        );
        return new ServiceResult(
          false,
          (error as Error)?.message || 'unknown error',
          error
        );
      }
    };
    
    return descriptor;
  };
}

