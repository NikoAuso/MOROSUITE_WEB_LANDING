import { defineMiddleware } from 'astro:middleware';

const CSP = [
  "default-src 'self'",
  // GA4 usa uno script inline (consent bootstrap) + gtag.js
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
  "font-src 'self' https://fonts.bunny.net",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join('; ');

export const onRequest = defineMiddleware(async (_ctx, next) => {
  const res = await next();
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/html')) {
    res.headers.set('Content-Security-Policy', CSP);
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('X-Frame-Options', 'DENY');
  }
  return res;
});
