import { useMemo, useState } from "react";
import { SupportedLanguage } from "@arno/shared/i18n/language.type";

export const useI18nLang = () => {

  const langFromUrl = useMemo(() => {
    const url = new URL(window.location.href);
    /**
     * url example for https://elaboration.studio/en-US/*
     */
    const lang = url.pathname.split('/')?.[1];
    return lang as SupportedLanguage;
  }, []);

  const [lang, setLang] = useState<SupportedLanguage>(langFromUrl || 'en-US');

  return {
    lang,
    setLang,
  }
};