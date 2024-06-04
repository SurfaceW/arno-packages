import React from 'react';

import { getLogger } from '../log/logger';
import { ComposeFnCtx } from './compose-api-route';
import { SupportedLanguage } from '@arno/shared/i18n/language.type';
import { CookieHelper } from '../cookies/cookies.helper';

export type NextServerPageParams = {
  params: { [slug: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
  lang?: SupportedLanguage;
};

export type ComposeServerPageFunction = (
  nextParams: NextServerPageParams,
  reqContext: ComposeFnCtx
) => Promise<any>;

export type ComposePageParamsType = NextServerPageParams & {
  context: ComposeFnCtx;
  lang?: SupportedLanguage;
};

export function composeServerPage(
  Page: (
    params: ComposePageParamsType
  ) => Promise<React.ReactNode>,
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
  // @ts-ignore
  return async function MiddlewareChainedPageServer({
    params,
    searchParams,
  }: NextServerPageParams) {
    const result: any[] = [];
    const _internalFn = async () => {
      for await (const fn of fns) {
        try {
          const fnResult = await fn({ params, searchParams }, context);
          // console.log(`compose invoke fn [${fn.name}] with result`, fnResult);
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
          console.trace('❌ composeServerPage chained function error', fn.name, e);
          result.push(errorSection);
        }
      }
    };
    // console.log('composeServerPage invoke inside MiddlewareChainedPageServer');
    await _internalFn();
    // console.log('composeServerPage invoke result with length', result?.length);
    if (result.length > 0) {
      // console.log('compose invoke result', (result[0] as React.ReactNode)?.toString());
      return (await result[0]) as React.ReactNode;
    }
    return await Page({ params, searchParams, context });
  };
}
