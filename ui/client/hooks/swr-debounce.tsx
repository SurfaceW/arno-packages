import { useEffect, useState } from "react";

/**
 * work with useSWR to debounce the fetcher
 * @see https://github.com/vercel/swr/issues/110#issuecomment-552637429
 */
export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}