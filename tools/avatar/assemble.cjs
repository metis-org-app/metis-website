// Assemble the Metis avatar SVG with expressions.
// Expressions: happy (original), listening, thinking, reviewing, guiding, celebrating.
const fs = require('fs');
const path = require('path');
const P = JSON.parse(fs.readFileSync(path.join(__dirname, 'parts.json'), 'utf8'));
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const css = `.mt{--mt-ink:#141414;--mt-paper:#FFFFFF;--mt-gold:#D0AE78;--mt-gold-hi:#F6E2B4;--mt-gold-dark:#6A4A1C;--mt-gray:#C2BFBB;--mt-spark:var(--mt-ink);--mt-blush:#F3A79B}
.mt path{fill-rule:evenodd}.mt .i{fill:var(--mt-ink)}.mt .p{fill:var(--mt-paper)}.mt .g{fill:var(--mt-gold)}.mt .gd{fill:var(--mt-gold-dark)}.mt .gr{fill:var(--mt-gray)}.mt .s{fill:var(--mt-spark)}
.mt .st{fill:none;stroke:var(--mt-ink);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.mt .stg{fill:none;stroke:var(--mt-gold);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.mt .hl{fill:var(--mt-paper)}.mt .bl{fill:var(--mt-blush);opacity:.6}
.mt .mx{display:none}
.mt.mt-e-happy .mx-happy,.mt.mt-e-listening .mx-listening,.mt.mt-e-thinking .mx-thinking,.mt.mt-e-reviewing .mx-reviewing,.mt.mt-e-guiding .mx-guiding,.mt.mt-e-celebrating .mx-celebrating,.mt:not([class*="mt-e-"]) .mx-happy{display:inline}
@keyframes mt-breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes mt-owl{0%,58%,100%{transform:rotate(0)}64%{transform:rotate(-6deg)}70%{transform:rotate(3deg)}76%{transform:rotate(0)}}
@keyframes mt-owl-think{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes mt-owl-hop{0%,100%{transform:translateY(0)}30%{transform:translateY(-22px) rotate(-4deg)}55%{transform:translateY(0)}70%{transform:translateY(-8px)}85%{transform:translateY(0)}}
@keyframes mt-blink{0%,88%,100%{transform:scaleY(0)}92%,95%{transform:scaleY(1)}}
@keyframes mt-eyeblink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}
@keyframes mt-twinkle{0%,100%{opacity:.35;transform:scale(.6) rotate(0)}50%{opacity:1;transform:scale(1.12) rotate(12deg)}}
@keyframes mt-float-l{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(4px,-12px) rotate(-5deg)}}
@keyframes mt-float-r{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-4px,-10px) rotate(5deg)}}
@keyframes mt-glint{0%,62%,100%{fill:var(--mt-gold)}74%{fill:var(--mt-gold-hi)}}
@keyframes mt-talk{0%{transform:scaleY(1)}20%{transform:scaleY(.55)}40%{transform:scaleY(.95)}60%{transform:scaleY(.5)}80%{transform:scaleY(.85)}100%{transform:scaleY(1)}}
@keyframes mt-dot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-12px);opacity:1}}
@keyframes mt-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes mt-line{0%,10%{transform:scaleX(0)}35%,85%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes mt-glass{0%,70%,100%{opacity:0;transform:translate(-14px,14px)}80%{opacity:.9}90%{opacity:0;transform:translate(14px,-14px)}}
@keyframes mt-pop{0%,100%{transform:scale(.2) rotate(0);opacity:0}25%{transform:scale(1.15) rotate(40deg);opacity:1}60%{transform:scale(1) rotate(90deg);opacity:1}85%{transform:scale(.6) rotate(140deg);opacity:0}}
@keyframes mt-check{0%,15%{stroke-dashoffset:120}45%,85%{stroke-dashoffset:0}100%{stroke-dashoffset:120}}
.mt-body{animation:mt-breathe 5.5s ease-in-out infinite}
.mt-owl{transform-origin:930px 766px;animation:mt-owl 7s ease-in-out infinite}
.mt-lid{transform-box:fill-box;transform-origin:50% 0%;animation:mt-blink 5s ease-in-out infinite}
.mt-open{transform-box:fill-box;transform-origin:center;animation:mt-eyeblink 4.2s ease-in-out infinite}
.mt-spark{transform-box:fill-box;transform-origin:center;animation:mt-twinkle 3.2s ease-in-out infinite}
.mt-book-l{transform-box:fill-box;transform-origin:center;animation:mt-float-l 6.5s ease-in-out infinite}
.mt-book-r{transform-box:fill-box;transform-origin:center;animation:mt-float-r 7.5s ease-in-out infinite}
.mt-leaf{animation:mt-glint 5s ease-in-out infinite}
.mt-mouth{transform-box:fill-box;transform-origin:50% 15%}
.mt-dot{transform-box:fill-box;transform-origin:center;animation:mt-dot 1.2s ease-in-out infinite}
.mt-bubble{animation:mt-bob 3s ease-in-out infinite}
.mt-line{transform-box:fill-box;transform-origin:0% 50%;animation:mt-line 2.4s ease-in-out infinite}
.mt-glare{animation:mt-glass 3.6s ease-in-out infinite}
.mt-confetti{transform-box:fill-box;transform-origin:center;animation:mt-pop 2.2s ease-out infinite}
.mt-check{stroke-dasharray:120;stroke-dashoffset:120;animation:mt-check 3s ease-in-out infinite}
.mt.mt-e-guiding .mt-mouth,.mt.mt-talking .mt-mouth{animation:mt-talk .9s ease-in-out infinite}
.mt.mt-e-thinking .mt-owl,.mt.mt-thinking .mt-owl{animation:mt-owl-think 1.8s ease-in-out infinite}
.mt.mt-e-thinking .mt-spark,.mt.mt-thinking .mt-spark{animation-duration:1.1s}
.mt.mt-e-thinking .mt-leaf{animation-duration:1.6s}
.mt.mt-e-celebrating .mt-owl{animation:mt-owl-hop 1.4s ease-in-out infinite}
.mt.mt-e-celebrating .mt-spark{animation-duration:.9s}
.mt.mt-e-celebrating .mt-leaf{animation-duration:1.2s}
.mt.mt-e-reviewing .mt-owl{animation-duration:11s}
@media (prefers-reduced-motion:reduce){.mt *{animation:none!important}.mt .mt-check{stroke-dashoffset:0}}`;

