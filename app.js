(function () {
  "use strict";
  var CX = 500, CY = 500, R = 390;
  var COS45 = Math.cos(Math.PI / 4);

  // Chakra colors
  var CLR = {
    purple: "#8e44ad", blue: "#2980b9", cyan: "#17a2b8",
    green: "#27ae60", yellow: "#f1c40f", orange: "#e67e22", red: "#c0392b",
    dark: "#131211", gold: "#c9a96a", goldLight: "#d4af37"
  };

  function reduce(n) {
    n = Math.abs(Math.round(n));
    while (n > 22) { var s=0,t=n; while(t>0){s+=t%10;t=Math.floor(t/10);} n=s; }
    return n;
  }

  function calculateMatrix(day, month, year) {
    var A=reduce(day), B=month;
    var V=reduce(String(year).split("").reduce(function(s,d){return s+parseInt(d);},0));
    var G=reduce(A+B+V), K=reduce(A+B+V+G);
    var S=reduce(A+B),T=reduce(B+V),P=reduce(V+G),Rp=reduce(G+A);
    var A2=reduce(A+K),A1=reduce(A2+A),A3=reduce(A2+K);
    var B2=reduce(B+K),B1=reduce(B2+B),B3=reduce(B2+K);
    var V2=reduce(V+K),V1=reduce(V2+V);
    var S2=reduce(K+S),S1=reduce(S+S2);
    var T2=reduce(T+K),T1=reduce(T+T2);
    var P2=reduce(P+K),P1=reduce(P+P2);
    var R2=reduce(K+Rp),R1=reduce(R2+Rp);
    var Zh=reduce(K+G),Z=reduce(Zh+G);
    var M=reduce(Zh+V2),D=reduce(M+V2),I=reduce(M+Zh);
    var E=reduce(A+S),Ya=reduce(A+E),F=reduce(A+Ya);
    var Kh=reduce(E+Ya),Yu=reduce(S+E),Ts=reduce(S+Yu),Sh=reduce(E+Yu);
    var sky=reduce(B+G),earth=reduce(A+V),Z1=reduce(sky+earth);
    var mP=reduce(S+P),zhP=reduce(Rp+T),Z2=reduce(mP+zhP),Z3=reduce(Z1+Z2);
    return {A:A,B:B,V:V,G:G,K:K,S:S,T:T,P:P,Rp:Rp,
      A1:A1,A2:A2,A3:A3,B1:B1,B2:B2,B3:B3,V1:V1,V2:V2,
      S1:S1,S2:S2,T1:T1,T2:T2,P1:P1,P2:P2,R1:R1,R2:R2,
      Zh:Zh,Z:Z,M:M,D:D,I:I,E:E,Ya:Ya,F:F,Kh:Kh,Yu:Yu,Ts:Ts,Sh:Sh,
      sky:sky,earth:earth,Z1:Z1,mP:mP,zhP:zhP,Z2:Z2,Z3:Z3};
  }

  function lerp(a,b,t){return a+(b-a)*t;}

  function getPositions() {
    var ax=CX-R,ay=CY, bx=CX,by=CY-R, vx=CX+R,vy=CY, gx=CX,gy=CY+R;
    var d45=R*COS45;
    var sx=CX-d45,sy=CY-d45, tx=CX+d45,ty=CY-d45;
    var px=CX+d45,py=CY+d45, rx=CX-d45,ry=CY+d45;
    return {
      A:{x:ax,y:ay},B:{x:bx,y:by},V:{x:vx,y:vy},G:{x:gx,y:gy},
      S:{x:sx,y:sy},T:{x:tx,y:ty},P:{x:px,y:py},Rp:{x:rx,y:ry},
      K:{x:CX,y:CY},
      // Left horiz: clustered near A
      A1:{x:lerp(ax,CX,0.21),y:ay}, A2:{x:lerp(ax,CX,0.38),y:ay}, A3:{x:lerp(ax,CX,0.69),y:ay},
      // Top vert: clustered near B
      B1:{x:bx,y:lerp(by,CY,0.25)}, B2:{x:bx,y:lerp(by,CY,0.46)}, B3:{x:bx,y:lerp(by,CY,0.71)},
      // Right horiz: K -> Z2p -> Z1p -> V2 -> V1 -> V
      Z2p:{x:lerp(CX,vx,0.15),y:CY}, Z1p:{x:lerp(CX,vx,0.31),y:CY},
      V2:{x:lerp(CX,vx,0.47),y:CY}, V1:{x:lerp(CX,vx,0.70),y:CY},
      // Diagonals ~30% and ~55%
      S1:{x:lerp(sx,CX,0.30),y:lerp(sy,CY,0.30)}, S2:{x:lerp(sx,CX,0.55),y:lerp(sy,CY,0.55)},
      T1:{x:lerp(tx,CX,0.30),y:lerp(ty,CY,0.30)}, T2:{x:lerp(tx,CX,0.58),y:lerp(ty,CY,0.58)},
      P1:{x:lerp(px,CX,0.30),y:lerp(py,CY,0.30)}, P2:{x:lerp(px,CX,0.55),y:lerp(py,CY,0.55)},
      R1:{x:lerp(rx,CX,0.28),y:lerp(ry,CY,0.28)}, R2:{x:lerp(rx,CX,0.52),y:lerp(ry,CY,0.52)},
      // Bottom vert: tight cluster then Zh, Z
      Zh:{x:gx,y:lerp(CY,gy,0.46)}, Z:{x:gx,y:lerp(CY,gy,0.64)},
      // Center cluster - TIGHT, on the diagonal K->P offset
      D:{x:CX+38,y:CY+28}, M:{x:CX+28,y:CY+58}, I:{x:CX+12,y:CY+85}
    };
  }

  function pulsatingPositions() {
    var p=getPositions(), pts=[];
    var n1=["F","Ya","E","Kh"];
    for(var i=0;i<n1.length;i++){var t=(i+1)/(n1.length+1);pts.push({key:n1[i],x:lerp(p.A.x,p.S.x,t),y:lerp(p.A.y,p.S.y,t)});}
    var n2=["Yu","Ts","Sh"];
    for(var j=0;j<n2.length;j++){var t2=(j+1)/(n2.length+1);pts.push({key:n2[j],x:lerp(p.S.x,p.B.x,t2),y:lerp(p.S.y,p.B.y,t2)});}
    return pts;
  }

  function svgDefs() {
    var s = '<defs>';
    s += '<radialGradient id="cg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="'+CLR.yellow+'" stop-opacity="0.2"/><stop offset="100%" stop-color="'+CLR.yellow+'" stop-opacity="0"/></radialGradient>';
    var colors = [["purple",CLR.purple],["blue",CLR.blue],["cyan",CLR.cyan],["green",CLR.green],["yellow",CLR.yellow],["orange",CLR.orange],["red",CLR.red]];
    for (var i=0;i<colors.length;i++) {
      s += '<filter id="gl_'+colors[i][0]+'" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feFlood flood-color="'+colors[i][1]+'" flood-opacity="0.4"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    }
    s += '<filter id="gl_gold" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feFlood flood-color="'+CLR.gold+'" flood-opacity="0.15"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    s += '</defs>';
    return s;
  }

  function svgBg() {
    return '<circle cx="'+CX+'" cy="'+CY+'" r="'+(R+22)+'" fill="none" stroke="rgba(201,169,106,0.15)" stroke-width="1" stroke-dasharray="6 4"/>' +
      '<circle cx="'+CX+'" cy="'+CY+'" r="80" fill="url(#cg)"/>';
  }

  function ln(x1,y1,x2,y2,o,w){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+CLR.gold+'" stroke-opacity="'+(o||0.2)+'" stroke-width="'+(w||1)+'"/>';}

  function svgLines(p) {
    var s="";
    var c=[p.A,p.S,p.B,p.T,p.V,p.P,p.G,p.Rp];
    for(var i=0;i<8;i++) s+=ln(c[i].x,c[i].y,c[(i+1)%8].x,c[(i+1)%8].y,0.25,1.5);
    // Diamond
    s+=ln(p.A.x,p.A.y,p.B.x,p.B.y,0.18);s+=ln(p.B.x,p.B.y,p.V.x,p.V.y,0.18);
    s+=ln(p.V.x,p.V.y,p.G.x,p.G.y,0.18);s+=ln(p.G.x,p.G.y,p.A.x,p.A.y,0.18);
    // Straight square
    s+=ln(p.S.x,p.S.y,p.T.x,p.T.y,0.15);s+=ln(p.T.x,p.T.y,p.P.x,p.P.y,0.15);
    s+=ln(p.P.x,p.P.y,p.Rp.x,p.Rp.y,0.15);s+=ln(p.Rp.x,p.Rp.y,p.S.x,p.S.y,0.15);
    // Cross lines
    s+=ln(p.A.x,p.A.y,p.V.x,p.V.y,0.18,0.8);s+=ln(p.B.x,p.B.y,p.G.x,p.G.y,0.18,0.8);
    s+=ln(p.S.x,p.S.y,p.P.x,p.P.y,0.12,0.8);s+=ln(p.T.x,p.T.y,p.Rp.x,p.Rp.y,0.12,0.8);
    // Center cluster line (K through D,M,I toward lower area)
    s+=ln(p.K.x,p.K.y,p.I.x,p.I.y,0.1,0.5);
    s+=ln(p.D.x,p.D.y,p.M.x,p.M.y,0.08,0.4);
    s+=ln(p.M.x,p.M.y,p.I.x,p.I.y,0.08,0.4);
    s+=ln(p.Zh.x,p.Zh.y,p.V2.x,p.V2.y,0.08,0.5);
    s+=ln(p.M.x,p.M.y,p.Zh.x,p.Zh.y,0.06,0.4);
    s+=ln(p.M.x,p.M.y,p.V2.x,p.V2.y,0.06,0.4);
    return s;
  }

  // Colored circle with chakra fill
  function cc(x,y,v,r,color,sw,fs,glow) {
    var fill = color || CLR.dark;
    var stroke = color ? "rgba(255,255,255,0.15)" : CLR.gold;
    var textFill = color ? "#fff" : CLR.goldLight;
    var fl = glow ? ' filter="url(#gl_'+glow+')"' : '';
    return '<g'+fl+'><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'"/>' +
      '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" fill="'+textFill+'" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="'+fs+'">'+v+'</text></g>';
  }

  // Plain gold circle (no chakra color)
  function gc(x,y,v,r,sw,fs) {
    return '<g><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+CLR.dark+'" stroke="'+CLR.gold+'" stroke-width="'+sw+'"/>' +
      '<text x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" fill="'+CLR.goldLight+'" font-family="\'Cormorant Garamond\',serif" font-weight="600" font-size="'+fs+'">'+v+'</text></g>';
  }

  function svgPoints(d, p) {
    var s = "";
    // Center K - yellow
    s += cc(p.K.x,p.K.y,d.K,40,CLR.yellow,2.5,26,"yellow");
    // Diamond corners
    s += cc(p.A.x,p.A.y,d.A,36,CLR.purple,2,24,"purple");
    s += cc(p.B.x,p.B.y,d.B,36,CLR.purple,2,24,"purple");
    s += cc(p.V.x,p.V.y,d.V,36,CLR.red,2,24,"red");
    s += cc(p.G.x,p.G.y,d.G,36,CLR.red,2,24,"red");
    // Straight square corners - dark with white text
    s += gc(p.S.x,p.S.y,d.S,28,2,18);
    s += gc(p.T.x,p.T.y,d.T,28,2,18);
    s += gc(p.P.x,p.P.y,d.P,28,2,18);
    s += gc(p.Rp.x,p.Rp.y,d.Rp,28,2,18);
    // Left horizontal intermediates - blue, cyan, green
    s += cc(p.A1.x,p.A1.y,d.A1,17,CLR.blue,1.5,12,"blue");
    s += cc(p.A2.x,p.A2.y,d.A2,16,CLR.cyan,1.5,12,"cyan");
    s += gc(p.A3.x,p.A3.y,d.A3,15,1.2,11);
    // Top vertical intermediates - blue, cyan, green
    s += cc(p.B1.x,p.B1.y,d.B1,19,CLR.blue,1.5,13,"blue");
    s += cc(p.B2.x,p.B2.y,d.B2,19,CLR.cyan,1.5,13,"cyan");
    s += cc(p.B3.x,p.B3.y,d.B3,18,CLR.green,1.5,13,"green");
    // Right horizontal: Z2p, Z1p plain; V2 orange; V1 plain
    s += gc(p.Z2p.x,p.Z2p.y,d.Z2,15,1,11);
    s += gc(p.Z1p.x,p.Z1p.y,d.Z1,15,1,11);
    s += cc(p.V2.x,p.V2.y,d.V2,20,CLR.orange,1.5,14,"orange");
    s += gc(p.V1.x,p.V1.y,d.V1,16,1.2,12);
    // Diagonal intermediates - all plain gold
    var diags=[["S1","S1"],["S2","S2"],["T1","T1"],["T2","T2"],["P1","P1"],["P2","P2"],["R1","R1"],["R2","R2"]];
    for(var i=0;i<diags.length;i++) {var pp=p[diags[i][0]];s+=gc(pp.x,pp.y,d[diags[i][1]],15,1,11);}
    // Bottom vertical: Zh orange, Z orange
    s += cc(p.Zh.x,p.Zh.y,d.Zh,21,CLR.orange,1.5,14,"orange");
    s += cc(p.Z.x,p.Z.y,d.Z,21,CLR.orange,1.5,14,"orange");
    // Center cluster - tight, plain
    s += gc(p.D.x,p.D.y,d.D,14,1,10);
    s += gc(p.M.x,p.M.y,d.M,14,1,10);
    s += gc(p.I.x,p.I.y,d.I,14,1,10);
    // Pulsating energies
    var pulse=pulsatingPositions();
    var pd={F:d.F,Ya:d.Ya,E:d.E,Kh:d.Kh,Yu:d.Yu,Ts:d.Ts,Sh:d.Sh};
    for(var j=0;j<pulse.length;j++) s+=gc(pulse[j].x,pulse[j].y,pd[pulse[j].key],11,0.8,8);
    return s;
  }

  function svgLabels(p) {
    var s="",st='fill="'+CLR.gold+'" font-family="\'Inter\',sans-serif" font-weight="400" opacity="0.6"';
    var ages=[[p.A,"0","end",-44,5],[p.S,"10","end",-34,-5],[p.B,"20","middle",0,-44],[p.T,"30","start",34,-5],[p.V,"40","start",44,5],[p.P,"50","start",34,18],[p.G,"60","middle",0,48],[p.Rp,"70","end",-34,18]];
    for(var i=0;i<ages.length;i++){var a=ages[i];s+='<text x="'+(a[0].x+a[3])+'" y="'+(a[0].y+a[4])+'" text-anchor="'+a[2]+'" font-size="12" '+st+'>'+a[1]+'</text>';}
    var ma=[157.5,112.5,67.5,22.5,337.5,292.5,247.5,202.5],ml=["5","15","25","35","45","55","65","75"];
    for(var k=0;k<8;k++){var an=ma[k]*Math.PI/180,mr=R+30;s+='<text x="'+(CX+mr*Math.cos(an))+'" y="'+(CY-mr*Math.sin(an))+'" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="300" opacity="0.35" '+st+'>'+ml[k]+'</text>';}
    return s;
  }

  function svgDeco() {
    return '<text x="'+(CX+130)+'" y="'+(CY+55)+'" text-anchor="middle" fill="'+CLR.gold+'" font-family="serif" font-size="18" opacity="0.25">$</text>' +
      '<text x="'+(CX+15)+'" y="'+(CY+195)+'" text-anchor="middle" fill="'+CLR.gold+'" font-size="16" opacity="0.25">♡</text>';
  }

  function renderMatrix(data) {
    var svg=document.getElementById("matrixSvg"),p=getPositions();
    svg.innerHTML=svgDefs()+svgBg()+svgLines(p)+svgPoints(data,p)+svgLabels(p)+svgDeco();
  }

  function updatePurpose(d) {
    document.getElementById("skyVal").textContent=d.sky;
    document.getElementById("earthVal").textContent=d.earth;
    document.getElementById("z1Val").textContent=d.Z1;
    document.getElementById("mPurpVal").textContent=d.mP;
    document.getElementById("zhPurpVal").textContent=d.zhP;
    document.getElementById("z2Val").textContent=d.Z2;
    document.getElementById("z3Val").textContent=d.Z3;
  }

  function validate(day,month,year) {
    if(!day||!month||!year) return "Please enter your full date of birth.";
    if(day<1||day>31) return "Day must be between 1 and 31.";
    if(month<1||month>12) return "Month must be between 1 and 12.";
    if(year<1900||year>2030) return "Please enter a valid year.";
    var d=new Date(year,month-1,day);
    if(d.getFullYear()!==year||d.getMonth()!==month-1||d.getDate()!==day) return "That date does not exist.";
    return null;
  }

  var gender="female";
  document.addEventListener("DOMContentLoaded",function(){
    var fB=document.getElementById("femaleBtn"),mB=document.getElementById("maleBtn");
    var cB=document.getElementById("calculateBtn"),rB=document.getElementById("recalculateBtn");
    var eE=document.getElementById("errorMsg"),fS=document.getElementById("formSection"),rS=document.getElementById("resultSection");
    fB.onclick=function(){gender="female";fB.classList.add("active");mB.classList.remove("active");};
    mB.onclick=function(){gender="male";mB.classList.add("active");fB.classList.remove("active");};
    cB.onclick=function(){
      var day=parseInt(document.getElementById("dayInput").value);
      var month=parseInt(document.getElementById("monthInput").value);
      var year=parseInt(document.getElementById("yearInput").value);
      var name=document.getElementById("nameInput").value.trim();
      var err=validate(day,month,year);
      if(err){eE.textContent=err;eE.style.display="block";return;}
      eE.style.display="none";
      var data=calculateMatrix(day,month,year);
      renderMatrix(data);updatePurpose(data);
      document.getElementById("resultName").textContent=name||"Your Matrix";
      document.getElementById("resultDob").textContent=day+"."+(month<10?"0"+month:month)+"."+year+" • "+(gender==="female"?"Female":"Male");
      fS.style.display="none";rS.style.display="block";rS.classList.add("fade-in");
      window.scrollTo({top:0,behavior:"smooth"});
    };
    rB.onclick=function(){rS.style.display="none";rS.classList.remove("fade-in");fS.style.display="block";window.scrollTo({top:0,behavior:"smooth"});};
  });
})();
