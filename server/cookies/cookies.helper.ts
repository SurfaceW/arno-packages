import { SupportedLanguage } from "@arno/shared/i18n/language.type";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export class CookieHelper {
  getLangCookie(cookies: ReadonlyRequestCookies) {
    return cookies.get('e-studio-locale');
  }

  getLanguage(cookies: ReadonlyRequestCookies) {
    const lang = this.getLangCookie(cookies);
    return lang?.value as SupportedLanguage || 'en';
  }

  setLangCookie(cookies: ReadonlyRequestCookies, lang: SupportedLanguage) {
    cookies.set('e-studio-locale', lang, {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    });
  }
}