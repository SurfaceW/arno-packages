import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const AVAILABLE_LOCALES = ['en-US', 'zh-CN'];
export const DEFAULT_LOCALE = 'en-US';

export function getLocale(request: {
  headers: Record<string, string | string[] | undefined>;
}) {
  let languages = new Negotiator(request).languages();
  let locales = AVAILABLE_LOCALES;
  let defaultLocale = DEFAULT_LOCALE;

  console.info('languages', languages, 'headers', request.headers);

  if (languages?.[0] === '*') {
    languages = ['en-US'];
  }

  return match(languages, locales, defaultLocale); // -> 'en-US'
}
