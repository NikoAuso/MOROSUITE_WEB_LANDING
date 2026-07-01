import type { SitePayload, OpeningHoursPayload } from '@/lib/dto';

const DAY_MAP: Record<string, string> = {
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
};

/** Drop null/undefined/empty-string entries from a flat object. */
function compact(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  );
}

export function buildLocalBusinessJsonLd(
  site: SitePayload,
  hours: OpeningHoursPayload | null,
  siteUrl: string,
  logoUrl: string,
): Record<string, unknown> | null {
  if (!site) return null;

  const address = compact({
    '@type': 'PostalAddress',
    streetAddress: site.address?.street,
    addressLocality: site.address?.locality,
    addressRegion: site.address?.region,
    postalCode: site.address?.postal_code,
    addressCountry: site.address?.country,
  });

  const sameAs = [site.social?.instagram, site.social?.facebook, site.social?.tiktok].filter(
    (v): v is string => Boolean(v),
  );

  const spec = (hours?.daily_hours ?? [])
    .filter((d) => !d.closed && d.intervals.length > 0 && DAY_MAP[d.key])
    .flatMap((d) =>
      d.intervals.map((iv) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_MAP[d.key],
        opens: iv.open,
        closes: iv.close,
      })),
    );

  return compact({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.tagline,
    url: siteUrl,
    logo: logoUrl,
    telephone: site.contacts?.phone,
    email: site.contacts?.email,
    address: Object.keys(address).length > 1 ? address : undefined,
    hasMap: site.address?.google_maps_url,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    openingHoursSpecification: spec.length > 0 ? spec : undefined,
  });
}
