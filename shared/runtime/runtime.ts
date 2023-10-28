/**
 * Check current runtime environment is browser or node
 * - true for browser
 * - false for node
 */
export const isBrowserContext = (): boolean => {
  // In a browser, the window object is defined and is the global object itself, 
  // whereas in Node.js, it is not. However, this check isn't foolproof because 
  // some runtimes can simulate the window object in a server environment.
  if (typeof window !== 'undefined' && window === window.window) {
    return true;
  }

  // The process object is a global that provides information about, and control over, the current Node.js process.
  // As a global, it is always available to Node.js applications without using require(). 
  // We can check its versions property to make sure we're in a Node.js environment.
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return false;
  }

  // Neither window nor process object is defined. We cannot determine the environment.
  throw new Error('Unable to determine runtime environment') as never;
}