/**
 * Regenerates the README screenshots into .github/screenshots/.
 *
 * Shoots the /demo/<preset> showcase routes, so what lands in the README is
 * exactly what the presets render — no separate fixture to drift from.
 *
 *   npm run build && npm run screenshots
 *
 * Boots its own SSR server in DEMO_MODE on PORT (default 4399). JPEG, because
 * a full-page PNG of a landing is ~1.2 MB and this repo is not a photo album.
 */
import { spawn } from 'node:child_process';
import { mkdir, readdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 4399);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = '.github/screenshots';
const QUALITY = 70;
// Full-page shots are ~5000px tall; they carry the extra compression.
const QUALITY_FULL = 55;

// One component shot per preset that shows it at its best. Anchors come from
// the presets' committed structure: a renamed anchor fails loudly here rather
// than silently shipping a stale README.
const COMPONENTS = [
  ['piscina', 'piscina', 'features'],
  ['piscina', 'orari', 'hours'],
  ['piscina', 'prezzi', 'pricing'],
  ['piscina', 'regolamento', 'rules'],
  ['piscina', 'bar', 'highlight'],
  ['piscina', 'recensioni', 'testimonials'],
  ['piscina', 'faq', 'faq'],
  ['piscina', 'dove-siamo', 'location'],
  ['ristorazione', 'menu', 'menu'],
  ['ristorazione', 'galleria', 'gallery'],
  ['ristorazione', 'storia', 'story'],
  ['ristorazione', 'servizi', 'services'],
  ['hotel', 'camere', 'rooms'],
];

const server = spawn('node', ['./dist/server/entry.mjs'], {
  // HOST pinned: the adapter's default binds "localhost", which resolves to
  // ::1 here while Playwright dials 127.0.0.1 — connection refused.
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(PORT), DEMO_MODE: 'true' },
  stdio: 'ignore',
});
process.on('exit', () => server.kill());

const browser = await chromium.launch();
try {
  await mkdir(OUT, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Wait for the server to bind rather than sleeping a fixed amount.
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(`${BASE}/health`);
      break;
    } catch (error) {
      if (attempt === 40) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  // The cookie banner overlays the fold on every shot; hide it, don't dismiss
  // it (dismissing writes localStorage and changes what the page renders).
  const hideBanner = () => page.addStyleTag({ content: '#cookie-banner{display:none!important}' });

  const presets = (await readdir('presets', { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const preset of presets) {
    await page.goto(`${BASE}/demo/${preset}`);
    await hideBanner();
    await page.screenshot({
      path: `${OUT}/preset-${preset}.jpg`,
      type: 'jpeg',
      quality: QUALITY_FULL,
      fullPage: true,
    });
    // The hero is the poster frame: viewport-only, above the fold.
    await page.screenshot({ path: `${OUT}/hero-${preset}.jpg`, type: 'jpeg', quality: QUALITY });
    console.log(`preset-${preset}.jpg`);
  }

  let current = null;
  for (const [preset, anchor, name] of COMPONENTS) {
    if (current !== preset) {
      await page.goto(`${BASE}/demo/${preset}`);
      await hideBanner();
      current = preset;
    }
    const element = await page.$(`section#${anchor}`);
    if (!element) throw new Error(`preset "${preset}" has no section#${anchor}`);
    await element.scrollIntoViewIfNeeded();
    await element.screenshot({
      path: `${OUT}/section-${name}.jpg`,
      type: 'jpeg',
      quality: QUALITY,
    });
    console.log(`section-${name}.jpg`);
  }
} finally {
  await browser.close();
  server.kill();
}
