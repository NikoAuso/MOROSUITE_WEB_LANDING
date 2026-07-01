import { describe, it, expect } from 'vitest';
import { buildLocalBusinessJsonLd } from './structured-data';
import type { SitePayload, OpeningHoursPayload } from './dto';

const site = {
  name: 'Piscina Demo',
  tagline: 'Relax estivo',
  contacts: { phone: '+39 010 111', email: 'info@demo.it', whatsapp: null },
  address: {
    street: 'Via Roma 1', locality: 'Genova', region: 'GE',
    postal_code: '16100', country: 'IT', google_maps_url: 'https://maps.example/x',
  },
  social: { instagram: 'https://ig/x', facebook: null, tiktok: null },
} as unknown as SitePayload;

const hours = {
  timezone: 'Europe/Rome',
  daily_hours: [
    { key: 'monday', label: 'Lun', closed: false, intervals: [{ label: '', open: '09:00', close: '19:00' }] },
    { key: 'tuesday', label: 'Mar', closed: true, intervals: [] },
  ],
} as unknown as OpeningHoursPayload;

describe('buildLocalBusinessJsonLd', () => {
  it('maps payload fields and drops nulls', () => {
    const ld = buildLocalBusinessJsonLd(site, hours, 'https://site.test', '/logo.png')!;
    expect(ld['@type']).toBe('LocalBusiness');
    expect(ld.name).toBe('Piscina Demo');
    expect((ld.address as Record<string, unknown>).streetAddress).toBe('Via Roma 1');
    expect(ld.sameAs).toEqual(['https://ig/x']);       // facebook/tiktok null esclusi
    expect(ld.hasMap).toBe('https://maps.example/x');
    const spec = ld.openingHoursSpecification as Array<Record<string, unknown>>;
    expect(spec).toHaveLength(1);                        // solo il giorno aperto
    expect(spec[0].dayOfWeek).toBe('https://schema.org/Monday');
    expect(spec[0].opens).toBe('09:00');
  });

  it('returns null when site is falsy', () => {
    expect(buildLocalBusinessJsonLd(null as unknown as SitePayload, null, 'x', 'y')).toBeNull();
  });
});
