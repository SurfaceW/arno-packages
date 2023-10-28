export const parseJSONObjectSafe = <T = any>(str: string | any): T => {
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    // log the full string
    console.warn('parseJSONObjectSafe error: %o', e, '\n and the source of str is:', str);
    return str as T;
  }
};

export const stringifyObjectSafe = (obj: Object | any, ...args: any[]) => {
  if (typeof obj === 'string') return obj;
  try {
    return JSON.stringify(obj, ...args);
  } catch (e) {
    console.error('stringify error: %o', e);
    return '';
  }
};

/**
 * 兼容 BigInt 的 JSON.stringify
 */
export const hackStringify = () => {
  const oldStringify = JSON.stringify;
  JSON.stringify = function (value, replacer, space) {
    const rpc = replacer;
    const replaceFn = (key: any, value: any) => {
      if (typeof replacer === 'function') {
        return replacer(key, value);
      } else {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      }
    };
    return oldStringify(value, rpc || (replaceFn as any), space);
  };
};