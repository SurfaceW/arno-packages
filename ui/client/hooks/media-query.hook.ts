'use client';

import { useState, useEffect } from 'react';

/**
 * check if the current media query matches dark mode
 * @description
 * Hook to get the current media query of dark mode
 */
export const useDarkModeQuery = (initDark?: boolean) => {
  const [isDarkMode, setIsDarkMode] = useState(
    initDark || globalThis?.window?.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  useEffect(() => {
    const mediaQuery = window?.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    setIsDarkMode(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};


export const useMediaMaxWidthQuery = (width?: number) => {
  const [matched, setIsMatched] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${width || 768}px)`);
    setIsMatched(mediaQuery.matches);

    function handleResize() {
      setIsMatched(mediaQuery.matches);
    }

    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  return matched;
}

/**
 * check if the current media query matches mobile
 */
export const useMobileQuery = () => useMediaMaxWidthQuery(768);