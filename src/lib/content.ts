import { api } from '@/lib/api';
import { siteContent as committedDefault } from '@content';
import type { SiteContent } from '@/lib/sections';

/**
 * The homepage structure, backend-first.
 *
 * `GET /site/content` wins when it returns a usable payload; otherwise —
 * endpoint not implemented, backend down, payload rejected by
 * `normalizeSiteContent`, or demo mode — the committed `site.content.ts`
 * renders instead. Either way the page always has a structure: this can never
 * be the reason a request 503s.
 *
 * Goes through `api.ts`, so backend content shares the same cache TTL and
 * single-flight behaviour as every other endpoint — structure edits go live
 * within `CACHE_TTL_SECONDS` without a redeploy.
 */
export async function resolveSiteContent(): Promise<SiteContent> {
  return (await api.content()) ?? committedDefault;
}
