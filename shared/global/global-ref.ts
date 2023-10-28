import 'reflect-metadata';

const globalRefSymbol = Symbol.for('global-ref-map');
(global as any)[globalRefSymbol] = new Map<symbol, any>();

export class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    // console.log(`[INFO][GlobalRef]: use GlobalRef: ${uniqueName}`);
    this.sym = Symbol.for(uniqueName);
    (global as any)[globalRefSymbol].set(this.sym, undefined);
  }

  get value() {
    return (global as any)[this.sym] as (T | undefined);
  }

  set value(value: T | undefined) {
    (global as any)[this.sym] = value;
    (global as any)[globalRefSymbol].set(this.sym, (global as any)[this.sym]);
  }

  delete(symbol: symbol) {
    (global as any)[globalRefSymbol].delete(symbol);
  }

  printRefMap() {
    (global as any)[globalRefSymbol].forEach((value: any, key: string) => {
      console.log(key, value);
    });
  }

  toString() {
    return this.sym.toString();
  }
}

/**
 * return the global unique instance mounted on Global object
 */
export function getGlobalRefMap() {
  return (global as any)[globalRefSymbol] as Map<symbol, any>;
}

export function clearGlobalRefMap() {
  ((global as any)[globalRefSymbol] as Map<symbol, any>).clear();
}

/**
 * use to mount class instance to GlobalRef object, to implement global singleton
 * 
 * @notice only for class, not for function
 * @warn to avoid memory leak, unique name should be unique
 */
export function GlobalRefClassDecorator<T = any>(uniqueName: string) {
  let _classRef = new GlobalRef<T>(uniqueName);
  return function (TargetClassConstructor: any) {
    class TargetClassGlobalRefConstructor extends TargetClassConstructor {
      constructor(...args: any[]) {
        if (_classRef.value) {
          return _classRef.value;
        }
        super(...args);
        _classRef.value = this as any;
      }
    }
    return TargetClassGlobalRefConstructor as T;
  };
}
