/* eslint-disable @typescript-eslint/ban-types */
export interface INextPageParams<P extends Record<string, string> = {}, SP extends Record<string, string> = {}> {
  params: P;
  searchParams: SP;
}