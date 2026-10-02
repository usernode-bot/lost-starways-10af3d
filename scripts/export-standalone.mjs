// Builds export/lost-starways.html: a standalone, offline-playable copy of
// the game. public/index.html is already a single self-contained file (the
// fonts are base64 data URIs, the CSS and JS are inline, sound is generated
// with WebAudio), so the export is that file plus a provenance banner.
//
// The guard below fails the export if the live game ever grows a real
// external asset reference (a hosted stylesheet, script, image, font or a
// network call), so the committed artifact can't silently stop being
// offline-playable. Run it with: npm run export:standalone

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'public', 'index.html'), 'utf8');

const BANNER = `<!--
  LOST STARWAYS - standalone offline export
  Generated from public/index.html by "npm run export:standalone"; do not
  edit this file by hand. Everything (styles, fonts, engine, world data,
  sound) is inline, so opening this file in any browser plays the game with
  no server, no network and no other files. Progress is saved in the
  browser's localStorage under the file's origin. The one external reference
  is a docs link inside the Community Lands panel; it is navigation only.
-->
`;

// Asset references that would break offline play. An <a href> to the docs is
// deliberately NOT on this list: a link a player may click is not a
// dependency the game needs to load or run.
const FORBIDDEN = [
  [/<link\b/i, '<link> tag'],
  [/<script\b[^>]*\bsrc\s*=/i, '<script src=...>'],
  [/<(?:img|audio|video|source|iframe|embed|object|track)\b/i, 'external media/embed tag'],
  [/url\(\s*(?!['"]?\s*data:)/i, 'CSS url() that is not a data: URI'],
  [/@import\b/i, 'CSS @import'],
  [/\bfetch\s*\(/, 'fetch() call'],
  [/\bXMLHttpRequest\b/, 'XMLHttpRequest'],
];

const problems = [];
for (const [re, label] of FORBIDDEN) {
  if (re.test(src)) problems.push(label);
}
if (problems.length) {
  console.error('export failed: public/index.html now references external assets:');
  for (const p of problems) console.error('  - ' + p);
  console.error('Inline them (or make them data: URIs) before exporting.');
  process.exit(1);
}

if (!/^<!doctype html>/i.test(src)) {
  console.error('export failed: public/index.html does not start with a doctype');
  process.exit(1);
}

// Banner goes between the doctype and <html>, which keeps standards mode.
const out = src.replace(/^<!doctype html>\n/, (m) => m + BANNER);

mkdirSync(join(root, 'export'), { recursive: true });
const dest = join(root, 'export', 'lost-starways.html');
writeFileSync(dest, out);
console.log(`wrote ${dest} (${out.length} bytes)`);
