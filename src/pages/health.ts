import type { APIRoute } from 'astro';
import { api } from '@/lib/api';
import { config } from '@/lib/config';

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
  // In demo mode there is no external backend: data is served from
  // src/lib/demo-data.ts, so the app is healthy by definition. Skip the /up
  // probe (it would always fail and report a misleading "degraded").
  if (config.demoMode) {
    return healthResponse({
      status: 'ok',
      backend_reachable: true,
      backend_up: true,
      demo: true,
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
  });
};
