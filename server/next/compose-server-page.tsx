import React from 'react';

import { getLogger } from '../log/logger';
import { ComposeFnCtx } from './compose-api-route';

export type NextServerPageParams = {
  params: { [slug: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type ComposeServerPageFunction = (
  nextParams: NextServerPageParams,
  reqContext: ComposeFnCtx
) => Promise<any>;

export function composeServerPage(
  Page: React.FC<
    NextServerPageParams & {
      context: ComposeFnCtx;
    }
  >,
  fns: ComposeServerPageFunction[] = [],
  options?: {
    /**
     * unintentional error fallback-view
     */
    unCatchErrorSection: React.ReactNode;
  }
) {
  const errorSection = options?.unCatchErrorSection || <div>Something went wrong</div>;
  const context = new Map();
  return function MiddlewareChainedPageServer({ params, searchParams }: NextServerPageParams) {
    const result: any[] = [];
    const _internalFn = async () => {
      for (const fn of fns) {
        try {
          const fnResult = await fn({ params, searchParams }, context);
          if (fnResult) {
            /**
             * if middleware returns a value, it means it wants to stop the chain
             * return the value as the result of the page
             */
            result.push(fnResult);
          }
        } catch (e: any) {
          getLogger('app').error(
            '[appPageRouter] global catch handler error: ' + e?.message || e,
            e?.stack || ''
          );
          result.push(errorSection);
        }
      }
    };
    return _internalFn().then(() => {
      if (result.length > 0) {
        return result[0] as React.ReactNode;
      }
      return Page({ params, searchParams, context });
    });
  };
}