const EL = [485, 480];   // left eye centre
const ER = [678, 482];   // right eye centre

const openEyes = (dx, dy, ry, cls) => [EL, ER].map(([x, y], k) => {
  const cx = x + dx, cy = y + dy;
  const lash = k === 0
    ? `<path class="st" d="M${x - 20} ${y - 16}l-11 -8M${x - 23} ${y - 4}l-13 -2"></path>`
    : `<path class="st" d="M${x + 20} ${y - 16}l11 -8M${x + 23} ${y - 4}l13 -2"></path>`;
  return `<g class="${cls}"><ellipse class="i" cx="${cx}" cy="${cy}" rx="18" ry="${ry}"></ellipse><circle class="hl" cx="${cx + 6}" cy="${cy - 9}" r="6.5"></circle><circle class="hl" cx="${cx - 6}" cy="${cy + 9}" r="3"></circle></g>${lash}`;
}).join('');

function features() {
  let s = '';
  // original parts
  s += `<g class="mx mx-happy mx-celebrating"><path class="i" d="${P.eyeL}"></path><path class="i" d="${P.eyeR}"></path></g>`;
  s += `<g class="mx mx-happy mx-listening mx-celebrating"><path class="i" d="${P.browL}"></path><path class="i" d="${P.browRcut}"></path></g>`;
  s += `<g class="mx mx-happy mx-guiding mx-celebrating"><path class="i mt-mouth" d="${P.mouth}"></path></g>`;
  // open eyes (listening, guiding)
  s += `<g class="mx mx-listening mx-guiding">${openEyes(0, 0, 23, 'mt-open')}</g>`;
  // thinking eyes look up and to the side
  s += `<g class="mx mx-thinking">${openEyes(7, -8, 22, 'mt-open')}</g>`;
  // reviewing: lowered lids looking down
  s += `<g class="mx mx-reviewing">` + [EL, ER].map(([x, y]) =>
    `<path class="i" d="M${x - 15} ${y} A18 17 0 0 0 ${x + 18} ${y} Z"></path><path class="st" d="M${x - 22} ${y}L${x + 22} ${y}"></path>`).join('') + `</g>`;
  // brows
  s += `<g class="mx mx-thinking"><path class="st" d="M458 394Q480 380 503 391"></path><path class="st" d="M663 418Q683 412 703 419"></path></g>`;
  s += `<g class="mx mx-reviewing"><path class="st" d="M460 410Q480 403 501 409"></path><path class="st" d="M663 413Q683 406 703 412"></path></g>`;
  s += `<g class="mx mx-guiding"><path class="st" d="M458 401Q480 389 502 399"></path><path class="st" d="M662 405Q683 393 704 405"></path></g>`;
  // mouths
  s += `<g class="mx mx-listening mx-reviewing"><path class="st" d="M558 553Q578 568 598 553"></path></g>`;
  s += `<g class="mx mx-thinking"><path class="st" d="M561 562Q575 555 592 559"></path><path class="st" d="M595 556l6 -3"></path></g>`;
  // reading glasses (reviewing)
  s += `<g class="mx mx-reviewing"><circle cx="${EL[0]}" cy="${EL[1]}" r="34" style="fill:var(--mt-paper);fill-opacity:.18;stroke:var(--mt-ink);stroke-width:7"></circle><circle cx="${ER[0]}" cy="${ER[1]}" r="34" style="fill:var(--mt-paper);fill-opacity:.18;stroke:var(--mt-ink);stroke-width:7"></circle><path class="st" d="M519 478Q581 462 644 480"></path><path class="st" d="M451 474L426 466"></path><path class="st" d="M712 476L737 468"></path>`
    + [EL, ER].map(([x, y]) => `<path class="mt-glare" d="M${x - 12} ${y + 10}L${x + 10} ${y - 12}" style="stroke:var(--mt-paper);stroke-width:5;stroke-linecap:round;fill:none"></path>`).join('') + `</g>`;
  // blush + confetti (celebrating)
  s += `<g class="mx mx-celebrating"><ellipse class="bl" cx="452" cy="522" rx="26" ry="13"></ellipse><ellipse class="bl" cx="703" cy="527" rx="26" ry="13"></ellipse></g>`;
  return s;
}

