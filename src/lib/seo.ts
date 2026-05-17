import { config } from './config';
import type { SeoPayload } from './dto';

/**
 * Replace the {{SITE_URL}} / {{OG_IMAGE_URL}} placeholders that the API
 * returns with the deploy's actual URLs, then JSON-stringify ready for
 * <script type="application/ld+json"> insertion.
 */
export function resolveStructuredData(seo: SeoPayload): string {
  const ogImageAbsolute = `${config.siteUrl}${config.brand.ogImageUrl}`;
  const resolved = {
    ...seo,
    url: config.siteUrl,
    image: [ogImageAbsolute],
  };
  return JSON.stringify(resolved);
}
