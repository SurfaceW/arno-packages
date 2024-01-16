'use client';

import { ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import React from "react";

import { useDarkModeQuery } from "../../hooks/media-query.hook";
import { useThemeConfig } from "../antd-theme-config";

export const isDarkModeFn = () =>
  global?.matchMedia && global?.matchMedia('(prefers-color-scheme: dark)')?.matches;

const AntDConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useDarkModeQuery(isDarkModeFn());
  const themeConfig = useThemeConfig();

  return (
    <ConfigProvider
      locale={enUS}
      // @doc https://ant-design.antgroup.com/docs/react/customize-theme-cn
      theme={themeConfig}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntDConfigProvider;
