'use client';

import { ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

import { useDarkModeQuery } from "../../hooks/media-query.hook";

import type Entity from '@ant-design/cssinjs/es/Cache';

export const isDarkModeFn = () =>
  global?.matchMedia && global?.matchMedia('(prefers-color-scheme: dark)')?.matches;

interface StyledRegistryProps {
  children: React.ReactNode;
}

// TODO: we should support zh_CN later
// import zhCN from "antd/locale/zh_CN";

/**
 * support ant.design insert style in server side in next.js
 * @doc https://ant-design.antgroup.com/docs/react/use-with-next-cn
 */
const StyledComponentsRegistry = ({ children }: StyledRegistryProps) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style id="antd-style-full-inserted" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export const AntDConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useDarkModeQuery(isDarkModeFn());

  return (
    <StyledComponentsRegistry>
      <ConfigProvider
        locale={enUS}
        // @doc https://ant-design.antgroup.com/docs/react/customize-theme-cn
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#007FFF',
          },
          components: {
            Menu: {},
            Radio: {},
            Skeleton: {},
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyledComponentsRegistry>
  );
};

export default AntDConfigProvider;
