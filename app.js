(function () {
  "use strict";

  var CX = 500, CY = 500, R = 400;

  // ── Helpers ──
  function reduce(n) {
    n = Math.abs(Math.round(n));
    while (n > 22) { var s = 0, t = n; while (t > 0) { s += t % 10; t = Math.floor(t / 10); } n = s; }
    return n;
  }

  function calculateMatrix(day, month, year) {
    var A = reduce(day), B = month;
    var V = reduce(String(year).split("").reduce(function (s, d) { return s + parseInt(d); }, 0));
    var G = reduce(A + B + V), K = reduce(A + B + V + G);
    var S = reduce(A + B), T = reduce(B + V), P = reduce(V + G), Rp = reduce(G + A);
    var A2 = reduce(A + K), A1 = reduce(A2 + A), A3 = reduce(A2 + K);
    var B2 = reduce(B + K), B1 = reduce(B2 + B), B3 = reduce(B2 + K);
    var V2 = reduce(V + K), V1 = reduce(V2 + V);
    var S2 = reduce(K + S), S1 = reduce(S + S2);
    var T2 = reduce(T + K), T1 = reduce(T + T2);
    var P2 = reduce(P + K), P1 = reduce(P + P2);
    var R2 = reduce(K + Rp), R1 = reduce(R2 + Rp);
    var Zh = reduce(K + G), Z = reduce(Zh + G);
    var M = reduce(Zh + V2), D = reduce(M + V2), I = reduce(M + Zh);
    var E = reduce(A + S), Ya = reduce(A + E), F = reduce(A + Ya);
    var Kh = reduce(E + Ya), Yu = reduce(S + E), Ts = reduce(S + Yu), Sh = reduce(E + Yu);
    var sky = reduce(B + G), earth = reduce(A + V), Z1 = reduce(sky + earth);
    var mP = reduce(S + P), zhP = reduce(Rp + T), Z2 = reduce(mP + zhP), Z3 = reduce(Z1 + Z2);
    return {
      A: A, B: B, V: V, G: G, K: K, S: S, T: T, P: P, Rp: Rp,
      A1: A1, A2: A2, A3: A3, B1: B1, B2: B2, B3: B3, V1: V1, V2: V2,
      S1: S1, S2: S2, T1: T1, T2: T2, P1: P1, P2: P2, R1: R1, R2: R2,
      Zh: Zh, Z: Z, M: M, D: D, I: I, E: E, Ya: Ya, F: F, Kh: Kh, Yu: Yu, Ts: Ts, Sh: Sh,
      sky: sky, earth: earth, Z1: Z1, mP: mP, zhP: zhP, Z2: Z2, Z3: Z3
    };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPt(a, b, t) { return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; }

  // ── Exact Position Map ──
  function getPositions() {
    var A = { x: 100, y: 500 };
    var B = { x: 500, y: 100 };
    var V = { x: 900, y: 500 };
    var G = { x: 500, y: 900 };
    var S = { x: 217, y: 217 };
    var T = { x: 783, y: 217 };
    var P = { x: 783, y: 783 };
    var Rp = { x: 217, y: 783 };
    var K = { x: 500, y: 500 };

    return {
      A: A, B: B, V: V, G: G, K: K,
      S: S, T: T, P: P, Rp: Rp,

      // Left horizontal
      A1: { x: 183, y: 500 },
      A2: { x: 252, y: 500 },
      A3: { x: 383, y: 500 },

      // Top vertical — even spacing between chakra circles
      B1: { x: 500, y: 200 },
      B2: { x: 500, y: 290 },
      B3: { x: 500, y: 393 },

      // Right horizontal
      Z2p: { x: 565, y: 500 },
      Z1p: { x: 618, y: 500 },
      V2: { x: 685, y: 500 },
      V1: { x: 808, y: 500 },

      // Diagonals — 21% and 38% from corner
      S1: lerpPt(S, K, 0.21),
      S2: lerpPt(S, K, 0.38),
      T1: lerpPt(T, K, 0.21),
      T2: lerpPt(T, K, 0.38),
      P1: lerpPt(P, K, 0.21),
      P2: lerpPt(P, K, 0.38),
      R1: lerpPt(Rp, K, 0.21),
      R2: lerpPt(Rp, K, 0.38),

      // Bottom vertical — Zh/Z closer to center cluster
      Zh: { x: 500, y: 660 },
      Z: { x: 500, y: 705 },

      // Center cluster — nearly on vertical center line
      D: { x: 512, y: 524 },
      M: { x: 506, y: 548 },
      I: { x: 502, y: 574 }
    };
  }

  // ── Pulsating energy positions ──
  function pulsatingPositions(p) {
    var pts = [];
    // A→S edge: 4 points at 20/40/60/80%
    var asNames = ["F", "Ya", "E", "Kh"];
    var asPercents = [0.20, 0.40, 0.60, 0.80];
    for (var i = 0; i < asNames.length; i++) {
      pts.push({ key: asNames[i], x: lerp(p.A.x, p.S.x, asPercents[i]), y: lerp(p.A.y, p.S.y, asPercents[i]) });
    }
    // S→B edge: 3 points at 25/50/75%
    var sbNames = ["Yu", "Ts", "Sh"];
    var sbPercents = [0.25, 0.50, 0.75];
    for (var j = 0; j < sbNames.length; j++) {
      pts.push({ key: sbNames[j], x: lerp(p.S.x, p.B.x, sbPercents[j]), y: lerp(p.S.y, p.B.y, sbPercents[j]) });
    }
    return pts;
  }

  // ── Color mixing helper ──
  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  }

  function lighten(hex, pct) {
    var c = hexToRgb(hex);
    return rgbToHex(
      c[0] + (255 - c[0]) * pct,
      c[1] + (255 - c[1]) * pct,
      c[2] + (255 - c[2]) * pct
    );
  }

  // ── SVG <defs> — gradients + filters ──
  function svgDefs() {
    var GOLD = "#c9a96a";
    var s = '<defs>';

    // Central radial glow behind K
    s += '<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">';
    s += '<stop offset="0%" stop-color="#f1c40f" stop-opacity="0.20"/>';
    s += '<stop offset="100%" stop-color="#f1c40f" stop-opacity="0"/>';
    s += '</radialGradient>';

    // Chakra color definitions
    var chakraColors = [
      ["purple", "#9b59b6"],
      ["blue", "#2980b9"],
      ["cyan", "#17a2b8"],
      ["green", "#27ae60"],
      ["yellow", "#f1c40f"],
      ["orange", "#e67e22"],
      ["red", "#c0392b"]
    ];

    for (var i = 0; i < chakraColors.length; i++) {
      var name = chakraColors[i][0];
      var color = chakraColors[i][1];
      var light = lighten(color, 0.30);

      // Radial gradient: lighter center → full color at edge
      s += '<radialGradient id="grad_' + name + '" cx="50%" cy="50%" r="50%">';
      s += '<stop offset="0%" stop-color="' + light + '"/>';
      s += '<stop offset="100%" stop-color="' + color + '"/>';
      s += '</radialGradient>';

      // Glow filter: feGaussianBlur stdDeviation=5, colored, 40% opacity
      s += '<filter id="glow_' + name + '" x="-80%" y="-80%" width="260%" height="260%">';
      s += '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>';
      s += '<feFlood flood-color="' + color + '" flood-opacity="0.4"/>';
      s += '<feComposite in2="blur" operator="in" result="colorBlur"/>';
      s += '<feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
      s += '</filter>';
    }

    // Gold glow for non-colored circles (subtle)
    s += '<filter id="glow_gold" x="-50%" y="-50%" width="200%" height="200%">';
    s += '<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>';
    s += '<feFlood flood-color="' + GOLD + '" flood-opacity="0.15"/>';
    s += '<feComposite in2="blur" operator="in" result="colorBlur"/>';
    s += '<feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    s += '</filter>';

    s += '</defs>';
    return s;
  }

  // ── Background elements ──
  function svgBackground() {
    var s = '';
    // Dashed circle at R+25
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 25) + '" fill="none" stroke="#c9a96a" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="8 5"/>';
    // Radial glow behind K, radius 90
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="90" fill="url(#centerGlow)"/>';
    return s;
  }

  // ── Line helper ──
  function ln(x1, y1, x2, y2, opacity, width) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#c9a96a" stroke-opacity="' + opacity + '" stroke-width="' + width + '"/>';
  }

  // ── All structural lines ──
  function svgLines(p) {
    var s = '';
    // Octagon edges: gold, opacity 0.35, width 2
    var oct = [p.A, p.S, p.B, p.T, p.V, p.P, p.G, p.Rp];
    for (var i = 0; i < 8; i++) {
      s += ln(oct[i].x, oct[i].y, oct[(i + 1) % 8].x, oct[(i + 1) % 8].y, 0.35, 2);
    }
    // Diamond edges (A-B, B-V, V-G, G-A): opacity 0.25, width 1.5
    s += ln(p.A.x, p.A.y, p.B.x, p.B.y, 0.25, 1.5);
    s += ln(p.B.x, p.B.y, p.V.x, p.V.y, 0.25, 1.5);
    s += ln(p.V.x, p.V.y, p.G.x, p.G.y, 0.25, 1.5);
    s += ln(p.G.x, p.G.y, p.A.x, p.A.y, 0.25, 1.5);
    // Straight square edges (S-T, T-P, P-Rp, Rp-S): opacity 0.22, width 1.5
    s += ln(p.S.x, p.S.y, p.T.x, p.T.y, 0.22, 1.5);
    s += ln(p.T.x, p.T.y, p.P.x, p.P.y, 0.22, 1.5);
    s += ln(p.P.x, p.P.y, p.Rp.x, p.Rp.y, 0.22, 1.5);
    s += ln(p.Rp.x, p.Rp.y, p.S.x, p.S.y, 0.22, 1.5);
    // Cross lines (A-V horizontal, B-G vertical): opacity 0.25, width 1.2
    s += ln(p.A.x, p.A.y, p.V.x, p.V.y, 0.25, 1.2);
    s += ln(p.B.x, p.B.y, p.G.x, p.G.y, 0.25, 1.2);
    // Diagonal cross (S-P, T-Rp): opacity 0.18, width 1
    s += ln(p.S.x, p.S.y, p.P.x, p.P.y, 0.18, 1);
    s += ln(p.T.x, p.T.y, p.Rp.x, p.Rp.y, 0.18, 1);
    // Inner diamond (connecting 1st intermediates): opacity 0.18, width 1
    s += ln(p.S1.x, p.S1.y, p.T1.x, p.T1.y, 0.18, 1);
    s += ln(p.T1.x, p.T1.y, p.P1.x, p.P1.y, 0.18, 1);
    s += ln(p.P1.x, p.P1.y, p.R1.x, p.R1.y, 0.18, 1);
    s += ln(p.R1.x, p.R1.y, p.S1.x, p.S1.y, 0.18, 1);
    // Inner square (connecting 2nd intermediates): opacity 0.15, width 1
    s += ln(p.S2.x, p.S2.y, p.T2.x, p.T2.y, 0.15, 1);
    s += ln(p.T2.x, p.T2.y, p.P2.x, p.P2.y, 0.15, 1);
    s += ln(p.P2.x, p.P2.y, p.R2.x, p.R2.y, 0.15, 1);
    s += ln(p.R2.x, p.R2.y, p.S2.x, p.S2.y, 0.15, 1);
    // Center cluster connections: opacity 0.12, width 0.6
    s += ln(p.D.x, p.D.y, p.M.x, p.M.y, 0.12, 0.6);
    s += ln(p.M.x, p.M.y, p.I.x, p.I.y, 0.12, 0.6);
    s += ln(p.M.x, p.M.y, p.Zh.x, p.Zh.y, 0.12, 0.6);
    s += ln(p.Zh.x, p.Zh.y, p.V2.x, p.V2.y, 0.12, 0.6);
    return s;
  }

  // ── Chakra-colored circle (gradient fill + glow) ──
  function chakraCircle(x, y, value, radius, colorName, fontSize) {
    var sw = (radius >= 36) ? 2.5 : (radius >= 28 ? 2 : 1.5);
    var s = '<g filter="url(#glow_' + colorName + ')">';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="url(#grad_' + colorName + ')" stroke="rgba(255,255,255,0.15)" stroke-width="' + sw + '"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="' + fontSize + '">' + value + '</text>';
    s += '</g>';
    return s;
  }

  // ── Plain gold-stroke circle (dark fill) ──
  function goldCircle(x, y, value, radius, fontSize) {
    var sw = (radius >= 28) ? 1.8 : (radius >= 14 ? 1 : 0.8);
    var s = '<g>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="#131211" stroke="#c9a96a" stroke-width="' + sw + '"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="' + fontSize + '">' + value + '</text>';
    s += '</g>';
    return s;
  }

  // ── Pulsating energy circle (small, with subtle glow animation would be CSS) ──
  function pulseCircle(x, y, value) {
    var s = '<g>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="10" fill="#131211" stroke="#c9a96a" stroke-width="0.8"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="8">' + value + '</text>';
    s += '</g>';
    return s;
  }

  // ── All circle nodes ──
  function svgCircles(data, p) {
    var s = '';

    // --- Render order: background circles first, foreground last ---

    // Pulsating energies (smallest, in background)
    var pulse = pulsatingPositions(p);
    var pulseData = { F: data.F, Ya: data.Ya, E: data.E, Kh: data.Kh, Yu: data.Yu, Ts: data.Ts, Sh: data.Sh };
    for (var j = 0; j < pulse.length; j++) {
      s += pulseCircle(pulse[j].x, pulse[j].y, pulseData[pulse[j].key]);
    }

    // Diagonal intermediates (r=14, gold)
    var diagKeys = ["S1", "S2", "T1", "T2", "P1", "P2", "R1", "R2"];
    for (var di = 0; di < diagKeys.length; di++) {
      var dk = diagKeys[di];
      s += goldCircle(p[dk].x, p[dk].y, data[dk], 14, 10);
    }

    // Center cluster: D, M, I (r=13)
    s += goldCircle(p.D.x, p.D.y, data.D, 13, 9);
    s += goldCircle(p.M.x, p.M.y, data.M, 13, 9);
    s += goldCircle(p.I.x, p.I.y, data.I, 13, 9);

    // Right horizontal small: Z2p (shows Z2), Z1p (shows Z1) — r=14
    s += goldCircle(p.Z2p.x, p.Z2p.y, data.Z2, 14, 10);
    s += goldCircle(p.Z1p.x, p.Z1p.y, data.Z1, 14, 10);

    // Left horizontal: A3 (r=14, gold), A2 (r=16, cyan), A1 (r=17, blue)
    s += goldCircle(p.A3.x, p.A3.y, data.A3, 14, 10);
    s += chakraCircle(p.A2.x, p.A2.y, data.A2, 16, "cyan", 11);
    s += chakraCircle(p.A1.x, p.A1.y, data.A1, 17, "blue", 12);

    // Top vertical: B3 (r=18, green), B2 (r=20, cyan), B1 (r=20, blue)
    s += chakraCircle(p.B3.x, p.B3.y, data.B3, 18, "green", 12);
    s += chakraCircle(p.B2.x, p.B2.y, data.B2, 20, "cyan", 13);
    s += chakraCircle(p.B1.x, p.B1.y, data.B1, 20, "blue", 13);

    // Right horizontal: V1 (r=16, blue — mirrors A1), V2 (r=20, orange)
    s += chakraCircle(p.V1.x, p.V1.y, data.V1, 16, "blue", 11);
    s += chakraCircle(p.V2.x, p.V2.y, data.V2, 20, "orange", 13);

    // Bottom vertical: Z (r=20, orange), Zh (r=20, orange)
    s += chakraCircle(p.Z.x, p.Z.y, data.Z, 20, "orange", 13);
    s += chakraCircle(p.Zh.x, p.Zh.y, data.Zh, 20, "orange", 13);

    // Straight square corners: S, T, P, Rp (r=28, gold)
    s += goldCircle(p.S.x, p.S.y, data.S, 28, 16);
    s += goldCircle(p.T.x, p.T.y, data.T, 28, 16);
    s += goldCircle(p.P.x, p.P.y, data.P, 28, 16);
    s += goldCircle(p.Rp.x, p.Rp.y, data.Rp, 28, 16);

    // Diamond corners: A (r=36, purple), B (r=36, purple), V (r=36, red), G (r=36, red)
    s += chakraCircle(p.A.x, p.A.y, data.A, 36, "purple", 22);
    s += chakraCircle(p.B.x, p.B.y, data.B, 36, "purple", 22);
    s += chakraCircle(p.V.x, p.V.y, data.V, 36, "red", 22);
    s += chakraCircle(p.G.x, p.G.y, data.G, 36, "red", 22);

    // Center K (r=40, yellow — bright glow, rendered last / on top)
    s += chakraCircle(p.K.x, p.K.y, data.K, 40, "yellow", 24);

    return s;
  }

  // ── Age labels ──
  function svgLabels(p) {
    var s = '';
    var st = 'fill="#c9a96a" font-family="\'Inter\',sans-serif" font-weight="400" opacity="0.6"';

    // 8 main labels at corners: positioned outside circles
    // [position, label, text-anchor, dx, dy]
    var mainLabels = [
      [p.A, "0", "end", -44, 5],
      [p.S, "10", "end", -34, -5],
      [p.B, "20", "middle", 0, -44],
      [p.T, "30", "start", 34, -5],
      [p.V, "40", "start", 44, 5],
      [p.P, "50", "start", 34, 18],
      [p.G, "60", "middle", 0, 48],
      [p.Rp, "70", "end", -34, 18]
    ];
    for (var i = 0; i < mainLabels.length; i++) {
      var ml = mainLabels[i];
      s += '<text x="' + (ml[0].x + ml[3]) + '" y="' + (ml[0].y + ml[4]) + '" text-anchor="' + ml[2] + '" font-size="13" ' + st + '>' + ml[1] + '</text>';
    }

    // 8 midpoint labels at octagon edge midpoints
    // Angles for midpoints between octagon vertices (measured from center)
    var midAngles = [157.5, 112.5, 67.5, 22.5, 337.5, 292.5, 247.5, 202.5];
    var midLabels = ["5", "15", "25", "35", "45", "55", "65", "75"];
    var midR = R + 30;
    for (var k = 0; k < 8; k++) {
      var angle = midAngles[k] * Math.PI / 180;
      var mx = CX + midR * Math.cos(angle);
      var my = CY - midR * Math.sin(angle);
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="300" opacity="0.35" ' + st + '>' + midLabels[k] + '</text>';
    }

    return s;
  }

  // ── Decorative symbols ──
  function svgDecorations() {
    var s = '';
    // "$" symbol at (640, 555)
    s += '<text x="640" y="555" text-anchor="middle" fill="#c9a96a" font-family="serif" font-size="20" opacity="0.3">$</text>';
    // "♡" symbol between Zh area
    s += '<text x="515" y="700" text-anchor="middle" fill="#c9a96a" font-size="18" opacity="0.3">♡</text>';
    return s;
  }

  // ── Main render ──
  function renderMatrix(data) {
    var svg = document.getElementById("matrixSvg");
    var p = getPositions();

    // Rendering order: background → lines → circles → labels → decorations
    var content = '';
    content += svgDefs();
    content += svgBackground();
    content += svgLines(p);
    content += svgCircles(data, p);
    content += svgLabels(p);
    content += svgDecorations();

    svg.innerHTML = content;
  }

  // ── Purpose section update ──
  function updatePurpose(d) {
    document.getElementById("skyVal").textContent = d.sky;
    document.getElementById("earthVal").textContent = d.earth;
    document.getElementById("z1Val").textContent = d.Z1;
    document.getElementById("mPurpVal").textContent = d.mP;
    document.getElementById("zhPurpVal").textContent = d.zhP;
    document.getElementById("z2Val").textContent = d.Z2;
    document.getElementById("z3Val").textContent = d.Z3;
  }

  // ── Validation ──
  function validate(day, month, year) {
    if (!day || !month || !year) return "Please enter your full date of birth.";
    if (day < 1 || day > 31) return "Day must be between 1 and 31.";
    if (month < 1 || month > 12) return "Month must be between 1 and 12.";
    if (year < 1900 || year > 2030) return "Please enter a valid year.";
    var d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return "That date does not exist.";
    return null;
  }

  // ── Form handling ──
  var gender = "female";

  document.addEventListener("DOMContentLoaded", function () {
    var fB = document.getElementById("femaleBtn");
    var mB = document.getElementById("maleBtn");
    var cB = document.getElementById("calculateBtn");
    var rB = document.getElementById("recalculateBtn");
    var eE = document.getElementById("errorMsg");
    var fS = document.getElementById("formSection");
    var rS = document.getElementById("resultSection");

    fB.onclick = function () {
      gender = "female";
      fB.classList.add("active");
      mB.classList.remove("active");
    };

    mB.onclick = function () {
      gender = "male";
      mB.classList.add("active");
      fB.classList.remove("active");
    };

    cB.onclick = function () {
      var day = parseInt(document.getElementById("dayInput").value);
      var month = parseInt(document.getElementById("monthInput").value);
      var year = parseInt(document.getElementById("yearInput").value);
      var name = document.getElementById("nameInput").value.trim();
      var err = validate(day, month, year);
      if (err) {
        eE.textContent = err;
        eE.style.display = "block";
        return;
      }
      eE.style.display = "none";
      var data = calculateMatrix(day, month, year);
      renderMatrix(data);
      updatePurpose(data);
      document.getElementById("resultName").textContent = name || "Your Matrix";
      document.getElementById("resultDob").textContent = day + "." + (month < 10 ? "0" + month : month) + "." + year + " • " + (gender === "female" ? "Female" : "Male");
      fS.style.display = "none";
      rS.style.display = "block";
      rS.classList.add("fade-in");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    rB.onclick = function () {
      rS.style.display = "none";
      rS.classList.remove("fade-in");
      fS.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
})();
