/* ============================================================================
   Kar-Tel space background — deep space + stars + a Milky Way band.
   Self-contained: no images, no external requests. Injected on every page.
   ----------------------------------------------------------------------------
   SWAP TO YOUR DESK PHOTO later:
     1. Put the photo at  public/img/desk.jpg  (any name/format).
     2. Set BG_IMAGE below to  '/img/desk.jpg'  and redeploy.
   When BG_IMAGE is set, the photo becomes the fixed background (with a dark
   wash so text stays readable) and the starfield is skipped automatically.
   ========================================================================== */
(function () {
  var BG_IMAGE = '';   // '' = animated starfield ·  '/img/desk.jpg' = use a photo

  // ---- base page styling (deep-space gradient behind everything) ----------
  var css = document.createElement('style');
  css.textContent =
    'html{background:radial-gradient(ellipse 130% 90% at 50% -12%,#0c1a2b 0%,#070d17 48%,#04060a 100%) fixed;}' +
    'body{background:transparent !important;}' +
    '#space-bg{position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;}';
  document.head.appendChild(css);

  // ---- photo mode ---------------------------------------------------------
  if (BG_IMAGE) {
    document.documentElement.style.background =
      'linear-gradient(rgba(4,6,10,.64),rgba(4,6,10,.64)), url("' + BG_IMAGE +
      '") center center / cover fixed no-repeat';
    return;
  }

  // ---- starfield mode -----------------------------------------------------
  var canvas = document.createElement('canvas');
  canvas.id = 'space-bg';
  canvas.setAttribute('aria-hidden', 'true');
  (document.body || document.documentElement).appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, stars = [], band = [], raf, resizeTimer;
  var ANGLE = -0.5; // radians — tilt of the Milky Way band

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }

  function build() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // scattered field
    stars = [];
    var count = Math.min(420, Math.round(W * H / 4200));
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * Math.random() * 1.4 + 0.2,
        a: rnd(0.25, 0.9), tw: rnd(0.6, 2.2), ph: Math.random() * 6.283,
        c: Math.random() < 0.12 ? (Math.random() < 0.5 ? '#bcd3ff' : '#ffd9b0') : '#ffffff'
      });
    }
    // denser faint stars clustered along the band
    band = [];
    var bcount = Math.min(320, Math.round(W * H / 5600));
    for (var j = 0; j < bcount; j++) {
      var cx = Math.random() * W;
      var cy = H * 0.30 + Math.tan(ANGLE) * (cx - W * 0.5) + gauss() * H * 0.15;
      band.push({ x: cx, y: cy, r: Math.random() * 0.9 + 0.15, a: rnd(0.1, 0.5), tw: rnd(0.5, 1.8), ph: Math.random() * 6.283 });
    }
  }

  function haze() {
    ctx.save();
    ctx.translate(W * 0.5, H * 0.30);
    ctx.rotate(ANGLE);
    var w = W * 1.7, h = H * 0.5;
    var g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, 'rgba(80,90,160,0)');
    g.addColorStop(0.5, 'rgba(120,110,185,0.10)');
    g.addColorStop(1, 'rgba(80,90,160,0)');
    ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
    var g2 = ctx.createLinearGradient(0, -h * 0.16, 0, h * 0.16);
    g2.addColorStop(0, 'rgba(170,140,190,0)');
    g2.addColorStop(0.5, 'rgba(185,150,195,0.08)');
    g2.addColorStop(1, 'rgba(170,140,190,0)');
    ctx.fillStyle = g2; ctx.fillRect(-w / 2, -h * 0.16, w, h * 0.32);
    ctx.restore();
  }

  function frame(ts) {
    var time = (ts || 0) / 1000, i, s, a;
    ctx.clearRect(0, 0, W, H);
    haze();
    for (i = 0; i < band.length; i++) {
      s = band[i];
      a = s.a * (reduce ? 1 : (0.7 + 0.3 * Math.sin(time * s.tw + s.ph)));
      ctx.globalAlpha = a; ctx.fillStyle = '#dfe8ff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      a = s.a * (reduce ? 1 : (0.6 + 0.4 * Math.sin(time * s.tw + s.ph)));
      ctx.globalAlpha = a; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  function start() {
    build();
    if (reduce) { frame(0); }
    else { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  }

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer); resizeTimer = setTimeout(start, 200);
  });
  start();
})();
