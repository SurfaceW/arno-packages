import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const AVAILABLE_LOCALES = ['en', 'zh'];
export const DEFAULT_LOCALE = 'en';

export function getLocale(request: {
  headers: Record<string, string | string[] | undefined>;
}) {
  let languages = new Negotiator(request).languages();
  const locales = AVAILABLE_LOCALES;
  const defaultLocale = DEFAULT_LOCALE;

  // console.info('languages', languages, 'headers', request.headers);

  if (languages?.[0] === '*') {
    languages = ['en'];
  }

  return match(languages, locales, defaultLocale); // -> 'en'
}
