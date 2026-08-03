import {
  DEFAULT_LOCALE,
  LOCALES,
  RTL_LOCALES,
  type Locale,
} from '@luxury-travel/shared';

export { DEFAULT_LOCALE, LOCALES, RTL_LOCALES, type Locale };

export function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}

export function isRtl(locale: Locale) {
  return RTL_LOCALES.includes(locale);
}

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}
