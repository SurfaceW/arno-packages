import { isBrowserContext } from './runtime';

describe('isBrowser', () => {
  it('should return true when running in a browser environment', () => {
    // Mock the window object
    // @ts-ignore
    globalThis.window = globalThis;
    expect(isBrowserContext()).toBe(true);
    // @ts-ignore clean up
    globalThis.window = undefined;
  });

  it('should return false when running in a Node.js environment', () => {
    expect(isBrowserContext()).toBe(false);
  });
});