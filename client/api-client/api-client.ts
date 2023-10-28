import { stringifyObjectSafe } from '@arno/shared';

function processResponse(res: {
  success: boolean,
  message?: boolean;
  content: any,
}) {
  if (res.success) {
    return res.content;
  }
  return Promise.reject('fetch error: ' + res.message);
}

async function processErrorContent(res: Response) {
  return `Response Error:[${res.status}][${res.statusText}]:${await res.text()}`
}

/**
 * fetch encapsulation for biz-call
 * 
 * - general api client, with error handling inset
 * - RESTful api client design
 * 
 * @description work with server-side success / fail response error-code and etc.
 */
export const api = {
  async get<Response = any>(requestUrl: string, searchParams?: URLSearchParams, options?: RequestInit) {
    const search = searchParams?.toString() || '';
    const res = await fetch(`${requestUrl}${search ? `?${search}` : ''}`, {
      ...options
    });
    if (!res.ok) {
      return Promise.reject(await processErrorContent(res));
    }
    const r = await res.json();
    return processResponse(r) as Response;
  },

  async post<P = any, R = any>(
    requestUrl: string,
    body: P,
    options?: RequestInit
  ) {
    const res = await fetch(requestUrl, {
      method: 'POST',
      body: stringifyObjectSafe(body),
      ...options
    });
    if (!res.ok) {
      return Promise.reject(await processErrorContent(res));
    }
    const r = await res.json();
    return processResponse(r) as R;
  },

  async patch<P = any, R = any>(
    requestUrl: string,
    body: P,
    options?: RequestInit
  ) {
    const res = await fetch(requestUrl, {
      method: 'PATCH',
      body: stringifyObjectSafe(body),
      ...options
    });
    if (!res.ok) {
      return Promise.reject(await processErrorContent(res));
    }
    const r = await res.json();
    return processResponse(r) as R;
  },

  async postStream<P = any, R = any>(
    requestUrl: string,
    body: P,
    options?: RequestInit
  ) {
    const res = await fetch(requestUrl, {
      method: 'POST',
      body: stringifyObjectSafe(body),
      ...options
    })
      .then(async (resp) => {
        if (!resp.ok) {
          return Promise.reject(await processErrorContent(resp));
        }
        return resp;
      })
      .catch(e => {
        return Promise.reject(e?.message || e?.toString() || stringifyObjectSafe(e));
      });
    return res;

  },

  async put<T, Res>(requestUrl: string, data: T, options?: RequestInit) {
    const res = await fetch(requestUrl, {
      method: 'PUT',
      body: stringifyObjectSafe(data),
      ...options
    });
    if (!res.ok) {
      return Promise.reject(await processErrorContent(res));
    }
    const r = await res.json();
    return processResponse(r) as Res;
  },

  /**
   * @description general delete method
   * - requestUrl
   * - searchStr request searchParams e.g. `id=1&ame=2`
   */
  async delete<P, R>(requestUrl: string, searchStr?: string, options?: RequestInit) {
    const res = await fetch(`${requestUrl}${searchStr ? '?' : ''}${searchStr || ''}`, {
      method: 'DELETE',
      ...options
    });
    if (!res.ok) {
      return Promise.reject(await processErrorContent(res));
    }
    const r = await res.json();
    return processResponse(r) as R;
  }
}
/**
 * alias for api
 */
export const apiClient = api;
