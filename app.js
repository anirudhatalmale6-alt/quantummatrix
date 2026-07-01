(function () {
  "use strict";

  var CX = 500, CY = 500, R = 400;

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
      A1: { x: lerp(100, 500, 0.236), y: 500 },
      A2: { x: lerp(100, 500, 0.414), y: 500 },
      A3: { x: lerp(100, 500, 0.717), y: 500 },
      B1: { x: 500, y: lerp(100, 500, 0.236) },
      B2: { x: 500, y: lerp(100, 500, 0.414) },
      B3: { x: 500, y: lerp(100, 500, 0.717) },
      Z2p: { x: lerp(500, 900, 0.203), y: 500 },
      Z1p: { x: lerp(500, 900, 0.365), y: 500 },
      V2:  { x: lerp(500, 900, 0.591), y: 500 },
      V1:  { x: lerp(500, 900, 0.777), y: 500 },
      Zh: { x: 500, y: lerp(500, 900, 0.50) },
      Z:  { x: 500, y: lerp(500, 900, 0.65) },
      S2: lerpPt(S, K, 0.27),
      S1: lerpPt(S, K, 0.42),
      T2: lerpPt(T, K, 0.27),
      T1: lerpPt(T, K, 0.42),
      P2: lerpPt(P, K, 0.27),
      P1: lerpPt(P, K, 0.42),
      R2: lerpPt(Rp, K, 0.27),
      R1: lerpPt(Rp, K, 0.42),
      D: { x: 590, y: 540 },
      M: { x: 556, y: 572 },
      I: { x: 525, y: 608 }
    };
  }

  function pulsatingPositions(p) {
    var pts = [];
    var asNames = ["F", "Ya", "E", "Kh"];
    var asPercents = [0.20, 0.40, 0.60, 0.80];
    for (var i = 0; i < asNames.length; i++) {
      pts.push({ key: asNames[i], x: lerp(p.A.x, p.S.x, asPercents[i]), y: lerp(p.A.y, p.S.y, asPercents[i]) });
    }
    var sbNames = ["Yu", "Ts", "Sh"];
    var sbPercents = [0.25, 0.50, 0.75];
    for (var j = 0; j < sbNames.length; j++) {
      pts.push({ key: sbNames[j], x: lerp(p.S.x, p.B.x, sbPercents[j]), y: lerp(p.S.y, p.B.y, sbPercents[j]) });
    }
    return pts;
  }

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
    return rgbToHex(c[0] + (255 - c[0]) * pct, c[1] + (255 - c[1]) * pct, c[2] + (255 - c[2]) * pct);
  }

  var CHAKRA_COLORS = {
    purple: { base: "#9b59b6", mid: "#c39bd3", light: "#e8d5f5" },
    blue:   { base: "#2980b9", mid: "#5dade2", light: "#aed6f1" },
    cyan:   { base: "#17a2b8", mid: "#56c5d6", light: "#a3e4ed" },
    green:  { base: "#27ae60", mid: "#58d68d", light: "#abebc6" },
    yellow: { base: "#f1c40f", mid: "#f7dc6f", light: "#fef9e7" },
    orange: { base: "#e67e22", mid: "#f0b27a", light: "#fdebd0" },
    red:    { base: "#c0392b", mid: "#e74c3c", light: "#f5b7b1" }
  };

  function svgDefs() {
    var GOLD = "#c9a96a";
    var s = '<defs>';

    // Center radiating glow - much bigger and brighter
    s += '<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">';
    s += '<stop offset="0%" stop-color="#f7dc6f" stop-opacity="0.5"/>';
    s += '<stop offset="15%" stop-color="#f1c40f" stop-opacity="0.35"/>';
    s += '<stop offset="40%" stop-color="#f1c40f" stop-opacity="0.12"/>';
    s += '<stop offset="70%" stop-color="#d4ac0d" stop-opacity="0.04"/>';
    s += '<stop offset="100%" stop-color="#b7950b" stop-opacity="0"/>';
    s += '</radialGradient>';

    // Body silhouette fade mask
    s += '<radialGradient id="silhouetteFade" cx="50%" cy="45%" r="55%">';
    s += '<stop offset="0%" stop-color="white" stop-opacity="1"/>';
    s += '<stop offset="70%" stop-color="white" stop-opacity="0.8"/>';
    s += '<stop offset="100%" stop-color="white" stop-opacity="0"/>';
    s += '</radialGradient>';
    s += '<mask id="silhouetteMask"><rect width="1000" height="1000" fill="url(#silhouetteFade)"/></mask>';

    var colorKeys = ["purple", "blue", "cyan", "green", "yellow", "orange", "red"];
    for (var i = 0; i < colorKeys.length; i++) {
      var name = colorKeys[i];
      var cc = CHAKRA_COLORS[name];

      // 3D sphere gradient - more vivid with highlight
      s += '<radialGradient id="grad_' + name + '" cx="35%" cy="30%" r="65%">';
      s += '<stop offset="0%" stop-color="' + cc.light + '"/>';
      s += '<stop offset="30%" stop-color="' + cc.mid + '"/>';
      s += '<stop offset="70%" stop-color="' + cc.base + '"/>';
      s += '<stop offset="100%" stop-color="' + lighten(cc.base, -0.2) + '"/>';
      s += '</radialGradient>';

      // Outer halo glow - very soft, wide spread
      s += '<radialGradient id="halo_' + name + '" cx="50%" cy="50%" r="50%">';
      s += '<stop offset="0%" stop-color="' + cc.base + '" stop-opacity="0.6"/>';
      s += '<stop offset="40%" stop-color="' + cc.base + '" stop-opacity="0.25"/>';
      s += '<stop offset="70%" stop-color="' + cc.base + '" stop-opacity="0.08"/>';
      s += '<stop offset="100%" stop-color="' + cc.base + '" stop-opacity="0"/>';
      s += '</radialGradient>';

      // Inner glow filter - tight, bright
      s += '<filter id="glow_' + name + '" x="-100%" y="-100%" width="300%" height="300%">';
      s += '<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1"/>';
      s += '<feFlood flood-color="' + cc.mid + '" flood-opacity="0.7"/>';
      s += '<feComposite in2="blur1" operator="in" result="glow1"/>';
      s += '<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2"/>';
      s += '<feFlood flood-color="' + cc.base + '" flood-opacity="0.3"/>';
      s += '<feComposite in2="blur2" operator="in" result="glow2"/>';
      s += '<feMerge>';
      s += '<feMergeNode in="glow2"/>';
      s += '<feMergeNode in="glow1"/>';
      s += '<feMergeNode in="SourceGraphic"/>';
      s += '</feMerge>';
      s += '</filter>';
    }

    // Gold glow filter - enhanced
    s += '<filter id="glow_gold" x="-80%" y="-80%" width="260%" height="260%">';
    s += '<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>';
    s += '<feFlood flood-color="' + GOLD + '" flood-opacity="0.4"/>';
    s += '<feComposite in2="blur" operator="in" result="colorBlur"/>';
    s += '<feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    s += '</filter>';

    // Gold fill gradient for gold circles
    s += '<radialGradient id="goldFill" cx="35%" cy="30%" r="65%">';
    s += '<stop offset="0%" stop-color="#2a2520"/>';
    s += '<stop offset="50%" stop-color="#1a1815"/>';
    s += '<stop offset="100%" stop-color="#111010"/>';
    s += '</radialGradient>';

    // Glass highlight (specular reflection) for big circles
    s += '<radialGradient id="glassHighlight" cx="40%" cy="25%" r="50%">';
    s += '<stop offset="0%" stop-color="white" stop-opacity="0.35"/>';
    s += '<stop offset="50%" stop-color="white" stop-opacity="0.08"/>';
    s += '<stop offset="100%" stop-color="white" stop-opacity="0"/>';
    s += '</radialGradient>';

    // Outer ring gradient
    s += '<linearGradient id="outerRing" x1="0%" y1="0%" x2="100%" y2="100%">';
    s += '<stop offset="0%" stop-color="#c9a96a" stop-opacity="0.5"/>';
    s += '<stop offset="50%" stop-color="#d4af37" stop-opacity="0.7"/>';
    s += '<stop offset="100%" stop-color="#b88a44" stop-opacity="0.5"/>';
    s += '</linearGradient>';

    // SVG animation styles
    s += '<style>';
    s += '@keyframes centerPulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }';
    s += '@keyframes haloBreath { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }';
    s += '.center-glow { animation: centerPulse 3s ease-in-out infinite; }';
    s += '.halo { animation: haloBreath 4s ease-in-out infinite; }';
    s += '</style>';

    s += '</defs>';
    return s;
  }

  function svgBackground(hasSilhouette) {
    var s = '';

    // Body silhouette
    if (hasSilhouette) {
      var imgW = 500, imgH = 780;
      var imgX = CX - imgW / 2, imgY = CY - imgH * 0.48;
      s += '<g mask="url(#silhouetteMask)" opacity="0.07">';
      s += '<image href="avatar_demo.svg" x="' + imgX + '" y="' + imgY + '" width="' + imgW + '" height="' + imgH + '" preserveAspectRatio="xMidYMid meet"/>';
      s += '</g>';
    }

    // Outer ring - solid, prominent
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 18) + '" fill="none" stroke="url(#outerRing)" stroke-width="2"/>';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 28) + '" fill="none" stroke="#c9a96a" stroke-opacity="0.15" stroke-width="0.8" stroke-dasharray="4 6"/>';

    // Center radiating glow - much bigger
    s += '<circle class="center-glow" cx="' + CX + '" cy="' + CY + '" r="180" fill="url(#centerGlow)"/>';

    return s;
  }

  function ln(x1, y1, x2, y2, opacity, width) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#c9a96a" stroke-opacity="' + opacity + '" stroke-width="' + width + '"/>';
  }

  function svgLines(p) {
    var s = '';

    // Octagon
    var oct = [p.A, p.S, p.B, p.T, p.V, p.P, p.G, p.Rp];
    for (var i = 0; i < 8; i++) {
      s += ln(oct[i].x, oct[i].y, oct[(i + 1) % 8].x, oct[(i + 1) % 8].y, 0.5, 2.5);
    }

    // Diamond (A-B-V-G)
    s += ln(p.A.x, p.A.y, p.B.x, p.B.y, 0.38, 2.0);
    s += ln(p.B.x, p.B.y, p.V.x, p.V.y, 0.38, 2.0);
    s += ln(p.V.x, p.V.y, p.G.x, p.G.y, 0.38, 2.0);
    s += ln(p.G.x, p.G.y, p.A.x, p.A.y, 0.38, 2.0);

    // Straight square (S-T-P-Rp)
    s += ln(p.S.x, p.S.y, p.T.x, p.T.y, 0.32, 1.8);
    s += ln(p.T.x, p.T.y, p.P.x, p.P.y, 0.32, 1.8);
    s += ln(p.P.x, p.P.y, p.Rp.x, p.Rp.y, 0.32, 1.8);
    s += ln(p.Rp.x, p.Rp.y, p.S.x, p.S.y, 0.32, 1.8);

    // Cross lines (horizontal and vertical through center)
    s += ln(p.A.x, p.A.y, p.V.x, p.V.y, 0.35, 1.6);
    s += ln(p.B.x, p.B.y, p.G.x, p.G.y, 0.35, 1.6);

    // Diagonal cross lines
    s += ln(p.S.x, p.S.y, p.P.x, p.P.y, 0.25, 1.4);
    s += ln(p.T.x, p.T.y, p.Rp.x, p.Rp.y, 0.25, 1.4);

    // Inner square (S2-T2-P2-R2)
    s += ln(p.S2.x, p.S2.y, p.T2.x, p.T2.y, 0.25, 1.4);
    s += ln(p.T2.x, p.T2.y, p.P2.x, p.P2.y, 0.25, 1.4);
    s += ln(p.P2.x, p.P2.y, p.R2.x, p.R2.y, 0.25, 1.4);
    s += ln(p.R2.x, p.R2.y, p.S2.x, p.S2.y, 0.25, 1.4);

    // Inner diamond (S1-T1-P1-R1)
    s += ln(p.S1.x, p.S1.y, p.T1.x, p.T1.y, 0.22, 1.2);
    s += ln(p.T1.x, p.T1.y, p.P1.x, p.P1.y, 0.22, 1.2);
    s += ln(p.P1.x, p.P1.y, p.R1.x, p.R1.y, 0.22, 1.2);
    s += ln(p.R1.x, p.R1.y, p.S1.x, p.S1.y, 0.22, 1.2);

    // Center cluster connections
    s += ln(p.K.x, p.K.y, p.D.x, p.D.y, 0.18, 1.0);
    s += ln(p.D.x, p.D.y, p.M.x, p.M.y, 0.22, 1.0);
    s += ln(p.M.x, p.M.y, p.I.x, p.I.y, 0.22, 1.0);
    s += ln(p.I.x, p.I.y, p.Zh.x, p.Zh.y, 0.18, 0.8);
    s += ln(p.D.x, p.D.y, p.V2.x, p.V2.y, 0.15, 0.7);
    s += ln(p.M.x, p.M.y, p.Zh.x, p.Zh.y, 0.12, 0.6);

    return s;
  }

  function chakraCircle(x, y, value, radius, colorName, fontSize, isMain) {
    var cc = CHAKRA_COLORS[colorName];
    var s = '';

    // Layer 1: Outer halo glow (only for main/large circles)
    if (isMain || radius >= 28) {
      var haloR = radius * 2.2;
      s += '<circle class="halo" cx="' + x + '" cy="' + y + '" r="' + haloR + '" fill="url(#halo_' + colorName + ')"/>';
    }

    // Layer 2: Main circle with glow filter
    s += '<g filter="url(#glow_' + colorName + ')">';

    // Circle body with 3D gradient
    var sw = isMain ? 2.5 : (radius >= 28 ? 2 : 1.5);
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="url(#grad_' + colorName + ')" stroke="rgba(255,255,255,0.25)" stroke-width="' + sw + '"/>';

    // Layer 3: Glass highlight for 3D sphere effect (big circles only)
    if (radius >= 24) {
      var hlR = radius * 0.85;
      var hlY = y - radius * 0.15;
      s += '<circle cx="' + x + '" cy="' + hlY + '" r="' + hlR + '" fill="url(#glassHighlight)"/>';
    }

    // Layer 4: Text with shadow
    var textShadow = isMain ? 'style="text-shadow:0 2px 6px rgba(0,0,0,0.7)"' : 'style="text-shadow:0 1px 3px rgba(0,0,0,0.5)"';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="\'Cormorant Garamond\',serif" font-weight="700" font-size="' + fontSize + '" ' + textShadow + '>' + value + '</text>';

    s += '</g>';
    return s;
  }

  function goldCircle(x, y, value, radius, fontSize, enhanced) {
    var s = '';

    // Subtle gold halo for enhanced circles
    if (enhanced) {
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + (radius * 1.6) + '" fill="none" stroke="#c9a96a" stroke-opacity="0.08" stroke-width="1"/>';
    }

    s += '<g filter="url(#glow_gold)">';

    var sw = enhanced ? 2.0 : (radius >= 16 ? 1.4 : 1.0);
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="url(#goldFill)" stroke="#c9a96a" stroke-width="' + sw + '"/>';

    // Glass highlight for bigger gold circles
    if (radius >= 20) {
      s += '<circle cx="' + x + '" cy="' + (y - radius * 0.15) + '" r="' + (radius * 0.7) + '" fill="url(#glassHighlight)" opacity="0.3"/>';
    }

    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="700" font-size="' + fontSize + '">' + value + '</text>';
    s += '</g>';
    return s;
  }

  function pulseCircle(x, y, value) {
    var s = '<g>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="#131211" stroke="#c9a96a" stroke-width="1.0" stroke-opacity="0.65"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="10" opacity="0.85">' + value + '</text>';
    s += '</g>';
    return s;
  }

  function svgCircles(data, p) {
    var s = '';

    // Pulsating energies (smallest, draw first)
    var pulse = pulsatingPositions(p);
    var pulseData = { F: data.F, Ya: data.Ya, E: data.E, Kh: data.Kh, Yu: data.Yu, Ts: data.Ts, Sh: data.Sh };
    for (var j = 0; j < pulse.length; j++) {
      s += pulseCircle(pulse[j].x, pulse[j].y, pulseData[pulse[j].key]);
    }

    // Diagonal intermediates (S1,S2,T1,T2,P1,P2,R1,R2)
    var diagKeys = ["S1", "S2", "T1", "T2", "P1", "P2", "R1", "R2"];
    for (var di = 0; di < diagKeys.length; di++) {
      var dk = diagKeys[di];
      s += goldCircle(p[dk].x, p[dk].y, data[dk], 18, 13, false);
    }

    // Center cluster (D, M, I)
    s += goldCircle(p.D.x, p.D.y, data.D, 17, 12, false);
    s += goldCircle(p.M.x, p.M.y, data.M, 17, 12, false);
    s += goldCircle(p.I.x, p.I.y, data.I, 17, 12, false);

    // Purpose circles on right horizontal
    s += goldCircle(p.Z2p.x, p.Z2p.y, data.Z2, 18, 13, false);
    s += goldCircle(p.Z1p.x, p.Z1p.y, data.Z1, 18, 13, false);

    // Left horizontal chakra intermediates
    s += goldCircle(p.A3.x, p.A3.y, data.A3, 18, 13, false);
    s += chakraCircle(p.A2.x, p.A2.y, data.A2, 24, "cyan", 15, false);
    s += chakraCircle(p.A1.x, p.A1.y, data.A1, 26, "blue", 16, false);

    // Top vertical chakra intermediates
    s += chakraCircle(p.B3.x, p.B3.y, data.B3, 24, "green", 15, false);
    s += chakraCircle(p.B2.x, p.B2.y, data.B2, 26, "cyan", 16, false);
    s += chakraCircle(p.B1.x, p.B1.y, data.B1, 26, "blue", 16, false);

    // Right horizontal chakra intermediates
    s += chakraCircle(p.V1.x, p.V1.y, data.V1, 24, "blue", 15, false);
    s += chakraCircle(p.V2.x, p.V2.y, data.V2, 26, "orange", 16, false);

    // Bottom vertical chakra intermediates
    s += chakraCircle(p.Z.x, p.Z.y, data.Z, 26, "orange", 16, false);
    s += chakraCircle(p.Zh.x, p.Zh.y, data.Zh, 26, "orange", 16, false);

    // Straight square corners (S, T, P, Rp) - enhanced gold
    s += goldCircle(p.S.x, p.S.y, data.S, 36, 22, true);
    s += goldCircle(p.T.x, p.T.y, data.T, 36, 22, true);
    s += goldCircle(p.P.x, p.P.y, data.P, 36, 22, true);
    s += goldCircle(p.Rp.x, p.Rp.y, data.Rp, 36, 22, true);

    // Main corners (A, B, V, G) - large chakra with halos
    s += chakraCircle(p.A.x, p.A.y, data.A, 48, "purple", 28, true);
    s += chakraCircle(p.B.x, p.B.y, data.B, 48, "purple", 28, true);
    s += chakraCircle(p.V.x, p.V.y, data.V, 48, "red", 28, true);
    s += chakraCircle(p.G.x, p.G.y, data.G, 48, "red", 28, true);

    // Center K - largest, yellow, with massive glow
    s += chakraCircle(p.K.x, p.K.y, data.K, 54, "yellow", 32, true);

    return s;
  }

  function svgLabels(p) {
    var s = '';
    var st = 'fill="#c9a96a" font-family="\'Inter\',sans-serif" font-weight="400" opacity="0.55"';

    var mainLabels = [
      [p.A, "0", "end", -56, 5],
      [p.S, "10", "end", -44, -10],
      [p.B, "20", "middle", 0, -56],
      [p.T, "30", "start", 44, -10],
      [p.V, "40", "start", 56, 5],
      [p.P, "50", "start", 44, 24],
      [p.G, "60", "middle", 0, 60],
      [p.Rp, "70", "end", -44, 24]
    ];
    for (var i = 0; i < mainLabels.length; i++) {
      var ml = mainLabels[i];
      s += '<text x="' + (ml[0].x + ml[3]) + '" y="' + (ml[0].y + ml[4]) + '" text-anchor="' + ml[2] + '" font-size="13" ' + st + '>' + ml[1] + '</text>';
    }

    var midAngles = [157.5, 112.5, 67.5, 22.5, 337.5, 292.5, 247.5, 202.5];
    var midLabels = ["5", "15", "25", "35", "45", "55", "65", "75"];
    var midR = R + 38;
    for (var k = 0; k < 8; k++) {
      var angle = midAngles[k] * Math.PI / 180;
      var mx = CX + midR * Math.cos(angle);
      var my = CY - midR * Math.sin(angle);
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="300" opacity="0.28" ' + st + '>' + midLabels[k] + '</text>';
    }

    return s;
  }

  function svgDecorations() {
    var s = '';
    s += '<text x="670" y="600" text-anchor="middle" fill="#c9a96a" font-family="serif" font-size="22" opacity="0.2">$</text>';
    s += '<text x="535" y="740" text-anchor="middle" fill="#c9a96a" font-size="20" opacity="0.2">♡</text>';
    return s;
  }

  var hasSilhouette = true;

  function renderMatrix(data) {
    var svg = document.getElementById("matrixSvg");
    var p = getPositions();

    var content = '';
    content += svgDefs();
    content += svgBackground(hasSilhouette);
    content += svgLines(p);
    content += svgCircles(data, p);
    content += svgLabels(p);
    content += svgDecorations();

    svg.innerHTML = content;

    // Check if silhouette actually loaded - if not, it's fine, just visual enhancement
    var img = svg.querySelector('image');
    if (img) {
      img.onerror = function() { hasSilhouette = false; };
    }
  }

  function updatePurpose(d) {
    document.getElementById("skyVal").textContent = d.sky;
    document.getElementById("earthVal").textContent = d.earth;
    document.getElementById("z1Val").textContent = d.Z1;
    document.getElementById("mPurpVal").textContent = d.mP;
    document.getElementById("zhPurpVal").textContent = d.zhP;
    document.getElementById("z2Val").textContent = d.Z2;
    document.getElementById("z3Val").textContent = d.Z3;
  }

  function validate(day, month, year) {
    if (!day || !month || !year) return "Please enter your full date of birth.";
    if (day < 1 || day > 31) return "Day must be between 1 and 31.";
    if (month < 1 || month > 12) return "Month must be between 1 and 12.";
    if (year < 1900 || year > 2030) return "Please enter a valid year.";
    var d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return "That date does not exist.";
    return null;
  }

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
