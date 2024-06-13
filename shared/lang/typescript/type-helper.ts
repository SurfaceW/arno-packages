export type FirstParamOfFunc<FunctionType> = FunctionType extends (
  first: infer P,
  ...rest: any[]
) => any
  ? P
  : never;

export type ParametersAsTuple<Func> = Func extends (...args: infer P) => any ? P : never;


// Extract the Promise resolution type
export type ResolvedPromiseType<T> = T extends Promise<infer R> ? R : never;

export type ReturnTypeOf<Func> = Func extends (...args: any[]) => infer R ? R : any;

export type ArrayElementType<T> = T extends (infer E)[] ? E : never;

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Could be used when you need to partially update deep nested objects.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T[P] extends ReadonlyArray<infer X>
  ? ReadonlyArray<DeepPartial<X>>
  : DeepPartial<T[P]>
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : DeepReadonly<T[P]>
};

export type NonFunctionProperties<T> = Pick<T, {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]>;

/**
 * Remove undefined from union type
 * type A = string | undefined; 
 * type C = Fn<A>; // C will be string
 */
export type RemoveUndefinedType<T> = T extends undefined ? never : T;