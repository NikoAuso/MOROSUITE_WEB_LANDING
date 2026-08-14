import type { APIRoute } from 'astro';
import { api } from '@/lib/api';
import { config } from '@/lib/config';
import { siteContent } from '@content';
import { enabledSections } from '@/lib/sections';

export const prerender = false;

async function probeBackendUp(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const upUrl = new URL('/up', config.apiBaseUrl);
    const response = await fetch(upUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

function healthResponse(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ ...body, timestamp: new Date().toISOString() }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export const GET: APIRoute = async () => {
  // The health verdict must follow what the deploy ACTUALLY depends on, not
  // just the deploy-level default: a static deploy where one enabled section
  // opts back into the backend still needs that backend alive (review
  // 14/08/2026 — the earlier deploy-level-only check reported "ok" while the
  // page showed ErrorState). Demo mode forces static everywhere, so it never
  // needs a backend regardless of overrides.
  const dataSections = enabledSections(siteContent.sections).filter(
    (section) => section.type === 'hours' || section.type === 'pricing',
  );
  const needsBackend =
    !config.demoMode &&
    (config.dataSource === 'backend' ||
      dataSections.some((section) => (section.data.source ?? config.dataSource) === 'backend'));

  // Fully static (or demo): data is committed and type-checked, healthy by
  // definition. The backend_* fields stay true for shape stability with
  // process managers.
  if (!needsBackend) {
    return healthResponse({
      status: 'ok',
      backend_reachable: true,
      backend_up: true,
      demo: config.demoMode,
      data_source: config.demoMode ? 'demo' : 'static',
    });
  }

  const [site, backendUp] = await Promise.all([api.site(), probeBackendUp()]);
  const backendReachable = site !== null;
  const status = backendReachable && backendUp ? 'ok' : 'degraded';

  return healthResponse({
    status,
    backend_reachable: backendReachable,
    backend_up: backendUp,
    demo: false,
    // 'mixed' = static deploy default with at least one backend section.
    data_source: config.dataSource === 'backend' ? 'backend' : 'mixed',
  });
};
