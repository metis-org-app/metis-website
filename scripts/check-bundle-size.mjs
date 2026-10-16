// Prints raw / gzip / brotli sizes of the production build and fails when a budget is exceeded.
// Run after `vite build`: `npm run size`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const DIST = new URL('../dist/', import.meta.url).pathname;
const KB = 1024;

/** Budgets: gzip for code, raw for images. */
const BUDGETS = [
  { label: 'JS total (gzip)', match: (f) => f.endsWith('.js'), metric: 'gzip', max: 135 * KB },
  {
    label: 'Avatar chunk (gzip)',
    match: (f) => /assets\/avatar-[\w-]+\.js$/.test(f),
    metric: 'gzip',
    max: 34 * KB,
  },
  { label: 'CSS total (gzip)', match: (f) => f.endsWith('.css'), metric: 'gzip', max: 20 * KB },
  {
    label: 'Metis thumbnail (raw)',
    match: (f) => /metis-thumb[\w.-]*\.png$/.test(f),
    metric: 'raw',
    max: 10 * KB,
  },
  { label: 'Open Graph image (raw)', match: (f) => f.endsWith('og-image.png'), metric: 'raw', max: 300 * KB },
];

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST).map((full) => {
  const buf = readFileSync(full);
  return {
    file: relative(DIST, full),
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf).length,
  };
});

const fmt = (n) => `${(n / KB).toFixed(1)} KB`;
console.log('\nBuild output');
console.table(
  files
    .toSorted((a, b) => b.raw - a.raw)
    .map(({ file, raw, gzip, brotli }) => ({ file, raw: fmt(raw), gzip: fmt(gzip), brotli: fmt(brotli) })),
);

let failed = false;
const rows = BUDGETS.map(({ label, match, metric, max }) => {
  const matched = files.filter((f) => match(f.file));
  const total = matched.reduce((sum, f) => sum + f[metric], 0);
  const ok = total <= max;
  if (!ok) failed = true;
  return {
    budget: label,
    actual: matched.length ? fmt(total) : '—',
    limit: fmt(max),
    status: ok ? 'ok' : 'OVER',
  };
});
console.log('Budgets');
console.table(rows);

if (failed) {
  console.error('Bundle size budget exceeded.');
  process.exit(1);
}
