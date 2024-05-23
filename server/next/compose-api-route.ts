import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "../log/logger";

export type ComposeFnCtx = {
  get<T = any>(sym: Symbol): T;
  set(sym: Symbol, value: any): void;
};

export const IRequestContext = Symbol.for('context');
export interface IRequestContext<NextParams = any, Body = any, SearchParams = any> {
  params: Record<keyof NextParams, string>;
  searchParams: URLSearchParams;
  parsedBody: Body | null;
}

export type ComposeAPIRouteFunction = (req: NextRequest, res: NextResponse, reqContext: ComposeFnCtx) => Promise<any>;

/**
 * user next server composeAPI route
 * - middleware like
 * - apply to /app/api/route.ts for route compose
 * 
 * @param reqContext Next's params / searchParams 组成
 */
export function composeAPIRoute(...args: ComposeAPIRouteFunction[]) {
  const fns = Array.from(arguments);
  return async function wrapAPIHandler(req: NextRequest, reqContext: any) {
    const context = new Map();
    
    let finalRes = null;
    let parsedBody = null;

    if (req.method !== 'GET') {
      try {
        parsedBody = await req?.json();
      } catch (e: any) { 
        console.error(`
          [apiRoute] parse body error: ${e?.message || e}
          ${e?.stack || ''}
        `);
        getLogger('api').error('[apiRoute] parse body error: ' + e?.message || e, e?.stack || '');
      }
    }

    // inject basic request searchParams
    context.set(IRequestContext, {
      searchParams: new URLSearchParams(req?.nextUrl?.search),
      ...reqContext,
      parsedBody,
    });

    try {
      for (const fn of fns) {
        try {
          const response = await fn(req, finalRes, context) as NextResponse;
          if (!response) {
            continue;
          }
          finalRes = response;
          if (finalRes?.redirected || finalRes?.status !== 200) {
            // if middleware function return a response with redirected condition, break the invoking chain
            break;
          }
        } catch (e: any) {
          throw new Error(`fn: ${fn.name} invoke error ${e?.message || e}`);
        }

      }
      return finalRes;
    } catch (e: any) {
      getLogger('api').error('[apiRoute] global catch handler error: ' + e?.message || e, e?.stack || '');
      return new Response('server error', { status: 500 });
    }
  }
}

/**
 * @deprecated use IRequestContext instead
 */
export const IRequestBody = Symbol.for('responseBody');
/**
 * @deprecated use IRequestContext instead
 * 用于 next server 的 composeAPI route
 * @notice 用于 /app/api/route.ts 中的 route compose
 * 需要配合 parseReq 使用
 */
export interface IRequestBody<ReqBody = any> {
  body: ReqBody;
}

/**
 * @deprecated use composeAPIRoute instead
 */
export const parseReq = (options?: {}) => {
  return async function parseReq(req: NextRequest, finalRes: NextResponse, context: any) {
    if (req.method === 'GET') {
      return;
    }
    const jsonBody = await req.json();
    context.set(IRequestBody, {
      body: jsonBody,
    });
    return finalRes;
  }
}
