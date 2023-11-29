/**
 * Fetch with timeout
 */
export function fetchEnhanced<T = Response>(url: string, options: RequestInit, enhancedOptions: {
  timeout: number;
} = {
    timeout: 5000,
  }): Promise<T> {
  const controller = new AbortController();
  const { timeout } = enhancedOptions;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      console.error(`Request timed out after ${timeout}ms on ${url}`);
      reject(new Error('Request timed out'));
    }, timeout);
  });

  const fetchPromise = fetch(url, { ...options, signal: controller.signal });

  return Promise.race([fetchPromise, timeoutPromise]) as Promise<T>;
}