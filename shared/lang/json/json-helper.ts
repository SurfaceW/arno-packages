export const parseJSONObjectSafe = <T = unknown>(str: string | unknown): T => {
  if (typeof str !== 'string') return str as T;
  try {
    return JSON.parse(str);
  } catch (e) {
    // log the full string
    console.warn('parseJSONObjectSafe error: %o', e, '\n and the source of str is:', str);
    return str as T;
  }
};

export const stringifyObjectSafe = (obj: unknown, replacer?: Parameters<typeof JSON.stringify>[1], space?: string | number): string => {
  if (typeof obj === 'string') return obj;
  try {
    return JSON.stringify(obj, replacer, space);
  } catch (e) {
    console.error('stringify error: %o', e);
    return '';
  }
};

/**
 * Safely stringify any value including BigInt
 * @param value - The value to stringify
 * @param space - Optional number of spaces for indentation
 * @returns JSON string representation
 */
export const safeStringify = (value: unknown, space?: number): string => {
  const replacer = (_key: string, v: unknown): unknown => 
    typeof v === 'bigint' ? v.toString() : v;
  
  return JSON.stringify(value, replacer, space);
};

type JSONStringifyFunction = typeof JSON.stringify;

/**
 * Patch the global JSON.stringify to handle BigInt values
 * This should be called early in your application lifecycle
 */
export const enableBigIntStringify = (): void => {
  const originalStringify = JSON.stringify;
  
  // Override the global JSON.stringify
  JSON.stringify = (function(
    value: unknown,
    replacer?: ((key: string, value: unknown) => unknown) | (string | number)[] | null,
    space?: string | number
  ): string {
    // Handle the case with replacer array separately
    if (Array.isArray(replacer)) {
      return originalStringify(value, replacer, space);
    }
    
    // Create a BigInt-aware replacer function that wraps the original replacer
    const bigintReplacer = (key: string, val: unknown): unknown => {
      // First apply the original replacer if it's a function
      let value = val;
      if (typeof replacer === 'function') {
        value = replacer(key, val);
      }
      
      // Then handle BigInt conversion
      return typeof value === 'bigint' ? value.toString() : value;
    };
    
    // Use the original stringify with our enhanced replacer
    return originalStringify(value, bigintReplacer, space);
  }) as JSONStringifyFunction;
};

// For backward compatibility
export const hackStringify = enableBigIntStringify;