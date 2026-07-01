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

      // Left horizontal (A→K) — ratios from reference app CSS
      A1: { x: lerp(100, 500, 0.236), y: 500 },
      A2: { x: lerp(100, 500, 0.414), y: 500 },
      A3: { x: lerp(100, 500, 0.717), y: 500 },

      // Top vertical (B→K) — mirrored horizontal ratios
      B1: { x: 500, y: lerp(100, 500, 0.236) },
      B2: { x: 500, y: lerp(100, 500, 0.414) },
      B3: { x: 500, y: lerp(100, 500, 0.717) },

      // Right horizontal (K→V) — from reference app CSS
      Z2p: { x: lerp(500, 900, 0.203), y: 500 },
      Z1p: { x: lerp(500, 900, 0.365), y: 500 },
      V2:  { x: lerp(500, 900, 0.591), y: 500 },
      V1:  { x: lerp(500, 900, 0.777), y: 500 },

      // Bottom vertical (K→G)
      Zh: { x: 500, y: lerp(500, 900, 0.50) },
      Z:  { x: 500, y: lerp(500, 900, 0.65) },

      // Diagonals — S2 closer to corner (27%), S1 closer to K (42%)
      S2: lerpPt(S, K, 0.27),
      S1: lerpPt(S, K, 0.42),
      T2: lerpPt(T, K, 0.27),
      T1: lerpPt(T, K, 0.42),
      P2: lerpPt(P, K, 0.27),
      P1: lerpPt(P, K, 0.42),
      R2: lerpPt(Rp, K, 0.27),
      R1: lerpPt(Rp, K, 0.42),

      // Center cluster — arc from K→V direction curving to K→G direction
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

  function svgDefs() {
    var GOLD = "#c9a96a";
    var s = '<defs>';

    s += '<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">';
    s += '<stop offset="0%" stop-color="#f1c40f" stop-opacity="0.25"/>';
    s += '<stop offset="60%" stop-color="#f1c40f" stop-opacity="0.08"/>';
    s += '<stop offset="100%" stop-color="#f1c40f" stop-opacity="0"/>';
    s += '</radialGradient>';

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
      var light = lighten(color, 0.35);

      s += '<radialGradient id="grad_' + name + '" cx="40%" cy="40%" r="60%">';
      s += '<stop offset="0%" stop-color="' + lighten(color, 0.5) + '"/>';
      s += '<stop offset="50%" stop-color="' + light + '"/>';
      s += '<stop offset="100%" stop-color="' + color + '"/>';
      s += '</radialGradient>';

      s += '<filter id="glow_' + name + '" x="-80%" y="-80%" width="260%" height="260%">';
      s += '<feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>';
      s += '<feFlood flood-color="' + color + '" flood-opacity="0.5"/>';
      s += '<feComposite in2="blur" operator="in" result="colorBlur"/>';
      s += '<feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
      s += '</filter>';
    }

    s += '<filter id="glow_gold" x="-60%" y="-60%" width="220%" height="220%">';
    s += '<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>';
    s += '<feFlood flood-color="' + GOLD + '" flood-opacity="0.2"/>';
    s += '<feComposite in2="blur" operator="in" result="colorBlur"/>';
    s += '<feMerge><feMergeNode in="colorBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
    s += '</filter>';

    s += '</defs>';
    return s;
  }

  function svgBackground() {
    var s = '';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 25) + '" fill="none" stroke="#c9a96a" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="6 4"/>';
    s += '<circle cx="' + CX + '" cy="' + CY + '" r="110" fill="url(#centerGlow)"/>';
    return s;
  }

  function ln(x1, y1, x2, y2, opacity, width) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#c9a96a" stroke-opacity="' + opacity + '" stroke-width="' + width + '"/>';
  }

  function svgLines(p) {
    var s = '';
    var oct = [p.A, p.S, p.B, p.T, p.V, p.P, p.G, p.Rp];
    for (var i = 0; i < 8; i++) {
      s += ln(oct[i].x, oct[i].y, oct[(i + 1) % 8].x, oct[(i + 1) % 8].y, 0.45, 2.2);
    }
    s += ln(p.A.x, p.A.y, p.B.x, p.B.y, 0.32, 1.8);
    s += ln(p.B.x, p.B.y, p.V.x, p.V.y, 0.32, 1.8);
    s += ln(p.V.x, p.V.y, p.G.x, p.G.y, 0.32, 1.8);
    s += ln(p.G.x, p.G.y, p.A.x, p.A.y, 0.32, 1.8);
    s += ln(p.S.x, p.S.y, p.T.x, p.T.y, 0.28, 1.6);
    s += ln(p.T.x, p.T.y, p.P.x, p.P.y, 0.28, 1.6);
    s += ln(p.P.x, p.P.y, p.Rp.x, p.Rp.y, 0.28, 1.6);
    s += ln(p.Rp.x, p.Rp.y, p.S.x, p.S.y, 0.28, 1.6);
    s += ln(p.A.x, p.A.y, p.V.x, p.V.y, 0.30, 1.4);
    s += ln(p.B.x, p.B.y, p.G.x, p.G.y, 0.30, 1.4);
    s += ln(p.S.x, p.S.y, p.P.x, p.P.y, 0.22, 1.2);
    s += ln(p.T.x, p.T.y, p.Rp.x, p.Rp.y, 0.22, 1.2);
    // Inner square (S2-T2-P2-R2, closer to corners = larger shape)
    s += ln(p.S2.x, p.S2.y, p.T2.x, p.T2.y, 0.22, 1.2);
    s += ln(p.T2.x, p.T2.y, p.P2.x, p.P2.y, 0.22, 1.2);
    s += ln(p.P2.x, p.P2.y, p.R2.x, p.R2.y, 0.22, 1.2);
    s += ln(p.R2.x, p.R2.y, p.S2.x, p.S2.y, 0.22, 1.2);
    // Inner diamond (S1-T1-P1-R1, closer to K = smaller shape)
    s += ln(p.S1.x, p.S1.y, p.T1.x, p.T1.y, 0.20, 1.0);
    s += ln(p.T1.x, p.T1.y, p.P1.x, p.P1.y, 0.20, 1.0);
    s += ln(p.P1.x, p.P1.y, p.R1.x, p.R1.y, 0.20, 1.0);
    s += ln(p.R1.x, p.R1.y, p.S1.x, p.S1.y, 0.20, 1.0);
    // Center cluster connections
    s += ln(p.K.x, p.K.y, p.D.x, p.D.y, 0.15, 0.8);
    s += ln(p.D.x, p.D.y, p.M.x, p.M.y, 0.18, 0.8);
    s += ln(p.M.x, p.M.y, p.I.x, p.I.y, 0.18, 0.8);
    s += ln(p.I.x, p.I.y, p.Zh.x, p.Zh.y, 0.15, 0.7);
    s += ln(p.D.x, p.D.y, p.V2.x, p.V2.y, 0.12, 0.6);
    s += ln(p.M.x, p.M.y, p.Zh.x, p.Zh.y, 0.10, 0.5);
    return s;
  }

  function chakraCircle(x, y, value, radius, colorName, fontSize) {
    var sw = (radius >= 38) ? 2.5 : (radius >= 28 ? 2 : 1.5);
    var s = '<g filter="url(#glow_' + colorName + ')">';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="url(#grad_' + colorName + ')" stroke="rgba(255,255,255,0.2)" stroke-width="' + sw + '"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="\'Cormorant Garamond\',serif" font-weight="700" font-size="' + fontSize + '" style="text-shadow:0 1px 3px rgba(0,0,0,0.5)">' + value + '</text>';
    s += '</g>';
    return s;
  }

  function goldCircle(x, y, value, radius, fontSize) {
    var sw = (radius >= 28) ? 1.8 : (radius >= 16 ? 1.2 : 1.0);
    var s = '<g filter="url(#glow_gold)">';
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="#151413" stroke="#c9a96a" stroke-width="' + sw + '"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="700" font-size="' + fontSize + '">' + value + '</text>';
    s += '</g>';
    return s;
  }

  function pulseCircle(x, y, value) {
    var s = '<g>';
    s += '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#131211" stroke="#c9a96a" stroke-width="0.8" stroke-opacity="0.6"/>';
    s += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="#d4af37" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="9" opacity="0.8">' + value + '</text>';
    s += '</g>';
    return s;
  }

  function svgCircles(data, p) {
    var s = '';

    var pulse = pulsatingPositions(p);
    var pulseData = { F: data.F, Ya: data.Ya, E: data.E, Kh: data.Kh, Yu: data.Yu, Ts: data.Ts, Sh: data.Sh };
    for (var j = 0; j < pulse.length; j++) {
      s += pulseCircle(pulse[j].x, pulse[j].y, pulseData[pulse[j].key]);
    }

    var diagKeys = ["S1", "S2", "T1", "T2", "P1", "P2", "R1", "R2"];
    for (var di = 0; di < diagKeys.length; di++) {
      var dk = diagKeys[di];
      s += goldCircle(p[dk].x, p[dk].y, data[dk], 16, 12);
    }

    s += goldCircle(p.D.x, p.D.y, data.D, 15, 11);
    s += goldCircle(p.M.x, p.M.y, data.M, 15, 11);
    s += goldCircle(p.I.x, p.I.y, data.I, 15, 11);

    s += goldCircle(p.Z2p.x, p.Z2p.y, data.Z2, 16, 12);
    s += goldCircle(p.Z1p.x, p.Z1p.y, data.Z1, 16, 12);

    s += goldCircle(p.A3.x, p.A3.y, data.A3, 16, 12);
    s += chakraCircle(p.A2.x, p.A2.y, data.A2, 20, "cyan", 13);
    s += chakraCircle(p.A1.x, p.A1.y, data.A1, 22, "blue", 14);

    s += chakraCircle(p.B3.x, p.B3.y, data.B3, 20, "green", 13);
    s += chakraCircle(p.B2.x, p.B2.y, data.B2, 22, "cyan", 14);
    s += chakraCircle(p.B1.x, p.B1.y, data.B1, 22, "blue", 14);

    s += chakraCircle(p.V1.x, p.V1.y, data.V1, 20, "blue", 13);
    s += chakraCircle(p.V2.x, p.V2.y, data.V2, 22, "orange", 14);

    s += chakraCircle(p.Z.x, p.Z.y, data.Z, 22, "orange", 14);
    s += chakraCircle(p.Zh.x, p.Zh.y, data.Zh, 22, "orange", 14);

    s += goldCircle(p.S.x, p.S.y, data.S, 30, 18);
    s += goldCircle(p.T.x, p.T.y, data.T, 30, 18);
    s += goldCircle(p.P.x, p.P.y, data.P, 30, 18);
    s += goldCircle(p.Rp.x, p.Rp.y, data.Rp, 30, 18);

    s += chakraCircle(p.A.x, p.A.y, data.A, 38, "purple", 24);
    s += chakraCircle(p.B.x, p.B.y, data.B, 38, "purple", 24);
    s += chakraCircle(p.V.x, p.V.y, data.V, 38, "red", 24);
    s += chakraCircle(p.G.x, p.G.y, data.G, 38, "red", 24);

    s += chakraCircle(p.K.x, p.K.y, data.K, 42, "yellow", 26);

    return s;
  }

  function svgLabels(p) {
    var s = '';
    var st = 'fill="#c9a96a" font-family="\'Inter\',sans-serif" font-weight="400" opacity="0.55"';

    var mainLabels = [
      [p.A, "0", "end", -46, 5],
      [p.S, "10", "end", -36, -8],
      [p.B, "20", "middle", 0, -46],
      [p.T, "30", "start", 36, -8],
      [p.V, "40", "start", 46, 5],
      [p.P, "50", "start", 36, 20],
      [p.G, "60", "middle", 0, 50],
      [p.Rp, "70", "end", -36, 20]
    ];
    for (var i = 0; i < mainLabels.length; i++) {
      var ml = mainLabels[i];
      s += '<text x="' + (ml[0].x + ml[3]) + '" y="' + (ml[0].y + ml[4]) + '" text-anchor="' + ml[2] + '" font-size="13" ' + st + '>' + ml[1] + '</text>';
    }

    var midAngles = [157.5, 112.5, 67.5, 22.5, 337.5, 292.5, 247.5, 202.5];
    var midLabels = ["5", "15", "25", "35", "45", "55", "65", "75"];
    var midR = R + 32;
    for (var k = 0; k < 8; k++) {
      var angle = midAngles[k] * Math.PI / 180;
      var mx = CX + midR * Math.cos(angle);
      var my = CY - midR * Math.sin(angle);
      s += '<text x="' + mx + '" y="' + my + '" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="300" opacity="0.30" ' + st + '>' + midLabels[k] + '</text>';
    }

    return s;
  }

  function svgDecorations() {
    var s = '';
    s += '<text x="660" y="595" text-anchor="middle" fill="#c9a96a" font-family="serif" font-size="20" opacity="0.25">$</text>';
    s += '<text x="530" y="730" text-anchor="middle" fill="#c9a96a" font-size="18" opacity="0.25">♡</text>';
    return s;
  }

  function renderMatrix(data) {
    var svg = document.getElementById("matrixSvg");
    var p = getPositions();

    var content = '';
    content += svgDefs();
    content += svgBackground();
    content += svgLines(p);
    content += svgCircles(data, p);
    content += svgLabels(p);
    content += svgDecorations();

    svg.innerHTML = content;
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
