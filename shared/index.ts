export { DEFAULT_PAGE_SIZE } from './pagination';

export type { ICursorPaginationData, IOffsetPaginationData } from './pagination';

export type { FirstParamOfFunc } from './lang/typescript/type-helper';

export { SINGLETON_KEY, singleton } from './lang/patterns/singleton';
export type { SingletonType } from './lang/patterns/singleton';

export { parseJSONObjectSafe, stringifyObjectSafe, hackStringify } from './lang/json/json-helper';

export { GlobalRefClassDecorator, clearGlobalRefMap, getGlobalRefMap, GlobalRef } from './global/global-ref';

export type { ILogger } from './log/log.core';

export {
  initRequired,
  afterInit,
  ServiceBase,
  AsyncServiceBase,
} from './service/base-service';
export type { IAsyncInitialize, IDisposable } from './service/base-service';