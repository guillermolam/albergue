import { useStore } from '@nanostores/react';
import {
  i18nStore,
  i18nActions,
  type Locale,
  type TranslationKeys,
} from '../../src/stores/i18nStore';

/**
 * React bridge for the app's existing nanostores i18n store. Plain `t()`
 * from i18nStore reads a snapshot and never re-renders React on locale
 * change (nanostores updates aren't visible to React without a subscription)
 * — this hook subscribes via useStore so components re-render when the
 * LanguageSelector island changes the locale elsewhere on the page.
 */
export function useI18n() {
  const state = useStore(i18nStore);

  return {
    locale: state.locale,
    isLoading: state.isLoading,
    t: (key: keyof TranslationKeys, fallback?: string): string =>
      i18nActions.getMessage(key, fallback),
    setLocale: (locale: Locale): void => {
      void i18nActions.setLocale(locale);
    },
  };
}
