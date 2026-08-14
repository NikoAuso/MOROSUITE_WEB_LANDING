import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// The theming surface is the semantic token block in src/styles/tokens.css.
// Visual identity in components must go through the brand-, cta- and accent-
// utilities: a raw sky-/green-/yellow-/amber- class reintroduces the
// "identity compiled into src/" wall the 14/08/2026 audit flagged (68
// hardcoded occurrences at its peak). Neutral slate/gray and the semantic
// status colours in RuleGroups' TONES map are the only sanctioned literals.
const ROOTS = ['src/components', 'src/layouts', 'src/pages'];
const RAW_IDENTITY = /\b(?:sky|yellow|amber)-\d|green-(?:50|[678]\d\d)\b/;
const TONES_LINE = /bullet: 'bg-green-700', badge: 'bg-green-100 text-green-800'/;

const astroFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? astroFiles(join(dir, entry.name))
      : entry.name.endsWith('.astro')
        ? [join(dir, entry.name)]
        : [],
  );

describe('semantic theme tokens', () => {
  it('no component carries raw identity hues outside the sanctioned TONES map', () => {
    const offenders: string[] = [];
    for (const root of ROOTS) {
      for (const file of astroFiles(root)) {
        for (const [index, line] of readFileSync(file, 'utf8').split('\n').entries()) {
          if (RAW_IDENTITY.test(line) && !TONES_LINE.test(line)) {
            offenders.push(`${file}:${index + 1}: ${line.trim().slice(0, 80)}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('every semantic step the markup uses is defined in tokens.css', () => {
    // A used-but-undefined step is silent breakage: Tailwind simply does not
    // generate the utility and the style vanishes (this caught a real one —
    // border-brand-300/30 rendered borderless while brand-300 was missing).
    const css = readFileSync('src/styles/tokens.css', 'utf8');
    const used = new Set<string>();
    for (const root of ROOTS) {
      for (const file of astroFiles(root)) {
        for (const match of readFileSync(file, 'utf8').matchAll(/\b(brand|cta|accent)-(\d+)\b/g)) {
          used.add(`--color-${match[1]}-${match[2]}`);
        }
      }
    }
    expect(used.size).toBeGreaterThan(0);
    const missing = [...used].filter((token) => !css.includes(`${token}:`));
    expect(missing).toEqual([]);
    for (const glow of ['--hero-glow-a', '--hero-glow-b']) {
      expect(css).toContain(glow);
    }
  });
});
