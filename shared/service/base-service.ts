import { EventEmitter } from '../lang/patterns/event-emitter';

// function to generate unique id with prefix as option
const uniqueId = (function () {
  let idCounter = 0;
  return function (prefix?: string) {
    const id = ++idCounter;
    return `${prefix || ''}${id}`;
  };
})();


/**
 * impl this interface, can dispose resource by calling dispose or disposeAsync method
 */
export interface IDisposable {
  dispose(): void;
  disposeAsync?(): Promise<void>;
}

/**
 * impl this interface shall: 
 * - call init method to init resource
 * - call isReady method to check if the resource is ready
 */
export interface IAsyncInitialize {
  init(): Promise<void>;
  isReady(): boolean;
}

/**
 * decorator for class method, used to check if the service is ready
 * - if invoke before init, will throw error
 */
export function initRequired() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any, ...args: any[]) {
      if (!this?.isReady?.()) {
        throw new Error('Service is not ready, please call init() first.');
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

/**
 * class method decorator, used to invoke after service init
 * 
 * @notice if the service is not ready, will wait until timeout and throw error
 */
export function afterInit(options?: {
  /**
   * timeout in milliseconds
   * 
   * @default 20000
   */
  timeout: number;
}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any, ...args: any[]) {
      if (!this?.isReady?.()) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            clearTimeout(timeout);
            reject(new Error(`[afterInit] Service is not ready, please call init() first.`));
          }, options?.timeout || 20000);
          this._emitter.once('ready', () => {
            clearTimeout(timeout);
            resolve(true);
          });
        });
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

export abstract class ServiceBase implements IDisposable {
  public uid = uniqueId(`[Service]-[${this?.constructor?.name}]-`);
  /**
   * Dispose the service
   */
  dispose() {
    throw new Error('Method not implemented.');
  }
}

const INSET_TIMEOUT = 10000;

/**
 * class extends this class, need to impl init method
 * 
 * @example
 * ```ts
 * class DemoAsyncService extends AsyncServiceBase {
 *   constructor() {
 *     super();
 *     this.init();
 *   }
 *   async init() {
 *     await this.doInit(); // service custom async init process
 *     super.init();
 *   }
 * }
 * 
 * const fn = async () => {
 *   const demoService = new DemoAsyncService();
 *   await demoService.onReady();
 *   // do something with demoService
 * }
 * ```
 */
export abstract class AsyncServiceBase extends ServiceBase implements IAsyncInitialize {
  protected ready: boolean = false;
  protected _emitter = new EventEmitter();

  async init() {
    this.ready = true;
    this._emitter.emit('ready');
  }

  async onReady() {
    await new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout;
      if (this.ready) {
        resolve(true);
        return;
      } else {
        timer = setTimeout(() => {
          clearTimeout(timer);
          reject(new Error(`[AsyncServiceBase] Service ${this?.constructor?.name} init timeout.`));
        }, INSET_TIMEOUT);
        this._emitter.once('ready', () => {
          clearTimeout(timer);
          resolve(true);
        });
      }
    });
  }

  /**
   * Check if the service is ready
   */
  isReady() {
    return this.ready;
  }

  /**
   * Dispose the service
   */
  dispose() {
    this._emitter.removeAllListeners();
  }
}
