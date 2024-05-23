import { useMemo, useState } from "react";
import { SupportedLanguage } from "@arno/shared/i18n/language.type";

export const useI18nLang = () => {

  const langFromCookie = useMemo(() => {
    const url = new URL(window.location.href);
    // read from cookies value `e-studio-locale`
    try {
      const lang = document.cookie.split(';').find((cookie) => cookie.includes('e-studio-locale'))?.split('=')[1];
      return lang as SupportedLanguage;
    } catch(e) {
      return 'en';
    }
  }, []);

  const [lang, setLang] = useState<SupportedLanguage>(langFromCookie || 'en');

  return {
    lang,
    setLang,
  }
};

