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

export const GET: APIRoute = async () => {
  const [site, backendUp] = await Promise.all([api.site(), probeBackendUp()]);
  const backendReachable = site !== null;
  const status = backendReachable && backendUp ? 'ok' : 'degraded';

  return new Response(
    JSON.stringify({
      status,
      backend_reachable: backendReachable,
      backend_up: backendUp,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
};
