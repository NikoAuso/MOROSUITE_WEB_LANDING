import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Convert a raw markdown body (as served by /api/public/v1/legal/{doc}) into
 * trusted HTML. The core's markdown sources are authored by us — no user
 * input — so we do not run a DOMPurify pass.
 */
export function renderLegalMarkdown(body: string): string {
  return marked.parse(body) as string;
}