function accessories() {
  let s = '';
  // thought bubble (thinking)
  s += `<g class="mx mx-thinking"><g class="mt-bubble"><circle cx="868" cy="300" r="11" style="fill:var(--mt-paper);stroke:var(--mt-ink);stroke-width:6"></circle><circle cx="900" cy="262" r="17" style="fill:var(--mt-paper);stroke:var(--mt-ink);stroke-width:6"></circle>`
    + `<path d="M935 225c-28 0-40-30-18-46c-8-30 30-46 50-28c14-26 56-22 62 6c30-4 44 30 24 46c18 22-6 50-32 40c-14 22-54 22-62 0c-10 4-20 -4-24-18z" style="fill:var(--mt-paper);stroke:var(--mt-ink);stroke-width:6;stroke-linejoin:round"></path>`
    + [0, 1, 2].map((k) => `<circle class="mt-dot" cx="${962 + k * 30}" cy="196" r="8" style="fill:var(--mt-ink);animation-delay:${k * 0.18}s"></circle>`).join('') + `</g></g>`;
  // speech bubble (guiding)
  s += `<g class="mx mx-guiding"><g class="mt-bubble"><path d="M932 150h150a26 26 0 0 1 26 26v62a26 26 0 0 1-26 26h-96l-44 36l10-36h-20a26 26 0 0 1-26-26v-62a26 26 0 0 1 26-26z" style="fill:var(--mt-paper);stroke:var(--mt-ink);stroke-width:6;stroke-linejoin:round"></path>`
    + [[946, 186, 120], [946, 212, 96], [946, 238, 62]].map(([x, y, w], k) => `<rect class="mt-line" x="${x}" y="${y - 6}" width="${w}" height="12" rx="6" style="fill:var(--mt-gold);animation-delay:${k * 0.25}s"></rect>`).join('') + `</g></g>`;
  // confetti burst (celebrating)
  const C = [[330, 150, 0], [420, 95, 1], [560, 70, 2], [700, 90, 3], [830, 140, 4], [255, 260, 5], [905, 250, 6], [380, 60, 7]];
  s += `<g class="mx mx-celebrating">` + C.map(([x, y, k]) => k % 2
    ? `<rect class="mt-confetti" x="${x - 16}" y="${y - 8}" width="32" height="16" rx="4" style="fill:var(--mt-gold);animation-delay:${(k * 0.27).toFixed(2)}s"></rect>`
    : `<path class="mt-confetti" d="M${x} ${y - 22}L${x + 6} ${y - 6}L${x + 22} ${y}L${x + 6} ${y + 6}L${x} ${y + 22}L${x - 6} ${y + 6}L${x - 22} ${y}L${x - 6} ${y - 6}Z" style="fill:var(--mt-gold-dark);animation-delay:${(k * 0.27).toFixed(2)}s"></path>`).join('') + `</g>`;
  return s;
}

