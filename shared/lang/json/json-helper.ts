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
    // Handle BigInt serialization
    if (Array.isArray(replacer)) {
      // If replacer is an array, we need a function that handles BigInt
      const bigintReplacer = (key: string, value: unknown): unknown => {
        return typeof value === 'bigint' ? value.toString() : value;
      };
      return JSON.stringify(obj, bigintReplacer, space);
    } else {
      // Handle function replacer or no replacer
      const bigintAwareReplacer = (key: string, value: unknown): unknown => {
        // First apply the original replacer if provided
        let processedValue = value;
        if (replacer && typeof replacer === 'function') {
          processedValue = (replacer as (key: string, value: unknown) => unknown)(key, value);
        }

        // Then handle BigInt conversion
        return typeof processedValue === 'bigint' ? processedValue.toString() : processedValue;
      };

      return JSON.stringify(obj, bigintAwareReplacer, space);
    }
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

      try {
        if (replacer && typeof replacer === 'function') {
          value = replacer(key, val);
        }

        // Then handle BigInt conversion
        return typeof value === 'bigint' ? value.toString() : value;
      } catch (e) {
        console.warn('Error in bigintReplacer:', e);
        // Return the original value if there's an error
        return val;
      }
    };
    
    try {
      // Use the original stringify with our enhanced replacer
      return originalStringify(value, bigintReplacer, space);
    } catch (e) {
      console.warn('Error in patched JSON.stringify:', e);
      // Fallback to original stringify
      return originalStringify(value);
    }
  }) as JSONStringifyFunction;
};

// For backward compatibility
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