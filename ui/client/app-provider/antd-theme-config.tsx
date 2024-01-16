'use client';

import { theme } from "antd";
import { useDarkModeQuery } from "../hooks/media-query.hook";

export const isDarkModeFn = () =>
  global?.matchMedia && global?.matchMedia('(prefers-color-scheme: dark)')?.matches;

export const useThemeConfig = () => {
  const isDarkMode = useDarkModeQuery(isDarkModeFn());
  return {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#007FFF',
    },
    components: {
      Menu: {},
      Radio: {},
      Skeleton: {},
    },
  };
}