const lids = [[907, 650], [953.5, 652]];
function body() {
  let s = '';
  s += `<g class="mt-sparks">` + P.sparks.map((k, i) => `<path class="s mt-spark" style="animation-delay:${(i * 0.37 % 3.2).toFixed(2)}s" d="${k.d}"></path>`).join('') + `</g>`;
  s += `<g class="mt-body"><path class="p" d="${P.paper}"></path><path class="gr" d="${P.figGray}"></path><path class="i" d="${P.figInk}"></path>`;
  s += features();
  s += `<g class="mt-laurel">` + P.leaves.map((l, i) => `<path class="g mt-leaf" style="animation-delay:${(i * 0.11).toFixed(2)}s" d="${l.d}"></path>`).join('') + `<path class="g" d="${P.leafBits}"></path><path class="gd" d="${P.laurelLine}"></path></g></g>`;
  s += `<g class="mt-owl"><path class="p" d="${P.owl.paper}"></path><path class="g" d="${P.owl.fill}"></path><path class="gd" d="${P.owl.dark}"></path><path class="i" d="${P.owl.ink}"></path>` + lids.map(([x, y], i) => `<g class="mt-lid" style="animation-delay:${i * 0.04}s"><ellipse class="g" cx="${x}" cy="${y}" rx="21.5" ry="21.5"></ellipse><path class="gd" d="M${x - 17} ${y + 3}q17 10 34 0q-17 5-34 0z"></path></g>`).join('') + `</g>`;
  s += `<g class="mt-book-l"><path class="p" d="${P.bookL.paper}"></path><path class="gr" d="${P.bookL.gray}"></path><path class="i" d="${P.bookL.ink}"></path><g class="mx mx-reviewing"><circle cx="205" cy="392" r="24" style="fill:var(--mt-paper);stroke:var(--mt-gold);stroke-width:6"></circle><path class="mt-check" d="M193 392l9 9l17 -19" style="fill:none;stroke:var(--mt-gold);stroke-width:7;stroke-linecap:round;stroke-linejoin:round"></path></g></g>`;
  s += `<g class="mt-book-r"><path class="p" d="${P.bookR.paper}"></path><path class="gr" d="${P.bookR.gray}"></path><path class="i" d="${P.bookR.ink}"></path></g>`;
  s += accessories();
  return s;
}

const inner = body();
fs.writeFileSync(path.join(OUT, 'metis-avatar-inner.svgfrag'), inner);
fs.writeFileSync(path.join(OUT, 'metis-avatar.css'), css);
const wrap = (expr, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" class="mt mt-e-${expr}" viewBox="0 0 1192 1168" role="img" aria-label="Metis, the AI guide"${extra}><title>Metis</title><style>${css}</style>${inner}</svg>`;
fs.writeFileSync(path.join(OUT, 'metis-avatar.svg'), wrap('happy'));
const EX = ['happy', 'listening', 'thinking', 'reviewing', 'guiding', 'celebrating'];
fs.writeFileSync(path.join(OUT, 'expressions.html'), `<!doctype html><meta charset="utf-8"><style>body{margin:0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px;background:#ddd;font:14px sans-serif}figure{margin:0;background:#fff}figcaption{padding:4px 8px}</style>` + EX.map((e) => `<figure>${wrap(e, ' width="100%"')}<figcaption>${e}</figcaption></figure>`).join(''));
console.log('inner bytes', inner.length);
