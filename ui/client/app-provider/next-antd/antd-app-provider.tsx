'use client';

import { useServerInsertedHTML } from "next/navigation";
import React from "react";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

import type Entity from '@ant-design/cssinjs/es/Cache';

interface StyledRegistryProps {
  children: React.ReactNode;
}

/**
 * support ant.design insert style in server side in next.js
 * @doc https://ant-design.antgroup.com/docs/react/use-with-next-cn
 */
export const StyledComponentsRegistry = ({ children }: StyledRegistryProps) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};