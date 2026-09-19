import { defineMiddleware } from 'astro:middleware';

/**
 * Locale negotiation (ASTRO-004). Cookie wins over Accept-Language;
 * Phase 8 (I18N-*) owns the full locale list and routing.
 */
const SUPPORTED_LOCALES = ['es', 'en'] as const;
const DEFAULT_LOCALE = 'es';

export const localeMiddleware = defineMiddleware(async (context, next) => {
  // Prerendered pages have no real client request to negotiate against
  // (reading either the cookie or the header would touch the underlying
  // Request's headers, which Astro warns about on prerendered routes);
  // the client-side i18n store handles per-visitor locale after hydration.
  const cookieLocale = context.isPrerendered ? undefined : context.cookies.get('locale')?.value;

  const header = context.isPrerendered
    ? ''
    : (context.request.headers.get('accept-language') ?? '');
  const negotiated = header.split(',')[0]?.trim().slice(0, 2).toLowerCase() ?? '';

  context.locals.locale =
    cookieLocale ??
    ((SUPPORTED_LOCALES as readonly string[]).includes(negotiated) ? negotiated : DEFAULT_LOCALE);

  return next();
});
