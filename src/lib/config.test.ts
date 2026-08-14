import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// These tests run the REAL config module (no mock): every api suite mocks
// '@/lib/config' wholesale, so without this file the DEMO_MODE -> 'static'
// derivation was asserted in comments but executed by nothing (review
// 14/08/2026).

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('config dataSource derivation', () => {
  it('DEMO_MODE=true forces dataSource to static and demoMode on', async () => {
    vi.stubEnv('DEMO_MODE', 'true');
    const { config } = await import('./config');
    expect(config.demoMode).toBe(true);
    expect(config.dataSource).toBe('static');
  });

  it('without DEMO_MODE the committed deploy default applies', async () => {
    vi.stubEnv('DEMO_MODE', '');
    const { config } = await import('./config');
    const { siteConfig } = await import('@config');
    expect(config.demoMode).toBe(false);
    expect(config.dataSource).toBe(siteConfig.dataSource);
  });
});
