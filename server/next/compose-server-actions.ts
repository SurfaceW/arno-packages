import { ComposeFnCtx } from "./compose-api-route";

export type ComposeServerActionFunction<T, R extends ServerActionResult<R> = any> = (data: T, ctx: ComposeFnCtx) => Promise<R>;

export type ServerActionResult<R = any> = {
  success: boolean;
  status: string;
  message?: string;
  data?: R;
};

/**
 * Compose server actions for next.js
 * use middleware liked way to handle next action with pre-defined operation functions
 */
export function composeServerActions(fns: ComposeServerActionFunction<any>[]) {
  const ctx = new Map();
  return async function wrapAPIHandler(data: any) {
    let finalRes = null;
    for (const fn of fns) {
      try {
        const response = await fn(data, ctx) as (ServerActionResult | undefined);
        if (!response) {
          continue;
        }
        if (!response.success) {
          return response;
        }
        finalRes = response;
      } catch (e: any) {
        console.error('❌ [composeServerActions] error', e);
        return {
          success: false,
          status: 'error',
          message: e?.message || e?.toString(),
        } as ServerActionResult;
      }
    }
    return finalRes;
  }
}