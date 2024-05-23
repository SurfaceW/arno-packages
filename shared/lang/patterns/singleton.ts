export const SINGLETON_KEY = Symbol.for('singleton');

export type SingletonType<T extends new (...args: any[]) => any> = T & {
  [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never;
};

/**
 * singleton pattern impl. as decorator
 * 
 * @example
 * 
 * ```ts
 *  @singleton
 *  class NodeHelper {
 *     // ...
 *  }
 * ```
 */
export const singleton = <T extends new (...args: any[]) => any>(classTarget: T) =>
  new Proxy(classTarget, {
    construct(target: SingletonType<T>, argumentsList, newTarget) {
      // Skip proxy for children
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, argumentsList, newTarget);
      }
      if (!target[SINGLETON_KEY]) {
        target[SINGLETON_KEY] = Reflect.construct(target, argumentsList, newTarget);
      }
      return target[SINGLETON_KEY];
    },
  });
