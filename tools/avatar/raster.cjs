// Generates raster assets from source/avatar.png:
//   src/assets/metis-thumb.png  96 px grayscale thumbnail (small avatars in chat, spec, pipeline)
//   public/og-image.png         1200×630 social card
//   public/favicon-32.png, public/apple-touch-icon.png  logo-mark icons
// Requires `npm ci` in tools/avatar (pngjs).
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..', '..');
const src = PNG.sync.read(fs.readFileSync(path.join(__dirname, 'source', 'avatar.png')));

const INK = [0x11, 0x11, 0x11];
const ACCENT = [0xc9, 0x32, 0x1f];
const BG = [0xf3, 0xf2, 0xee];
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

/** Area-average downscale of a source rectangle into a dw×dh RGBA buffer. */
function resize(img, sx, sy, sw, sh, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const y0 = sy + Math.floor((y * sh) / dh);
    const y1 = Math.max(y0 + 1, sy + Math.floor(((y + 1) * sh) / dh));
    for (let x = 0; x < dw; x++) {
      const x0 = sx + Math.floor((x * sw) / dw);
      const x1 = Math.max(x0 + 1, sx + Math.floor(((x + 1) * sw) / dw));
      const acc = [0, 0, 0, 0];
      let n = 0;
      for (let yy = y0; yy < y1; yy++)
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * img.width + xx) * 4;
          for (let k = 0; k < 4; k++) acc[k] += img.data[i + k];
          n++;
        }
      const o = (y * dw + x) * 4;
      for (let k = 0; k < 4; k++) out[o + k] = Math.round(acc[k] / n);
    }
  }
  return out;
}

function write(file, width, height, data, options = {}) {
  const png = new PNG({ width, height });
  data.copy(png.data);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png, options));
  console.log(`${path.relative(ROOT, file)}  ${width}×${height}  ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}

function fill(width, height, rgb) {
  const buf = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) buf.set([...rgb, 255], i * 4);
  return buf;
}

function rect(buf, width, x, y, w, h, rgb) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) buf.set([...rgb, 255], (yy * width + xx) * 4);
}

// 1) Thumbnail: centred square crop, grayscale with a touch of contrast.
{
  const side = Math.min(src.width, src.height);
  const sx = Math.floor((src.width - side) / 2);
  const sy = Math.floor((src.height - side) / 2);
  const size = 96;
  const px = resize(src, sx, sy, side, side, size, size);
  for (let i = 0; i < size * size; i++) {
    const g = clamp((lum(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]) - 128) * 1.05 + 128);
    px.set([g, g, g, 255], i * 4);
  }
  write(path.join(ROOT, 'src', 'assets', 'metis-thumb.png'), size, size, px, { colorType: 0 });
}

// 2) Open Graph card: logo mark + avatar on the site background (light pixels keyed out).
{
  const W = 1200;
  const H = 630;
  const canvas = fill(W, H, BG);
  rect(canvas, W, 80, 80, 120, 120, INK);
  rect(canvas, W, 80 + 120 - 12 - 44, 80 + 120 - 12 - 44, 44, 44, ACCENT);
  rect(canvas, W, 0, H - 12, W, 12, ACCENT);
  const ah = 590;
  const aw = Math.round((src.width * ah) / src.height);
  const ax = W - aw - 40;
  const ay = 14;
  const art = resize(src, 0, 0, src.width, src.height, aw, ah);
  for (let y = 0; y < ah; y++)
    for (let x = 0; x < aw; x++) {
      const i = (y * aw + x) * 4;
      const l = lum(art[i], art[i + 1], art[i + 2]);
      const a = l > 232 ? 0 : l < 200 ? 1 : (232 - l) / 32;
      const o = ((ay + y) * W + (ax + x)) * 4;
      for (let k = 0; k < 3; k++) canvas[o + k] = clamp(art[i + k] * a + canvas[o + k] * (1 - a));
    }
  write(path.join(ROOT, 'public', 'og-image.png'), W, H, canvas, { colorType: 2 });
}

// 3) Icons: the logo mark (ink square with the accent corner), same proportions as favicon.svg.
for (const [file, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
]) {
  const icon = fill(size, size, INK);
  const corner = Math.round((size * 11) / 32);
  const offset = Math.round((size * 18) / 32);
  rect(icon, size, offset, offset, corner, corner, ACCENT);
  write(path.join(ROOT, 'public', file), size, size, icon, { colorType: 2 });
}
