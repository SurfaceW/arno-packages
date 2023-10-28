export type FirstParamOfFunc<FunctionType> = FunctionType extends (
  first: infer P,
  ...rest: any[]
) => any
  ? P
  : never;