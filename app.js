(function () {
  "use strict";

  var CX = 500, CY = 500, R = 360;
  var COS45 = Math.cos(Math.PI / 4);

  function reduce(n) {
    n = Math.abs(Math.round(n));
    while (n > 22) {
      var s = 0, t = n;
      while (t > 0) { s += t % 10; t = Math.floor(t / 10); }
      n = s;
    }
    return n;
  }

  function calculateMatrix(day, month, year) {
    var A = reduce(day);
    var B = month;
    var V = reduce(String(year).split("").reduce(function(s, d) { return s + parseInt(d); }, 0));
    var G = reduce(A + B + V);
    var K = reduce(A + B + V + G);

    var S = reduce(A + B);
    var T = reduce(B + V);
    var P = reduce(V + G);
    var Rp = reduce(G + A);

    var A2 = reduce(A + K);
    var A1 = reduce(A2 + A);
    var A3 = reduce(A2 + K);

    var B2 = reduce(B + K);
    var B1 = reduce(B2 + B);
    var B3 = reduce(B2 + K);

    var V2 = reduce(V + K);
    var V1 = reduce(V2 + V);

    var S2 = reduce(K + S);
    var S1 = reduce(S + S2);

    var T2 = reduce(T + K);
    var T1 = reduce(T + T2);

    var P2 = reduce(P + K);
    var P1 = reduce(P + P2);

    var R2 = reduce(K + Rp);
    var R1 = reduce(R2 + Rp);

    var Zh = reduce(K + G);
    var Z = reduce(Zh + G);
    var M = reduce(Zh + V2);
    var D = reduce(M + V2);
    var I = reduce(M + Zh);

    var E = reduce(A + S);
    var Ya = reduce(A + E);
    var F = reduce(A + Ya);
    var Kh = reduce(E + Ya);
    var Yu = reduce(S + E);
    var Ts = reduce(S + Yu);
    var Sh = reduce(E + Yu);

    var sky = reduce(B + G);
    var earth = reduce(A + V);
    var Z1 = reduce(sky + earth);
    var mPurpose = reduce(S + P);
    var zhPurpose = reduce(Rp + T);
    var Z2 = reduce(mPurpose + zhPurpose);
    var Z3 = reduce(Z1 + Z2);

    return {
      A:A, B:B, V:V, G:G, K:K,
      S:S, T:T, P:P, Rp:Rp,
      A1:A1, A2:A2, A3:A3,
      B1:B1, B2:B2, B3:B3,
      V1:V1, V2:V2,
      S1:S1, S2:S2,
      T1:T1, T2:T2,
      P1:P1, P2:P2,
      R1:R1, R2:R2,
      Zh:Zh, Z:Z, M:M, D:D, I:I,
      E:E, Ya:Ya, F:F, Kh:Kh, Yu:Yu, Ts:Ts, Sh:Sh,
      sky:sky, earth:earth, Z1:Z1,
      mPurpose:mPurpose, zhPurpose:zhPurpose, Z2:Z2, Z3:Z3
    };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getPositions() {
    var ax = CX - R, ay = CY;
    var bx = CX, by = CY - R;
    var vx = CX + R, vy = CY;
    var gx = CX, gy = CY + R;
    var sx = CX - R * COS45, sy = CY - R * COS45;
    var tx = CX + R * COS45, ty = CY - R * COS45;
    var px = CX + R * COS45, py = CY + R * COS45;
    var rx = CX - R * COS45, ry = CY + R * COS45;

    return {
      A: {x:ax, y:ay}, B: {x:bx, y:by}, V: {x:vx, y:vy}, G: {x:gx, y:gy},
      S: {x:sx, y:sy}, T: {x:tx, y:ty}, P: {x:px, y:py}, Rp: {x:rx, y:ry},
      K: {x:CX, y:CY},

      A1: {x: lerp(ax, CX, 0.25), y: ay},
      A2: {x: lerp(ax, CX, 0.50), y: ay},
      A3: {x: lerp(ax, CX, 0.75), y: ay},

      B1: {x: bx, y: lerp(by, CY, 0.25)},
      B2: {x: bx, y: lerp(by, CY, 0.50)},
      B3: {x: bx, y: lerp(by, CY, 0.75)},

      // Right horizontal: K -> Z2 -> Z1 -> V2 -> V1 -> V (5 equal gaps)
      Z2p: {x: lerp(CX, vx, 0.2), y: CY},
      Z1p: {x: lerp(CX, vx, 0.4), y: CY},
      V2:  {x: lerp(CX, vx, 0.6), y: CY},
      V1:  {x: lerp(CX, vx, 0.8), y: CY},

      S1: {x: lerp(sx, CX, 0.33), y: lerp(sy, CY, 0.33)},
      S2: {x: lerp(sx, CX, 0.67), y: lerp(sy, CY, 0.67)},
      T1: {x: lerp(tx, CX, 0.33), y: lerp(ty, CY, 0.33)},
      T2: {x: lerp(tx, CX, 0.67), y: lerp(ty, CY, 0.67)},
      P1: {x: lerp(px, CX, 0.33), y: lerp(py, CY, 0.33)},
      P2: {x: lerp(px, CX, 0.67), y: lerp(py, CY, 0.67)},
      R1: {x: lerp(rx, CX, 0.33), y: lerp(ry, CY, 0.33)},
      R2: {x: lerp(rx, CX, 0.67), y: lerp(ry, CY, 0.67)},

      // Bottom vertical: K -> Zh -> Z -> G (3 equal gaps)
      Zh: {x: gx, y: lerp(CY, gy, 1/3)},
      Z:  {x: gx, y: lerp(CY, gy, 2/3)},

      // Center cluster
      D: {x: CX + 78, y: CY + 62},
      M: {x: CX + 62, y: CY + 125},
      I: {x: CX + 30, y: CY + 170}
    };
  }

  function pulsatingPositions() {
    var pos = getPositions();
    var pts = [];
    var names = ["F", "Ya", "E", "Kh"];
    for (var i = 0; i < names.length; i++) {
      var t = (i + 1) / (names.length + 1);
      pts.push({ key: names[i], x: lerp(pos.A.x, pos.S.x, t), y: lerp(pos.A.y, pos.S.y, t) });
    }
    var names2 = ["Yu", "Ts", "Sh"];
    for (var j = 0; j < names2.length; j++) {
      var t2 = (j + 1) / (names2.length + 1);
      pts.push({ key: names2[j], x: lerp(pos.S.x, pos.B.x, t2), y: lerp(pos.S.y, pos.B.y, t2) });
    }
    return pts;
  }

  var GOLD = "#c9a96a";
  var GOLD_LIGHT = "#d4af37";
  var GOLD_DIM = "rgba(201,169,106,0.18)";
  var DARK_FILL = "#161514";

  function svgDefs() {
    return '<defs>' +
      '<radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="' + GOLD + '" stop-opacity="0.18"/>' +
        '<stop offset="100%" stop-color="' + GOLD + '" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">' +
        '<feGaussianBlur stdDeviation="4" result="blur"/>' +
        '<feFlood flood-color="' + GOLD + '" flood-opacity="0.3"/>' +
        '<feComposite in2="blur" operator="in"/>' +
        '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      '<filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">' +
        '<feGaussianBlur stdDeviation="2" result="blur"/>' +
        '<feFlood flood-color="' + GOLD + '" flood-opacity="0.15"/>' +
        '<feComposite in2="blur" operator="in"/>' +
        '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
    '</defs>';
  }

  function svgBackground() {
    return '<circle cx="' + CX + '" cy="' + CY + '" r="' + (R + 25) + '" fill="none" stroke="' + GOLD_DIM + '" stroke-width="1" stroke-dasharray="6 4"/>' +
      '<circle cx="' + CX + '" cy="' + CY + '" r="80" fill="url(#centerGlow)"/>';
  }

  function svgLine(x1, y1, x2, y2, op, w) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + GOLD + '" stroke-opacity="' + (op||0.2) + '" stroke-width="' + (w||1) + '"/>';
  }

  function svgLines(pos) {
    var s = "";
    var corners = [pos.A, pos.S, pos.B, pos.T, pos.V, pos.P, pos.G, pos.Rp];
    for (var i = 0; i < 8; i++) {
      s += svgLine(corners[i].x, corners[i].y, corners[(i+1)%8].x, corners[(i+1)%8].y, 0.3, 1.5);
    }
    // Diamond square
    s += svgLine(pos.A.x, pos.A.y, pos.B.x, pos.B.y, 0.18);
    s += svgLine(pos.B.x, pos.B.y, pos.V.x, pos.V.y, 0.18);
    s += svgLine(pos.V.x, pos.V.y, pos.G.x, pos.G.y, 0.18);
    s += svgLine(pos.G.x, pos.G.y, pos.A.x, pos.A.y, 0.18);
    // Straight square
    s += svgLine(pos.S.x, pos.S.y, pos.T.x, pos.T.y, 0.15);
    s += svgLine(pos.T.x, pos.T.y, pos.P.x, pos.P.y, 0.15);
    s += svgLine(pos.P.x, pos.P.y, pos.Rp.x, pos.Rp.y, 0.15);
    s += svgLine(pos.Rp.x, pos.Rp.y, pos.S.x, pos.S.y, 0.15);
    // Cross lines through center
    s += svgLine(pos.A.x, pos.A.y, pos.V.x, pos.V.y, 0.2, 0.8);
    s += svgLine(pos.B.x, pos.B.y, pos.G.x, pos.G.y, 0.2, 0.8);
    s += svgLine(pos.S.x, pos.S.y, pos.P.x, pos.P.y, 0.12, 0.8);
    s += svgLine(pos.T.x, pos.T.y, pos.Rp.x, pos.Rp.y, 0.12, 0.8);
    // Center cluster connections
    s += svgLine(pos.Zh.x, pos.Zh.y, pos.V2.x, pos.V2.y, 0.1, 0.5);
    s += svgLine(pos.M.x, pos.M.y, pos.V2.x, pos.V2.y, 0.08, 0.5);
    s += svgLine(pos.M.x, pos.M.y, pos.Zh.x, pos.Zh.y, 0.08, 0.5);
    s += svgLine(pos.D.x, pos.D.y, pos.M.x, pos.M.y, 0.06, 0.4);
    s += svgLine(pos.I.x, pos.I.y, pos.M.x, pos.M.y, 0.06, 0.4);
    s += svgLine(pos.I.x, pos.I.y, pos.Zh.x, pos.Zh.y, 0.06, 0.4);
    return s;
  }

  function svgCircle(x, y, val, r, strokeW, fontSize, filter, fillColor) {
    var fc = fillColor || DARK_FILL;
    var f = filter ? ' filter="url(#' + filter + ')"' : "";
    return '<g' + f + '>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fc + '" stroke="' + GOLD + '" stroke-width="' + strokeW + '"/>' +
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" fill="' + GOLD_LIGHT + '" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="' + fontSize + '">' + val + '</text>' +
    '</g>';
  }

  function svgPoints(data, pos) {
    var s = "";

    // Center
    s += svgCircle(pos.K.x, pos.K.y, data.K, 38, 2.5, 24, "goldGlow", "#110f08");

    // 4 diagonal square corners
    s += svgCircle(pos.A.x, pos.A.y, data.A, 34, 2.5, 22, "softGlow");
    s += svgCircle(pos.B.x, pos.B.y, data.B, 34, 2.5, 22, "softGlow");
    s += svgCircle(pos.V.x, pos.V.y, data.V, 34, 2.5, 22, "softGlow");
    s += svgCircle(pos.G.x, pos.G.y, data.G, 34, 2.5, 22, "softGlow");

    // 4 straight square corners
    s += svgCircle(pos.S.x, pos.S.y, data.S, 28, 2, 18, "softGlow");
    s += svgCircle(pos.T.x, pos.T.y, data.T, 28, 2, 18, "softGlow");
    s += svgCircle(pos.P.x, pos.P.y, data.P, 28, 2, 18, "softGlow");
    s += svgCircle(pos.Rp.x, pos.Rp.y, data.Rp, 28, 2, 18, "softGlow");

    // Intermediate points on all lines
    var sm = [
      ["A1","A1"], ["A2","A2"], ["A3","A3"],
      ["B1","B1"], ["B2","B2"], ["B3","B3"],
      ["V1","V1"], ["V2","V2"],
      ["S1","S1"], ["S2","S2"],
      ["T1","T1"], ["T2","T2"],
      ["P1","P1"], ["P2","P2"],
      ["R1","R1"], ["R2","R2"]
    ];
    for (var i = 0; i < sm.length; i++) {
      var p = pos[sm[i][0]];
      var v = data[sm[i][1]];
      s += svgCircle(p.x, p.y, v, 17, 1.2, 12, null);
    }

    // Two purpose points on horizontal right of K
    s += svgCircle(pos.Z2p.x, pos.Z2p.y, data.Z2, 17, 1.2, 12, null);
    s += svgCircle(pos.Z1p.x, pos.Z1p.y, data.Z1, 17, 1.2, 12, null);

    // Bottom vertical intermediates (Zh, Z)
    s += svgCircle(pos.Zh.x, pos.Zh.y, data.Zh, 20, 1.5, 14, null);
    s += svgCircle(pos.Z.x, pos.Z.y, data.Z, 20, 1.5, 14, null);

    // Center cluster (D, M, I)
    s += svgCircle(pos.D.x, pos.D.y, data.D, 15, 1, 11, null);
    s += svgCircle(pos.M.x, pos.M.y, data.M, 15, 1, 11, null);
    s += svgCircle(pos.I.x, pos.I.y, data.I, 15, 1, 11, null);

    // Pulsating energies on outer ring
    var pulse = pulsatingPositions();
    var pulseData = {F:data.F, Ya:data.Ya, E:data.E, Kh:data.Kh, Yu:data.Yu, Ts:data.Ts, Sh:data.Sh};
    for (var j = 0; j < pulse.length; j++) {
      s += svgCircle(pulse[j].x, pulse[j].y, pulseData[pulse[j].key], 12, 0.8, 9, null);
    }

    return s;
  }

  function svgAgeLabels(pos) {
    var s = "";
    var ages = [
      {p:pos.A, label:"0", anchor:"end", dx:-42, dy:5},
      {p:pos.S, label:"10", anchor:"end", dx:-34, dy:-5},
      {p:pos.B, label:"20", anchor:"middle", dx:0, dy:-42},
      {p:pos.T, label:"30", anchor:"start", dx:34, dy:-5},
      {p:pos.V, label:"40", anchor:"start", dx:42, dy:5},
      {p:pos.P, label:"50", anchor:"start", dx:34, dy:18},
      {p:pos.G, label:"60", anchor:"middle", dx:0, dy:46},
      {p:pos.Rp, label:"70", anchor:"end", dx:-34, dy:18}
    ];
    for (var i = 0; i < ages.length; i++) {
      var a = ages[i];
      s += '<text x="' + (a.p.x + a.dx) + '" y="' + (a.p.y + a.dy) + '" text-anchor="' + a.anchor + '" fill="' + GOLD + '" font-family="\'Inter\',sans-serif" font-size="12" font-weight="400" opacity="0.65">' + a.label + '</text>';
    }
    var midAngles = [157.5, 112.5, 67.5, 22.5, 337.5, 292.5, 247.5, 202.5];
    var midLabels = ["5", "15", "25", "35", "45", "55", "65", "75"];
    var midR = R + 32;
    for (var k = 0; k < 8; k++) {
      var angle = midAngles[k] * Math.PI / 180;
      s += '<text x="' + (CX + midR * Math.cos(angle)) + '" y="' + (CY - midR * Math.sin(angle)) + '" text-anchor="middle" dominant-baseline="central" fill="' + GOLD + '" font-family="\'Inter\',sans-serif" font-size="10" font-weight="300" opacity="0.4">' + midLabels[k] + '</text>';
    }
    return s;
  }

  function svgDecorations() {
    return '<text x="' + (CX + 145) + '" y="' + (CY + 55) + '" text-anchor="middle" fill="' + GOLD + '" font-family="serif" font-size="18" opacity="0.3">$</text>' +
      '<text x="' + (CX + 50) + '" y="' + (CY + 210) + '" text-anchor="middle" fill="' + GOLD + '" font-size="16" opacity="0.3">♡</text>';
  }

  function renderMatrix(data) {
    var svg = document.getElementById("matrixSvg");
    var pos = getPositions();
    svg.innerHTML = svgDefs() + svgBackground() + svgLines(pos) + svgPoints(data, pos) + svgAgeLabels(pos) + svgDecorations();
  }

  function updatePurpose(data) {
    document.getElementById("skyVal").textContent = data.sky;
    document.getElementById("earthVal").textContent = data.earth;
    document.getElementById("z1Val").textContent = data.Z1;
    document.getElementById("mPurpVal").textContent = data.mPurpose;
    document.getElementById("zhPurpVal").textContent = data.zhPurpose;
    document.getElementById("z2Val").textContent = data.Z2;
    document.getElementById("z3Val").textContent = data.Z3;
  }

  function validate(day, month, year) {
    if (!day || !month || !year) return "Please enter your full date of birth.";
    if (day < 1 || day > 31) return "Day must be between 1 and 31.";
    if (month < 1 || month > 12) return "Month must be between 1 and 12.";
    if (year < 1900 || year > 2030) return "Please enter a valid year.";
    var d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day)
      return "That date does not exist.";
    return null;
  }

  var selectedGender = "female";

  document.addEventListener("DOMContentLoaded", function () {
    var femaleBtn = document.getElementById("femaleBtn");
    var maleBtn = document.getElementById("maleBtn");
    var calcBtn = document.getElementById("calculateBtn");
    var recalcBtn = document.getElementById("recalculateBtn");
    var errorEl = document.getElementById("errorMsg");
    var formSection = document.getElementById("formSection");
    var resultSection = document.getElementById("resultSection");

    femaleBtn.addEventListener("click", function () {
      selectedGender = "female";
      femaleBtn.classList.add("active");
      maleBtn.classList.remove("active");
    });
    maleBtn.addEventListener("click", function () {
      selectedGender = "male";
      maleBtn.classList.add("active");
      femaleBtn.classList.remove("active");
    });

    calcBtn.addEventListener("click", function () {
      var day = parseInt(document.getElementById("dayInput").value);
      var month = parseInt(document.getElementById("monthInput").value);
      var year = parseInt(document.getElementById("yearInput").value);
      var name = document.getElementById("nameInput").value.trim();

      var err = validate(day, month, year);
      if (err) { errorEl.textContent = err; errorEl.style.display = "block"; return; }
      errorEl.style.display = "none";

      var data = calculateMatrix(day, month, year);
      renderMatrix(data);
      updatePurpose(data);

      document.getElementById("resultName").textContent = name || "Your Matrix";
      document.getElementById("resultDob").textContent =
        day + "." + (month < 10 ? "0" + month : month) + "." + year + " • " + (selectedGender === "female" ? "Female" : "Male");

      formSection.style.display = "none";
      resultSection.style.display = "block";
      resultSection.classList.add("fade-in");
      window.scrollTo({top: 0, behavior: "smooth"});
    });

    recalcBtn.addEventListener("click", function () {
      resultSection.style.display = "none";
      resultSection.classList.remove("fade-in");
      formSection.style.display = "block";
      window.scrollTo({top: 0, behavior: "smooth"});
    });
  });
})();
