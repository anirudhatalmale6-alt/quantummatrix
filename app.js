(function () {
  "use strict";

  var CX = 500, CY = 500, R = 390;
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
      A:A,B:B,V:V,G:G,K:K,S:S,T:T,P:P,Rp:Rp,
      A1:A1,A2:A2,A3:A3,B1:B1,B2:B2,B3:B3,V1:V1,V2:V2,
      S1:S1,S2:S2,T1:T1,T2:T2,P1:P1,P2:P2,R1:R1,R2:R2,
      Zh:Zh,Z:Z,M:M,D:D,I:I,
      E:E,Ya:Ya,F:F,Kh:Kh,Yu:Yu,Ts:Ts,Sh:Sh,
      sky:sky,earth:earth,Z1:Z1,mPurpose:mPurpose,zhPurpose:zhPurpose,Z2:Z2,Z3:Z3
    };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getPositions() {
    var ax = CX - R, ay = CY;
    var bx = CX, by = CY - R;
    var vx = CX + R, vy = CY;
    var gx = CX, gy = CY + R;
    var d45 = R * COS45;
    var sx = CX - d45, sy = CY - d45;
    var tx = CX + d45, ty = CY - d45;
    var px = CX + d45, py = CY + d45;
    var rx = CX - d45, ry = CY + d45;

    return {
      A:{x:ax,y:ay}, B:{x:bx,y:by}, V:{x:vx,y:vy}, G:{x:gx,y:gy},
      S:{x:sx,y:sy}, T:{x:tx,y:ty}, P:{x:px,y:py}, Rp:{x:rx,y:ry},
      K:{x:CX,y:CY},

      // Left horizontal: A→K, points clustered near A
      A1:{x:lerp(ax,CX,0.21), y:ay},
      A2:{x:lerp(ax,CX,0.38), y:ay},
      A3:{x:lerp(ax,CX,0.69), y:ay},

      // Top vertical: B→K, points clustered near B
      B1:{x:bx, y:lerp(by,CY,0.25)},
      B2:{x:bx, y:lerp(by,CY,0.46)},
      B3:{x:bx, y:lerp(by,CY,0.71)},

      // Right horizontal: K→V with 4 intermediates
      Z2p:{x:lerp(CX,vx,0.15), y:CY},
      Z1p:{x:lerp(CX,vx,0.31), y:CY},
      V2: {x:lerp(CX,vx,0.45), y:CY},
      V1: {x:lerp(CX,vx,0.70), y:CY},

      // Upper-left diagonal: S→K at ~30% and ~55%
      S1:{x:lerp(sx,CX,0.30), y:lerp(sy,CY,0.30)},
      S2:{x:lerp(sx,CX,0.55), y:lerp(sy,CY,0.55)},

      // Upper-right diagonal: T→K at ~30% and ~58%
      T1:{x:lerp(tx,CX,0.30), y:lerp(ty,CY,0.30)},
      T2:{x:lerp(tx,CX,0.58), y:lerp(ty,CY,0.58)},

      // Lower-right diagonal: P→K at ~30% and ~55%
      P1:{x:lerp(px,CX,0.30), y:lerp(py,CY,0.30)},
      P2:{x:lerp(px,CX,0.55), y:lerp(py,CY,0.55)},

      // Lower-left diagonal: Rp→K at ~28% and ~52%
      R1:{x:lerp(rx,CX,0.28), y:lerp(ry,CY,0.28)},
      R2:{x:lerp(rx,CX,0.52), y:lerp(ry,CY,0.52)},

      // Bottom vertical: K→G at ~44% and ~62%
      Zh:{x:gx, y:lerp(CY,gy,0.44)},
      Z: {x:gx, y:lerp(CY,gy,0.62)},

      // Center cluster - right of vertical, below horizontal
      D: {x:CX+85, y:CY+40},
      M: {x:CX+65, y:CY+105},
      I: {x:CX+35, y:CY+160}
    };
  }

  function pulsatingPositions() {
    var pos = getPositions();
    var pts = [];
    var names = ["F","Ya","E","Kh"];
    for (var i = 0; i < names.length; i++) {
      var t = (i + 1) / (names.length + 1);
      pts.push({key:names[i], x:lerp(pos.A.x,pos.S.x,t), y:lerp(pos.A.y,pos.S.y,t)});
    }
    var names2 = ["Yu","Ts","Sh"];
    for (var j = 0; j < names2.length; j++) {
      var t2 = (j + 1) / (names2.length + 1);
      pts.push({key:names2[j], x:lerp(pos.S.x,pos.B.x,t2), y:lerp(pos.S.y,pos.B.y,t2)});
    }
    return pts;
  }

  var GOLD = "#c9a96a";
  var GOLD_LIGHT = "#d4af37";
  var GOLD_DIM = "rgba(201,169,106,0.18)";
  var DARK_FILL = "#151413";

  function svgDefs() {
    return '<defs>' +
      '<radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="'+GOLD+'" stop-opacity="0.18"/><stop offset="100%" stop-color="'+GOLD+'" stop-opacity="0"/></radialGradient>' +
      '<filter id="gG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="'+GOLD+'" flood-opacity="0.3"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '<filter id="sG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feFlood flood-color="'+GOLD+'" flood-opacity="0.15"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '</defs>';
  }

  function svgBg() {
    return '<circle cx="'+CX+'" cy="'+CY+'" r="'+(R+22)+'" fill="none" stroke="'+GOLD_DIM+'" stroke-width="1" stroke-dasharray="6 4"/>' +
      '<circle cx="'+CX+'" cy="'+CY+'" r="75" fill="url(#cg)"/>';
  }

  function L(x1,y1,x2,y2,o,w) {
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+GOLD+'" stroke-opacity="'+(o||0.2)+'" stroke-width="'+(w||1)+'"/>';
  }

  function svgLines(p) {
    var s = "";
    var c = [p.A,p.S,p.B,p.T,p.V,p.P,p.G,p.Rp];
    for (var i=0;i<8;i++) s += L(c[i].x,c[i].y,c[(i+1)%8].x,c[(i+1)%8].y,0.28,1.5);
    // Diamond edges
    s+=L(p.A.x,p.A.y,p.B.x,p.B.y,0.18);
    s+=L(p.B.x,p.B.y,p.V.x,p.V.y,0.18);
    s+=L(p.V.x,p.V.y,p.G.x,p.G.y,0.18);
    s+=L(p.G.x,p.G.y,p.A.x,p.A.y,0.18);
    // Straight square edges
    s+=L(p.S.x,p.S.y,p.T.x,p.T.y,0.15);
    s+=L(p.T.x,p.T.y,p.P.x,p.P.y,0.15);
    s+=L(p.P.x,p.P.y,p.Rp.x,p.Rp.y,0.15);
    s+=L(p.Rp.x,p.Rp.y,p.S.x,p.S.y,0.15);
    // Cross lines
    s+=L(p.A.x,p.A.y,p.V.x,p.V.y,0.18,0.8);
    s+=L(p.B.x,p.B.y,p.G.x,p.G.y,0.18,0.8);
    s+=L(p.S.x,p.S.y,p.P.x,p.P.y,0.12,0.8);
    s+=L(p.T.x,p.T.y,p.Rp.x,p.Rp.y,0.12,0.8);
    // Center cluster links
    s+=L(p.Zh.x,p.Zh.y,p.V2.x,p.V2.y,0.08,0.5);
    s+=L(p.M.x,p.M.y,p.V2.x,p.V2.y,0.06,0.4);
    s+=L(p.M.x,p.M.y,p.Zh.x,p.Zh.y,0.06,0.4);
    s+=L(p.D.x,p.D.y,p.M.x,p.M.y,0.05,0.4);
    s+=L(p.I.x,p.I.y,p.M.x,p.M.y,0.05,0.4);
    s+=L(p.I.x,p.I.y,p.Zh.x,p.Zh.y,0.05,0.4);
    return s;
  }

  function C(x,y,v,r,sw,fs,fl,fc) {
    var f = fl ? ' filter="url(#'+fl+')"' : '';
    return '<g'+f+'><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(fc||DARK_FILL)+'" stroke="'+GOLD+'" stroke-width="'+sw+'"/>' +
      '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" fill="'+GOLD_LIGHT+'" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="'+fs+'">'+v+'</text></g>';
  }

  function svgPoints(d, p) {
    var s = "";
    // Center K
    s += C(p.K.x,p.K.y,d.K,40,2.5,26,"gG","#110f08");
    // Diamond corners (largest)
    s += C(p.A.x,p.A.y,d.A,36,2.5,24,"sG");
    s += C(p.B.x,p.B.y,d.B,36,2.5,24,"sG");
    s += C(p.V.x,p.V.y,d.V,36,2.5,24,"sG");
    s += C(p.G.x,p.G.y,d.G,36,2.5,24,"sG");
    // Straight square corners
    s += C(p.S.x,p.S.y,d.S,28,2,18,"sG");
    s += C(p.T.x,p.T.y,d.T,28,2,18,"sG");
    s += C(p.P.x,p.P.y,d.P,28,2,18,"sG");
    s += C(p.Rp.x,p.Rp.y,d.Rp,28,2,18,"sG");
    // Line intermediates
    var pts = [
      ["A1","A1",17],["A2","A2",17],["A3","A3",16],
      ["B1","B1",19],["B2","B2",19],["B3","B3",18],
      ["V2","V2",20],["V1","V1",17],
      ["S1","S1",15],["S2","S2",15],
      ["T1","T1",15],["T2","T2",15],
      ["P1","P1",15],["P2","P2",15],
      ["R1","R1",15],["R2","R2",15]
    ];
    for (var i=0;i<pts.length;i++) {
      var pp=p[pts[i][0]], vv=d[pts[i][1]], rr=pts[i][2];
      s += C(pp.x,pp.y,vv,rr,1.2,rr<16?10:12,null);
    }
    // Two horizontal purpose points right of K
    s += C(p.Z2p.x,p.Z2p.y,d.Z2,15,1,11,null);
    s += C(p.Z1p.x,p.Z1p.y,d.Z1,15,1,11,null);
    // Zh and Z (bottom vertical)
    s += C(p.Zh.x,p.Zh.y,d.Zh,21,1.5,14,null);
    s += C(p.Z.x,p.Z.y,d.Z,21,1.5,14,null);
    // Center cluster
    s += C(p.D.x,p.D.y,d.D,15,1,11,null);
    s += C(p.M.x,p.M.y,d.M,15,1,11,null);
    s += C(p.I.x,p.I.y,d.I,15,1,11,null);
    // Pulsating energies
    var pulse = pulsatingPositions();
    var pd = {F:d.F,Ya:d.Ya,E:d.E,Kh:d.Kh,Yu:d.Yu,Ts:d.Ts,Sh:d.Sh};
    for (var j=0;j<pulse.length;j++) s += C(pulse[j].x,pulse[j].y,pd[pulse[j].key],11,0.8,8,null);
    return s;
  }

  function svgLabels(p) {
    var s = "";
    var st = 'fill="'+GOLD+'" font-family="\'Inter\',sans-serif" font-weight="400" opacity="0.6"';
    var ages = [
      [p.A,"0","end",-44,5],[p.S,"10","end",-34,-5],[p.B,"20","middle",0,-44],
      [p.T,"30","start",34,-5],[p.V,"40","start",44,5],[p.P,"50","start",34,18],
      [p.G,"60","middle",0,48],[p.Rp,"70","end",-34,18]
    ];
    for (var i=0;i<ages.length;i++) {
      var a=ages[i];
      s+='<text x="'+(a[0].x+a[3])+'" y="'+(a[0].y+a[4])+'" text-anchor="'+a[2]+'" font-size="12" '+st+'>'+a[1]+'</text>';
    }
    var ma=[157.5,112.5,67.5,22.5,337.5,292.5,247.5,202.5];
    var ml=["5","15","25","35","45","55","65","75"];
    for (var k=0;k<8;k++) {
      var an=ma[k]*Math.PI/180, mr=R+30;
      s+='<text x="'+(CX+mr*Math.cos(an))+'" y="'+(CY-mr*Math.sin(an))+'" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="300" opacity="0.35" '+st+'>'+ml[k]+'</text>';
    }
    return s;
  }

  function svgDeco() {
    return '<text x="'+(CX+155)+'" y="'+(CY+60)+'" text-anchor="middle" fill="'+GOLD+'" font-family="serif" font-size="18" opacity="0.25">$</text>' +
      '<text x="'+(CX+45)+'" y="'+(CY+210)+'" text-anchor="middle" fill="'+GOLD+'" font-size="16" opacity="0.25">♡</text>';
  }

  function renderMatrix(data) {
    var svg = document.getElementById("matrixSvg");
    var pos = getPositions();
    svg.innerHTML = svgDefs()+svgBg()+svgLines(pos)+svgPoints(data,pos)+svgLabels(pos)+svgDeco();
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

  function validate(day,month,year) {
    if (!day||!month||!year) return "Please enter your full date of birth.";
    if (day<1||day>31) return "Day must be between 1 and 31.";
    if (month<1||month>12) return "Month must be between 1 and 12.";
    if (year<1900||year>2030) return "Please enter a valid year.";
    var d=new Date(year,month-1,day);
    if (d.getFullYear()!==year||d.getMonth()!==month-1||d.getDate()!==day) return "That date does not exist.";
    return null;
  }

  var gender = "female";

  document.addEventListener("DOMContentLoaded", function() {
    var fBtn=document.getElementById("femaleBtn"), mBtn=document.getElementById("maleBtn");
    var calcBtn=document.getElementById("calculateBtn"), recBtn=document.getElementById("recalculateBtn");
    var errEl=document.getElementById("errorMsg");
    var formS=document.getElementById("formSection"), resS=document.getElementById("resultSection");

    fBtn.onclick=function(){gender="female";fBtn.classList.add("active");mBtn.classList.remove("active");};
    mBtn.onclick=function(){gender="male";mBtn.classList.add("active");fBtn.classList.remove("active");};

    calcBtn.onclick=function() {
      var day=parseInt(document.getElementById("dayInput").value);
      var month=parseInt(document.getElementById("monthInput").value);
      var year=parseInt(document.getElementById("yearInput").value);
      var name=document.getElementById("nameInput").value.trim();
      var err=validate(day,month,year);
      if(err){errEl.textContent=err;errEl.style.display="block";return;}
      errEl.style.display="none";
      var data=calculateMatrix(day,month,year);
      renderMatrix(data);
      updatePurpose(data);
      document.getElementById("resultName").textContent=name||"Your Matrix";
      document.getElementById("resultDob").textContent=day+"."+(month<10?"0"+month:month)+"."+year+" • "+(gender==="female"?"Female":"Male");
      formS.style.display="none";resS.style.display="block";resS.classList.add("fade-in");
      window.scrollTo({top:0,behavior:"smooth"});
    };

    recBtn.onclick=function() {
      resS.style.display="none";resS.classList.remove("fade-in");formS.style.display="block";
      window.scrollTo({top:0,behavior:"smooth"});
    };
  });
})();
