// ===== Pantalla de inicio: Bosque Verde animado + menú (v591) =====
const HERO={on:false,mx:0,my:0,sx:0,sy:0,last:0,cv:null,g:null,L:null,t0:performance.now(),shinyIdx:-1};
function heroRng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function heroBuild(){
 const W=520,H=270,mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g]};
 const R=heroRng(11),L={};
 const circ=(g,cx,cy,r,col)=>{g.fillStyle=col;for(let dy=-r;dy<=r;dy++){const w=Math.floor(Math.sqrt(r*r-dy*dy+.5));g.fillRect(cx-w,cy+dy,w*2+1,1)}};
 const pine=(g,x,base,h,mw,col)=>{g.fillStyle=col;const top=base-h;for(let y=top;y<=base;y++){const t=(y-top)/h,fr=(t*6)%1,hw=Math.max(1,Math.round(mw*t*(.5+.5*fr)));g.fillRect(x-hw,y,hw*2+1,1)}g.fillRect(x-1,base,3,8)};
 // cielo verde menta entre las copas
 {const [c,g]=mk(W,H);const gr=g.createLinearGradient(0,0,0,170);gr.addColorStop(0,'#c4e8dc');gr.addColorStop(.55,'#8fd0b4');gr.addColorStop(1,'#6cbc9c');g.fillStyle=gr;g.fillRect(0,0,W,H);
  for(let i=0;i<9;i++){g.fillStyle='#ffffff55';g.fillRect(190+Math.floor(R()*140),6+Math.floor(R()*40),14+Math.floor(R()*30),3)}L.sky=c}
 // capas de pinos en tonos verde azulado, cada una más oscura y cercana, con bruma en la base
 const layer=(base,hmin,hmax,mw,step,col,fog,seed)=>{const [c,g]=mk(W,H);const r=heroRng(seed);for(let x=-10;x<W+20;x+=step){pine(g,x+Math.floor(r()*step*.8),base,hmin+Math.floor(r()*(hmax-hmin)),mw,col)}
  g.fillStyle=col;g.fillRect(0,base,W,H-base);
  g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,base-70,0,base+6);gr.addColorStop(0,'rgba(190,236,214,0)');gr.addColorStop(1,'rgba(190,236,214,'+fog+')');g.fillStyle=gr;g.fillRect(0,0,W,H);return c};
 L.far=layer(172,70,112,13,13,'#7cc6a6',.5,3);L.mid=layer(190,90,142,17,17,'#55a487',.45,9);L.mid2=layer(206,110,176,21,23,'#37806f',.4,15);
 // suelo del bosque y sendero
 {const [c,g]=mk(W,H);const gr=g.createLinearGradient(0,176,0,H);gr.addColorStop(0,'#6fb898');gr.addColorStop(.25,'#2f6a5c');gr.addColorStop(1,'#183834');g.fillStyle=gr;g.fillRect(0,176,W,H-176);
  for(let i=0;i<260;i++){const x=Math.floor(R()*W),y=186+Math.floor(R()*84);g.fillStyle=R()<.5?'#3a7a68':'#143230';g.fillRect(x,y,3+Math.floor(R()*5),1)}
  for(let y=178;y<H;y++){const t=(y-178)/92,cx=Math.round(262+Math.sin(t*3.2)*20*(1-t*.35)-t*8),hw=Math.round(5+t*t*40+t*72);
   g.fillStyle='#a98c5c';g.fillRect(cx-hw-3,y,hw*2+7,1);g.fillStyle='#cdb27c';g.fillRect(cx-hw,y,hw*2+1,1);
   for(let k=0;k<4;k++){const px=cx-hw+Math.floor(R()*hw*2),pw=3+Math.floor(R()*(6+t*22));g.fillStyle=R()<.55?'#e6d09c':'#bc9f6c';g.fillRect(px,y,pw,1)}}
  L.floor=c}
 // pinos cercanos, laterales
 {const [c,g]=mk(W,H);const r=heroRng(5);for(const x of [20,52,112,150,372,420,468,500]){pine(g,x,238,150+Math.floor(r()*60),26,'#245a54')}
  g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,150,0,240);gr.addColorStop(0,'rgba(10,30,30,0)');gr.addColorStop(1,'rgba(10,30,30,.45)');g.fillStyle=gr;g.fillRect(0,0,W,H);L.near=c}
 // copas oscuras con un claro por donde entra la luz
 {const [c,g]=mk(W,H);const blobs=(yy,rmin,rmax,col,dx,dy)=>{const r=heroRng(41);for(let x=-14;x<W+14;x+=9){const gap=x>205&&x<335;const rad=gap?6+Math.floor(r()*4):rmin+Math.floor(r()*(rmax-rmin));circ(g,x+dx,yy+(gap?-8:0)+Math.floor(r()*14)+dy,rad,col)}};
  blobs(36,14,28,'#53727a',-3,-4);blobs(36,14,28,'#6e6a98',-5,-6);g.fillStyle='#16302e';g.fillRect(0,0,W,30);blobs(34,14,26,'#16302e',0,0);
  g.globalCompositeOperation='destination-out';circ(g,270,4,42,'#000');for(let i=0;i<14;i++){circ(g,222+i*8,Math.floor(R()*14),6+Math.floor(R()*6),'#000')}
  g.globalCompositeOperation='source-over';
  // masas oscuras laterales
  for(const [x0,dir] of [[0,1],[W,-1]]){const r=heroRng(x0+7);for(let y=0;y<H;y++){const w=Math.round(26+Math.sin(y/17)*8+r()*6+(y<90?(90-y)*.5:0));g.fillStyle='#16302e';g.fillRect(dir>0?0:W-w,y,w,1)}}
  {const d=g.getImageData(0,0,W,H).data;L.edge=[];for(let x=0;x<W;x++){let y=0;if(d[(0*W+x)*4+3]<128){L.edge.push(-1);continue}while(y<H-1&&d[((y+1)*W+x)*4+3]>=128)y++;L.edge.push(y)}}
  L.canopy=c}
 // troncos gigantes con luz de borde amarilla y violeta
 {const [c,g]=mk(W,H);const trunk=(x,w,y0,y1,col,lit,side)=>{g.fillStyle=col;g.fillRect(x,y0,w,y1-y0);
   const run=(c,off,wd,l0,l1,g0,g1,yy0,yy1)=>{let y=yy0+Math.floor(R()*20);while(y<yy1){const L2=l0+Math.floor(R()*(l1-l0)),ww=wd+Math.floor(R()*2);g.fillStyle=c;for(let k=0;k<L2&&y+k<yy1;k++){const wob=Math.round(Math.sin((y+k)/9)*1);g.fillRect(side>0?x+w-off-ww-wob:x+off+wob,y+k,ww,1)}y+=L2+g0+Math.floor(R()*(g1-g0))}};
   run(lit[1],4,2,10,34,5,18,y0+10,y1-10);run(lit[0],0,3,16,60,3,12,y0+6,y1);};
  trunk(168,13,60,206,'#2a5c54',['#cfe6b0','#a79cc4'],1);trunk(352,12,70,206,'#2a5c54',['#cfe6b0','#a79cc4'],-1);
  trunk(66,52,-4,270,'#0f2626',['#f0e080','#9a86b8'],1);trunk(402,48,-4,270,'#0f2626',['#f0e080','#9a86b8'],-1);
  // raíces
  for(const [x,dir] of [[66,-1],[118,1],[402,-1],[450,1]]){g.fillStyle='#0f2626';for(let i=0;i<14;i++){g.fillRect(x+dir*i*1.5-(dir<0?0:0),242+i,10,1)}}
  L.trunks=c}
 // primer plano: valla de madera, cobertizo-descanso, helechos
 {const [c,g]=mk(W,H);
  const post=(x,y,h)=>{g.fillStyle='#17302e';g.fillRect(x-1,y-1,9,h+2);g.fillStyle='#caa968';g.fillRect(x,y,7,h);g.fillStyle='#efd88e';g.fillRect(x,y,2,h);g.fillStyle='#7a6038';g.fillRect(x+5,y,2,h);g.fillStyle='#e8c878';g.fillRect(x,y,7,2)};
  for(const [x,y,h] of [[72,214,38],[108,222,34]])post(x,y,h);
  g.fillStyle='#17302e';g.fillRect(76,226,36,6);g.fillRect(76,240,36,5);g.fillStyle='#caa968';g.fillRect(77,227,34,3);g.fillStyle='#efd88e';g.fillRect(77,227,34,1);g.fillRect(77,241,34,2);g.fillStyle='#7a6038';g.fillRect(77,244,34,1);
  // cobertizo
  g.fillStyle='#17302e';g.fillRect(380,192,78,50);for(let i=0;i<16;i++){g.fillStyle=i<2?'#efd88e':(i%4<2?'#b89a58':'#a58a4c');g.fillRect(388-i*.6,176+i,66+i*1.2,1)}
  g.fillStyle='#caa968';g.fillRect(386,194,4,46);g.fillRect(450,194,4,46);g.fillStyle='#efd88e';g.fillRect(386,194,1,46);g.fillRect(450,194,1,46);g.fillStyle='#0f2626';g.fillRect(392,196,58,34);g.fillStyle='#6a5aa0';g.fillRect(412,206,8,2);g.fillRect(424,212,6,2);g.fillStyle='#caa968';g.fillRect(384,206,70,3);g.fillStyle='#efd88e';g.fillRect(384,206,70,1);
  // helechos
  const fern=(x,y,n,spread,len,cols)=>{for(let i=0;i<n;i++){const a=-Math.PI/2+(i/(n-1)-.5)*spread;let px=x,py=y;const cc=cols[i%cols.length];for(let s=0;s<len;s++){px+=Math.cos(a)*1.4;py+=Math.sin(a)*1.4+s*.045;g.fillStyle=cc;g.fillRect(Math.round(px),Math.round(py),2,2);if(s>3&&s%2===0){g.fillRect(Math.round(px-3),Math.round(py+1),3,1);g.fillRect(Math.round(px+2),Math.round(py+1),3,1)}}}};
  fern(46,270,9,2.6,30,['#6f5aa0','#357a6c','#4d9a80']);fern(112,272,7,2.2,22,['#357a6c','#6f5aa0']);fern(430,272,8,2.4,26,['#4d9a80','#6f5aa0','#357a6c']);fern(492,270,8,2.5,28,['#6f5aa0','#357a6c']);
  for(const [x,y,r] of [[18,262,16],[498,258,18],[90,266,12]])circ(g,x,y,r,'#102a28');
  L.fg=c}
 // luces, polvo, hojas, luciérnagas, pokémon
 L.dust=[];for(let i=0;i<46;i++)L.dust.push({u:R(),v:R(),p:R()*6.28,s:.3+R()});
 L.ff=[];for(let i=0;i<14;i++)L.ff.push({x:90+R()*340,y:120+R()*120,p:R()*6.28,s:.4+R()*.8});
 L.lv=[];for(let i=0;i<14;i++)L.lv.push({x:R()*W,y:R()*H,v:.1+R()*.18,p:R()*6.28,c:['#7ac870','#c8d870','#3c9a80','#f0e080'][i%4]});
 L.mons=[].map(([id,x,y,f,k,sc],i)=>({id,x,y,f,k,sc,off:i*437}));
 L.fly=[];L.ev=[];L.next=1500;
 HERO.shinyIdx=Math.random()<.15?0:-1;
 return L}
function heroSprite(id,an,ms,x,y,flip,alpha,sc,row,rot){sc=sc||1;
 const R=pmdGet(id,an);if(!R||!R.ready)return false;const g=HERO.g;g.save();g.globalAlpha=alpha==null?1:alpha;g.translate(Math.round(x),Math.round(y));if(rot)g.rotate(rot);g.scale((flip?-1:1)*sc,sc);pmdDraw(g,R,pmdFrame(R,ms,true),1,0,row||0);g.restore();return true}
function heroDraw(now){
 if(!HERO.on)return;const ov=$('titleOverlay');
 if(ov.hidden||document.hidden){HERO.on=false;return}
 requestAnimationFrame(heroDraw);
 if(now-HERO.last<33)return;HERO.last=now;
 const L=HERO.L,G3=HERO.g3,t=now-HERO.t0,W=520,H=270;let g=HERO.g0||HERO.g;const use=n=>{if(G3){g=G3.ly[n].g;HERO.g=g}};
 HERO.sx+=(HERO.mx-HERO.sx)*.05;HERO.sy+=(HERO.my-HERO.sy)*.05;
 const sway=Math.sin(t/4200)*2,ox=G3?(()=>-20):((k)=>Math.round(-20+(HERO.sx*k)+sway*k*.25)),oy=G3?(()=>0):((k)=>Math.round(HERO.sy*k*.5));
 if(G3){for(const n in G3.ly)G3.ly[n].g.clearRect(0,0,480,270)}else{g.clearRect(0,0,480,270);g.fillStyle='#16302e';g.fillRect(0,0,480,270)}
 const dr=G3?(()=>{}):((c,k)=>g.drawImage(c,ox(k),oy(k)));

 // habitantes del Bosque Verde: se asoman tras los troncos, cruzan, vuelan o cuelgan de un hilo
 if(t>L.next&&L.ev.length<7){const used=L.ev.map(e=>e.k+(e.side||'')+(e.spot||''));const pick=a=>a[Math.floor(Math.random()*a.length)];
  const roll=Math.random();let e=null;
  if(roll<.3){const spots=[['L',0],['R',0],['L',1],['R',1]].filter(([sd,m])=>!used.includes('peek'+sd+m));if(spots.length){const [sd,m]=pick(spots);e={k:'peek',side:sd,spot:m,id:pick([25,10,13,16,11,14,1,4,7,19,43,60,63]),dur:4200+Math.random()*1800}}}
  else if(roll<.62){if(Math.random()<.5)e={k:'walk',side:'L',id:pick([1,4,7,10,13,19,25,29,32,43,46,54,60,63,66,74,79,81,100,109,118]),dur:14000+Math.random()*4000,off:Math.random()*2.2-1.1};else e={k:'cross',side:Math.random()<.5?'L':'R',id:pick([1,4,7,10,13,19,25,29,32,43,46,54,60,63,66,74,79,81,100,109,118]),dur:9000+Math.random()*3000,zc:-5-Math.random()*10}}
  else if(roll<.8){e={k:'fly',side:Math.random()<.5?'L':'R',id:pick([17,15,41]),y:56+Math.random()*50,dur:6800}}
  else if(used.filter(u=>u==='drop').length<3){const xs=[];for(let x=40;x<W-60;x+=2)if(L.edge[x]>=24&&L.edge[x]<110&&!(x>330&&x<460))xs.push(x);if(xs.length){const x=pick(xs);e={k:'drop',x,id:14,edge:L.edge[x],len:Math.max(26,Math.min(84,106-L.edge[x])),dur:8200}}}
  if(e){e.t0=t;e.sh=Math.random()<.03;L.ev.push(e)}
  L.next=t+1100+Math.random()*1900}
 L.ev=L.ev.filter(e=>t-e.t0<e.dur);
 if(L.mewNext==null)L.mewNext=t+8000;
 if(!L.mew&&t>L.mewNext){L.mew={t0:t,dur:6800}}
 if(L.mew&&t-L.mew.t0>L.mew.dur){L.mew=null;L.mewNext=t+22000+Math.random()*18000}
 if(!L.sp)L.sp=[];
 // aves legendarias: cruzan a lo lejos por la línea del cielo, detrás de las ramas
 if(L.legNext==null)L.legNext=t+6000;
 if(!L.leg&&t>L.legNext){const id=[144,145,146][Math.floor(Math.random()*3)];L.leg={t0:t,id,side:Math.random()<.5?'L':'R',dur:17000,y:19+Math.random()*3,sc:id===145?.48:.36}}
 if(L.leg&&t-L.leg.t0>L.leg.dur){L.leg=null;L.legNext=t+16000+Math.random()*22000}
 if(!L.bf)L.bf={t0:t-4500,dur:15000,side:'L',sh:HERO.shinyIdx===0,ph:0};
 if(t-L.bf.t0>L.bf.dur){L.bf={t0:t+1200+Math.random()*2500,dur:13000+Math.random()*4000,side:L.bf.side==='L'?'R':'L',sh:Math.random()<.05,ph:Math.random()*6}}

 if(G3&&G3.real){G3.update(t,L);return}
 const evAt=e=>(t-e.t0)/e.dur,ease=u=>u*u*(3-2*u),prof=u=>u<.2?ease(u/.2):u<.78?1:1-ease((u-.78)/.22);
 const evSid=e=>e.sh?e.id+1000:e.id;
 const evDraw=(kinds)=>{for(const e of L.ev){if(!kinds.includes(e.k))continue;const u=evAt(e),ms=t+e.id*311;
  if(e.k==='peek'){const p=prof(u),L2=e.side==='L';const hid=e.spot?(L2?172:358):(L2?102:418),out=e.spot?(L2?190:340):(L2?128:392),k=2.7;
   heroSprite(evSid(e),'Idle',ms,hid+(out-hid)*p+ox(k),(e.spot?214:250)+oy(k),!L2,1,e.spot?.75:1)}
  else if(e.k==='walk'){const L2=e.side==='L',x=L2?-30+u*(W+60):W+30-u*(W+60);heroSprite(evSid(e),'Walk',ms,x+ox(1.9),192+oy(1.9)+Math.round(Math.abs(Math.sin(t/180))*1),!L2,1,.8)}
  else if(e.k==='fly'){const L2=e.side==='L',x=L2?-40+u*(W+80):W+40-u*(W+80),y=e.y+Math.sin(t/800+e.id)*9+Math.sin(t/105)*1.6,vy=9/800*Math.cos(t/800+e.id),vx=(W+80)/e.dur,tilt=Math.atan2(vy,vx)*2.2*(L2?1:-1);
   const X=x+ox(1),Y=y+oy(1)+14;g.fillStyle='#ffffff';for(let i=0;i<4;i++){g.globalAlpha=.34-i*.07;g.fillRect(Math.round(X-(L2?1:-1)*(16+i*10)-(L2?8:-8)),Math.round(Y-12+i*3-Math.sin(i+t/200)),8,1)}g.globalAlpha=1;
   heroSprite(evSid(e),e.id===17?'FlapAround':'Idle',ms*(e.id===17?1.1:1.6),X,Y,!L2,1,.9,0,tilt)}
  else if(e.k==='drop'){const down=u<.2?ease(u/.2):u<.74?1:1-ease((u-.74)/.26),len=down*e.len,x=e.x+Math.sin(t/520)*2*down+ox(2.2),y0=e.edge-1,bot=u>=.2&&u<.74;g.fillStyle='rgba(236,246,236,.85)';g.fillRect(Math.round(x),Math.max(0,y0)+oy(2.2),1,Math.round(len+12));heroSprite(evSid(e),bot?'Rotate':'Idle',bot?(t-e.t0)*.55:ms,x,y0+len+24+oy(2.2),false,1,1)}
  if(e.sh&&typeof shinyStars==='function'&&e.k!=='drop'){}}};
 dr(L.sky,.1);
 use('leg');if(L.leg){const b=L.leg,u=(t-b.t0)/b.dur,L2=b.side==='L',x=L2?-40+u*(W+80):W+40-u*(W+80);g.globalAlpha=.88;heroSprite(b.id,'Walk',t,x+ox(.3),b.y+oy(.3)+Math.sin(t/700)*1.2+14,!L2,1,b.sc);g.globalAlpha=1}
 dr(L.far,.4);dr(L.mid,.7);dr(L.mid2,1);
 // haces de luz con borde punteado
 if(!G3){const bx=ox(1.1),by=oy(1.1);[[196,17,78,0],[238,9,72,1],[296,14,66,2]].forEach(([x0,w,d,i])=>{const a=.7+.3*Math.sin(t/1700+i*2);const gr=g.createLinearGradient(0,0,0,215);gr.addColorStop(0,'rgba(246,232,140,'+(.85*a)+')');gr.addColorStop(1,'rgba(246,232,140,0)');g.fillStyle=gr;g.beginPath();g.moveTo(x0+bx,by);g.lineTo(x0+w+bx,by);g.lineTo(x0+w+d+bx,215+by);g.lineTo(x0+d+bx,215+by);g.closePath();g.fill();
   g.fillStyle='rgba(246,232,140,'+(.55*a)+')';for(let j=0;j<70;j++){const y=14+j*3,xx=x0+d*(y/215)+w+((j*37)%9)-3;g.fillRect(Math.round(xx+bx),y+by,1,1);if(j%2)g.fillRect(Math.round(xx+bx)+2,y+by+1,1,1)}})}
 dr(L.floor,1.5);
 use('walk');{const o=ox(1.5),a=.2+.1*Math.sin(t/1500);g.fillStyle='rgba(246,232,140,'+a+')';for(let j=0;j<9;j++){const hw=Math.round(44*Math.sqrt(1-Math.pow((j-4)/4.5,2)));g.fillRect(262+o-hw+10,222+j*2+oy(1.5),hw*2,1)}}
 evDraw(['walk']);dr(L.near,1.9);
 // pokémon del sendero
 const drawMon=(m,i)=>{let x=m.x+ox(m.k==='float'?1.6:2.4),y=m.y+oy(2),flip=m.f<0;const ms=t+m.off,sid=(HERO.shinyIdx===i)?m.id+1000:m.id;
  if(m.k==='float')y+=Math.round(Math.sin(t/650)*4);
  heroSprite(sid,'Idle',ms,x,y,flip,1,m.sc);
  if(HERO.shinyIdx===i&&typeof shinyStars==='function'){g.save();shinyStars(g,x,y-14*m.sc,22*m.sc,22*m.sc,(t%3400),4);g.restore()}};
 use('fly');L.mons.forEach((m,i)=>{if(m.k==='float')drawMon(m,i)});
 evDraw(['fly']);
 {const b=L.bf,u=(t-b.t0)/b.dur;if(u>=0&&u<=1){const L2=b.side==='L',x=L2?-50+u*(W+100):W+50-u*(W+100),y=122+Math.sin(u*9.4+b.ph)*24+Math.sin(t/650)*4;
  heroSprite(b.sh?1012:12,'Idle',t,x+ox(1.6),y+oy(1.6)+22,!L2,1,1.1);
  if(b.sh&&typeof shinyStars==='function'){g.save();shinyStars(g,x+ox(1.6),y+oy(1.6)+4,22,22,(t%3400),4);g.restore()}}}
dr(L.canopy,2.2);use('peek');evDraw(['peek']);dr(L.trunks,2.7);use('drop');evDraw(['drop']);dr(L.fg,3.4);use('front');
 // polvo dorado dentro de los haces
 // Mew: aparece en una esquina, flota y se va volando
 if(L.mew){const m=L.mew,u=(t-m.t0)/m.dur;
  // recorrido dibujado por el usuario: llega desde abajo a la derecha, se detiene al centro, mira de frente y se va por arriba
  const A=[[480,250,2.2],[357,196,1.8],[307,146,1.55],[272,118,1.35]],B=[[272,118,1.35],[258,100,1.25],[226,50,1.0],[192,-14,.8]];
  const along=(pts,k)=>{const n=pts.length-1,f=k*n,i=Math.min(n-1,Math.floor(f)),q=f-i,a=pts[i],b=pts[i+1];return [a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,a[2]+(b[2]-a[2])*q]};
  let P,mode='Walk',row=0;
  if(u<.36){P=along(A,1-Math.pow(1-u/.36,2))}
  else if(u<.66){P=B[0];mode='Idle';row='0'}
  else{const k=(u-.66)/.34;P=along(B,k*k)}
  const bob=mode==='Idle'?Math.sin(t/380)*2.5:Math.abs(Math.sin(t/170))*1.5,px=P[0]+ox(2),py=P[1]+oy(2)-bob;
  const par=mode==='Idle'?2:1;
  for(let i=0;i<par;i++)L.sp.push({x:px+(Math.random()-.5)*22*P[2]/1.5,y:py-8-Math.random()*30*P[2]/1.5,l:1,v:(Math.random()-.4)*.4,c:Math.random()<.5?'#ffd2f2':'#ffffff'});
  heroSprite(151,mode,t,px,py,mode==='Walk',1,P[2],row)}
 for(let i=L.sp.length-1;i>=0;i--){const p=L.sp[i];p.l-=.045;p.y+=p.v;if(p.l<=0){L.sp.splice(i,1);continue}g.globalAlpha=p.l;g.fillStyle=p.c;const z=p.l>.5?2:1;g.fillRect(Math.round(p.x),Math.round(p.y),z,z)}g.globalAlpha=1;
 use('dust');for(const d of L.dust){const k=(d.u+t/(9000+d.s*5000))%1,y=14+k*205,x=196+d.v*120+78*(y/215)*1.0+Math.sin(t/900*d.s+d.p)*5+ox(1.1);const a=.3+.7*Math.max(0,Math.sin(t/600*d.s+d.p));g.globalAlpha=a*.85;g.fillStyle='#fff6b0';g.fillRect(Math.round(x),Math.round(y),1+(d.s>.9?1:0),1+(d.s>.9?1:0))}g.globalAlpha=1;
 use('front');for(const f of L.lv){f.y+=f.v*2;f.x+=Math.sin(t/500+f.p)*.35+.2;if(f.y>H+4){f.y=-4;f.x=Math.random()*W}if(f.x>W+4)f.x=-4;g.fillStyle=f.c;g.fillRect(Math.round(f.x+ox(2.8)),Math.round(f.y),2,2);g.fillRect(Math.round(f.x+ox(2.8))+1,Math.round(f.y)+1,2,1)}
 for(const f of L.ff){const a=.35+.65*Math.max(0,Math.sin(t/500*f.s+f.p));const x=Math.round(f.x+Math.sin(t/1700*f.s+f.p)*14+ox(2)),y=Math.round(f.y+Math.cos(t/1300*f.s+f.p)*8);g.globalAlpha=a*.35;g.fillStyle='#e8ff9a';g.fillRect(x-2,y-2,5,5);g.globalAlpha=a;g.fillStyle='#faffd0';g.fillRect(x,y,2,2)}g.globalAlpha=1;
 if(G3)G3.render(t);
}
// ===== Portada 3D real: bosque modelado en 3D (pinos, troncos, copas, sendero, luz) con Pokémon como carteles (v606) =====
function hero3D(){
 try{
  if(/[?&]portada=2d/.test(location.search))return null;
  const T=window.THREE,host=$('titleHero'),L=HERO.L;if(!T||!host||!L||typeof pxaGround!=='function'||typeof r3Tree3D!=='function')return null;
  const cv=document.createElement('canvas');cv.id='titleGL';cv.setAttribute('aria-hidden','true');host.insertBefore(cv,host.firstChild);
  let r;try{r=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:false,powerPreference:'high-performance'})}catch(e){cv.remove();return null}
  r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.02;
  const scene=new T.Scene(),cam=new T.PerspectiveCamera(14,1.57,20,300);
  const R=heroRng(77),rr=(a,b)=>a+R()*(b-a);
  const W=12,H=9;
  const ry=tx=>Math.round(4+1.2*Math.sin(tx*.6));
  const pathZ=x=>1.2*Math.sin((x+W/2-.5)*.6)+.5;
  const rows=(tx,ty)=>{if(ty===ry(tx)||ty===ry(tx)+1)return 'p';for(const [cx,cy,rx,ry2] of [[2.5,7,2.3,1.3],[9.5,1.8,2,1.2]])if(((tx-cx)/rx)**2+((ty-cy)/ry2)**2<1)return 'T';return '.'};
  // ---- cielos de cada bioma (se mezclan en un solo lienzo)
  const mkSky=kind=>{const c=document.createElement('canvas');c.width=320;c.height=240;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,240);
   const cl=(x,y,w,col)=>{g.fillStyle=col;g.beginPath();g.ellipse(x,y,w,w*.42,0,0,7);g.ellipse(x+w*.5,y-w*.2,w*.6,w*.34,0,0,7);g.ellipse(x-w*.5,y+3,w*.5,w*.3,0,0,7);g.fill()};
   if(kind==='day'){gr.addColorStop(0,'#43a5e6');gr.addColorStop(1,'#bfe8fb');g.fillStyle=gr;g.fillRect(0,0,320,240);for(const [x,y,w] of [[50,150,38],[250,70,34],[170,195,44],[95,50,26]])cl(x,y,w,'#f4fbff')}
   else if(kind==='cave'){gr.addColorStop(0,'#120d26');gr.addColorStop(1,'#3a2c66');g.fillStyle=gr;g.fillRect(0,0,320,240);for(let i=0;i<60;i++){g.fillStyle=i%4?'#8f7ad8':'#bff4ff';g.fillRect((R()*320)|0,(R()*220)|0,1,1)}cl(60,170,40,'#2a2250');cl(260,90,34,'#2a2250')}
   else{gr.addColorStop(0,'#0a1c2c');gr.addColorStop(1,'#1f5058');g.fillStyle=gr;g.fillRect(0,0,320,240);for(const [x,y,w] of [[40,150,38],[250,70,34],[170,190,44],[90,50,26]])cl(x,y,w,'#2a5868');for(let i=0;i<46;i++){g.fillStyle=i%5?'#9fd0d8':'#fff6c0';g.fillRect((R()*320)|0,(R()*200)|0,1,1)}}
   return c};
  const skyCv=document.createElement('canvas');skyCv.width=320;skyCv.height=240;const skyG=skyCv.getContext('2d');
  const skyTex=new T.CanvasTexture(skyCv);skyTex.colorSpace=T.SRGBColorSpace;skyTex.magFilter=T.NearestFilter;skyTex.minFilter=T.NearestFilter;skyTex.generateMipmaps=false;scene.background=skyTex;
  const hemi=new T.HemisphereLight(0xa8d8e0,0x2a3a2a,.8);scene.add(hemi);
  const sun=new T.DirectionalLight(0xffe6a0,1.5);sun.position.set(-6,14,9);scene.add(sun);
  // ---- biomas
  const BIO=[
   {id:'forest',name:'BOSQUE VERDE · NOCHE',pool:{peek:[10,13,10,13,11,14,25],walk:[10,13,11,14,25,10,13],fly:[15,12],bf:12,drop:true},sky:null,hemi:[0xa8d8e0,0x2a3a2a,.8],sun:[0xffe6a0,1.5],beam:1,fly:0xe8ff9a,theme:()=>stageTheme('forest'),tint:0xa8c8c0,cone:0x5e4129,pond:0x9ab8c8,tp:ch=>ch==='p'?'path':ch==='T'?'tall':'grass'},
   {id:'day',name:'RUTA 1 · DÍA',pool:{peek:[16,19,16,19,10,13],walk:[16,19,19,16,10,13,21],fly:[17],bf:12,drop:false},sky:null,hemi:[0xe6f6ff,0x6f8f5a,1.0],sun:[0xfff0d0,2.2],beam:.22,fly:0xfff6c0,theme:()=>stageTheme('route3'),tint:0xffffff,cone:0x6a4a2a,pond:0xffffff,tp:ch=>ch==='p'?'path':ch==='T'?'tall':'grass'},
   {id:'cave',name:'MONTE MOON · CUEVA',pool:{peek:[41,74,46,35],walk:[74,46,35,74,46],fly:[41,42],bf:41,drop:false},sky:null,hemi:[0xc7d2ff,0x4a3a60,.9],sun:[0xcfd9ff,1.1],beam:0,fly:0x8fe8ff,theme:()=>stageTheme('mtmoon'),tint:0xc8c0e0,cone:0x4a4252,pond:0x7fa0d0,tp:ch=>ch==='p'?'path':'stone'}];
  BIO.forEach((b,i)=>{b.sky=mkSky(i===0?'night':i===1?'day':'cave')});
  const bioBuild=B=>{
   const root=new T.Group();B.root=root;scene.add(root);const trees=[];B.peekL=[];B.peekR=[];B.hang=[];
   const sv=R3;R3={T,mats:new Map()};
   try{
    const th=B.theme(),gt=pxaGround(th,rows,W,H,B.tp),tx=new T.CanvasTexture(gt);tx.colorSpace=T.SRGBColorSpace;tx.magFilter=T.NearestFilter;tx.minFilter=T.NearestFilter;tx.generateMipmaps=false;
    const gp=new T.Mesh(new T.PlaneGeometry(W,H),new T.MeshBasicMaterial({map:tx,toneMapped:false,color:B.tint}));gp.rotation.x=-Math.PI/2;root.add(gp);
    {const tc=document.createElement('canvas');tc.width=tc.height=32;const q=tc.getContext('2d'),ec=B.id==='cave'?'#5a4a6a':'#7a5638';q.fillStyle=ec;q.fillRect(0,0,32,32);q.fillStyle=shade(ec,.82);for(let k=0;k<4;k++){q.fillRect(0,k*8+7,32,1);for(let c=0;c<2;c++)q.fillRect(((k%2)*8+c*16)%32,k*8,1,7)}q.fillStyle=shade(ec,1.2);for(let k=0;k<4;k++)q.fillRect(1+(k%2)*8,k*8+1,5,1);
     const bt=new T.CanvasTexture(tc);bt.colorSpace=T.SRGBColorSpace;bt.wrapS=bt.wrapT=T.RepeatWrapping;bt.repeat.set((W+.7)/1.5,1.1);bt.magFilter=T.NearestFilter;bt.minFilter=T.NearestFilter;
     const bm=new T.Mesh(new T.BoxGeometry(W+.7,1.6,H+.7),new T.MeshStandardMaterial({map:bt,roughness:1}));bm.position.set(0,-.81,0);root.add(bm);
     const rock=new T.MeshStandardMaterial({color:B.cone,roughness:1,flatShading:true});
     const cone=new T.Mesh(new T.ConeGeometry(1,5.5,4,1),rock);cone.rotation.x=Math.PI;cone.rotation.y=Math.PI/4;cone.scale.set((W+.7)/Math.SQRT2,1,(H+.7)/Math.SQRT2);cone.position.set(0,-4.35,0);root.add(cone);
     for(const [rx,ry3,rz,s] of [[-3,-6.5,2,.6],[4,-7.2,-1,.8],[1,-8.2,3.5,.45],[-5.5,-4.5,-1,.5]]){const m=new T.Mesh(new T.IcosahedronGeometry(s,0),rock);m.position.set(rx,ry3,rz);root.add(m)}
     for(const [bw,bd,bx,bz] of [[W+.74,.37,0,-H/2-.185],[W+.74,.37,0,H/2+.185],[.37,H,-W/2-.185,0],[.37,H,W/2+.185,0]]){const b=new T.Mesh(new T.BoxGeometry(bw,.12,bd),new T.MeshStandardMaterial({color:th.lip,roughness:1}));b.position.set(bx,-.06,bz);root.add(b)}}
    {const tw=new T.CanvasTexture(pxaWaterTex(1));tw.colorSpace=T.SRGBColorSpace;tw.wrapS=tw.wrapT=T.RepeatWrapping;tw.repeat.set(1.5,1);tw.magFilter=T.NearestFilter;tw.minFilter=T.NearestFilter;
     const wm=new T.Mesh(new T.PlaneGeometry(3,2),new T.MeshBasicMaterial({map:tw,toneMapped:false,color:B.pond}));wm.rotation.x=-Math.PI/2;wm.position.set(3.4,.03,2.9);root.add(wm)}
    const bb2=(cv,wu,hu,x,z)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;const sp=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,alphaTest:.3,toneMapped:false}));sp.center.set(.5,0);sp.scale.set(wu,hu,1);sp.position.set(x,0,z);root.add(sp);return sp};
    const blob2=(x,z,r)=>{const m=new T.Mesh(new T.CircleGeometry(r,14),new T.MeshBasicMaterial({color:0x0b1a10,transparent:true,opacity:.28,depthWrite:false}));m.rotation.x=-Math.PI/2;m.scale.set(1,.7,1);m.position.set(x,.012,z);root.add(m)};
    const Mt=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.9,flatShading:true},o||{}));
    const boxm=(w,h,d,c,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),Mt(c));m.position.set(x,y,z);root.add(m);return m};
    const free=(x,z,d)=>!trees.some(t=>Math.hypot(t.x-x,t.z-z)<d),near=(x,z)=>Math.abs(z-pathZ(x))<1.3||Math.hypot(x-3.4,z-2.9)<2;
    const place=(x,z,sc,cone,a)=>{const G=r3Tree3D(T,root,cone,x,z,sc,R()*6);trees.push({x,z,sc,cone,G});
     if(!cone&&a&&G.children.length>=7){const tr=G.children[2];tr.scale.y=1+1.1*a;tr.position.y=.17*tr.scale.y;for(let k=3;k<7;k++)G.children[k].position.y+=.42*a}return G};
    const rockAt=(x,z,sc,col)=>{const m=new T.Mesh(new T.IcosahedronGeometry(.5,0),new T.MeshStandardMaterial({color:col||0x6a6478,roughness:1,flatShading:true}));m.scale.set(sc*1.1,sc*.8,sc);m.position.set(x,sc*.3,z);m.rotation.y=R()*6;root.add(m);trees.push({x,z,sc,cone:false});return m};
    if(B.id==='cave'){
     B.peekL=[[-4.6,-2.4,1.8],[-5.1,3,1.6]];B.peekR=[[4.7,-2.6,1.8],[4.9,.4,1.7]];B.hang=[[-1.9,-2.9,2.1],[1.8,-3.1,2.1]];
     const boulder=(x,z,k,seed)=>{const G=new T.Group(),lumps=[[-.2,.24,.12,.31,'#a8756a'],[.19,.22,.07,.29,'#8f5f58'],[-.02,.32,-.14,.27,'#bd8a7c']];
      lumps.forEach(([ox,oy,oz,rq,col],q)=>{const geo=new T.IcosahedronGeometry(rq*.78,1),pp=geo.attributes.position;for(let k2=0;k2<pp.count;k2++){const f=1+(Math.sin(pp.getX(k2)*41+pp.getY(k2)*17+pp.getZ(k2)*29+seed*3+q)*.5)*.16;pp.setXYZ(k2,pp.getX(k2)*f,pp.getY(k2)*f*.82,pp.getZ(k2)*f)}geo.computeVertexNormals();
       const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:col,roughness:.95,flatShading:true,emissive:col,emissiveIntensity:.16}));m.rotation.y=(Math.sin(seed*12.9+q)*.5+.5)*6;m.position.set(ox*1.25,oy*.62,oz*1.25);G.add(m)});
      G.scale.setScalar(k);G.position.set(x,0,z);root.add(G);blob2(x,z+.04,.4*k);trees.push({x,z,sc:k});return G};
     [...B.peekL,...B.peekR].forEach((a,i)=>boulder(a[0],a[1],a[2]*1.9,i+1));
     for(const [x,z] of [[-5.2,-3.7],[-3.4,-3.8],[-.1,-3.9],[3.8,-3.8],[5.3,-3.6],[-5.3,.2],[5.4,2.2],[-5.4,3.6],[-2.2,3.9]])if(free(x,z,1.1)){if(R()<.5)boulder(x,z,rr(1,1.4),x*3+z);else{bb2(pxaStalag(th.wall,(x*5+z)|0),.9,1.5,x,z+.05);blob2(x,z+.05,.3);trees.push({x,z,sc:.6})}}
     for(let i=0;i<9;i++){const x=rr(-5.4,5.4),z=rr(-3.8,4.2);if(near(x,z)||!free(x,z,1))continue;const nr=R()<.5?2:1;for(let q=0;q<nr;q++){const ox=(q?.22:-.05),oz=(q?-.15:.05);bb2(pxaRock('#7a7268',(x*3+z+q)|0),1.1-q*.3,.8-q*.2,x+ox,z+oz);blob2(x+ox,z+oz,.34)}trees.push({x,z,sc:.6})}
    }else{
     B.peekL=[[-4.6,-2.4,1.8,false],[-5.1,3,1.6,true]];B.peekR=[[4.7,-2.6,1.8,false],[4.9,.4,1.7,true]];B.hang=[[-1.9,-2.9,2.1,false],[1.8,-3.1,2.1,false]];
     B.peekL.forEach(a=>place(a[0],a[1],a[2],a[3],.5));B.peekR.forEach(a=>place(a[0],a[1],a[2],a[3],.5));B.hang.forEach(a=>place(a[0],a[1],a[2],a[3],1));
     const list=B.id==='forest'?[[-5.2,-3.7,1.5,false],[-3.4,-3.8,1.6,true],[-.1,-3.9,1.5,true],[3.8,-3.8,1.6,false],[5.3,-3.6,1.5,true],[-5.3,.2,1.5,true],[5.4,2.2,1.6,false],[-5.4,3.6,1.4,false],[-2.2,3.9,1.3,true],[1,4,1.2,false]]
      :[[-5.2,-3.7,1.4,false],[-.1,-3.9,1.3,false],[3.8,-3.8,1.5,false],[5.3,-3.6,1.3,true],[5.4,2.2,1.4,false],[-5.4,3.6,1.2,false],[1,4,1.1,false]];
     for(const [x,z,sc,c] of list)if(free(x,z,1.2))place(x,z,sc,c,.3);
     if(B.id==='day'){ // casita ('h'), valla ('f') y cartel ('s') con las piezas del mapa
      const hx=-3.9,hz=-3.1,k=1.9,HG=new T.Group(),bx=(w,h,d,c,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),Mt(c));m.position.set(x,y,z);HG.add(m)};
      bx(.82,.55,.82,'#f1e6d0',0,.28,0);const rf=new T.Mesh(new T.ConeGeometry(.75,.42,4),Mt('#d4574a'));rf.rotation.y=Math.PI/4;rf.position.set(0,.76,0);HG.add(rf);bx(.2,.3,.04,'#6b4a35',0,.15,.42);
      HG.scale.setScalar(k);HG.position.set(hx,0,hz);root.add(HG);blob2(hx,hz,.9);trees.push({x:hx,z:hz,sc:1.8,cone:false});
      for(const fx of [-5.2,-4.2,-3.2]){for(const dx of [-.4,.4])boxm(.07,.4,.07,'#e9dcc0',fx+dx,.2,2.6);boxm(.9,.06,.05,'#e9dcc0',fx,.28,2.6);boxm(.9,.06,.05,'#e9dcc0',fx,.14,2.6)}
      const sg=new T.Mesh(new T.CylinderGeometry(.04,.04,.45,5),Mt('#7a5636'));sg.position.set(-1.1,.22,1.9);root.add(sg);boxm(.5,.26,.06,'#d9b87a',-1.1,.5,1.9)}
    }
    if(B.id!=='cave'){
     for(let i=0;i<(B.id==='day'?20:14);i++){const x=rr(-5.4,5.4),z=rr(-3.8,4.2);if(near(x,z)||!free(x,z,1.3))continue;r3Bush3D(T,root,x,z,rr(.55,.85),R()*6)}
     for(let i=0;i<14;i++){const x=rr(-5.4,5.4),z=rr(-3.6,4.2);if(near(x,z)||!free(x,z,1.1))continue;r3Grass(T,root,x,z,R()*6,null)}
     const cols=['#ff7fa8','#ffffff','#9ad0ff','#ffd447'],fc=cols.map(c=>pxaFlower(c));
     for(let i=0;i<(B.id==='day'?26:14);i++){const x=rr(-5.4,5.4),z=rr(-3.9,4.2);if(near(x,z)||!free(x,z,.9))continue;for(let q=0;q<4;q++)bb2(fc[(i+q)%4],.5,.57,x+(R()-.5)*.8,z+(R()-.5)*.8)}}
    B.anchors=B.id==='cave'?B.hang.map(([x,z])=>[x,2.7,z+.2]):B.hang.map(([x,z,sc])=>[x,sc*.62,z+sc*.3]);
   }finally{R3=sv}
   root.visible=false;root.scale.setScalar(.001)};
  BIO.forEach(bioBuild);
  let cur=window.__BIOSTART||0,nxt=-1,tChg=0,tNext=null,gate=1;
  BIO[cur].root.visible=true;BIO[cur].root.scale.setScalar(1);
  // etiqueta del bioma
  const tag=document.createElement('div');tag.style.cssText='position:absolute;left:36px;top:30px;z-index:2;font:600 15px Antonio,Inter,sans-serif;letter-spacing:.22em;color:#cfe9dc;text-shadow:0 2px 8px #0008;opacity:0;transition:opacity .8s;pointer-events:none';tag.textContent=BIO[cur].name;host.appendChild(tag);
  // luces y destellos
  const sp=(()=>{const n=80,g=new T.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++)a[i*3+1]=-99;g.setAttribute('position',new T.BufferAttribute(a,3));const p=new T.Points(g,new T.PointsMaterial({size:.16,color:0xfff0a0,transparent:true,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true}));p.frustumCulled=false;scene.add(p);return p})(),spLife=new Float32Array(80);let spi=0;
  const bc2=document.createElement('canvas');bc2.width=32;bc2.height=128;
  {const g=bc2.getContext('2d'),v=g.createLinearGradient(0,0,0,128);v.addColorStop(0,'rgba(255,240,170,.95)');v.addColorStop(.6,'rgba(255,240,170,.35)');v.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=v;g.fillRect(0,0,32,128);
   g.globalCompositeOperation='destination-in';const h=g.createLinearGradient(0,0,32,0);h.addColorStop(0,'rgba(0,0,0,0)');h.addColorStop(.5,'rgba(0,0,0,1)');h.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=h;g.fillRect(0,0,32,128)}
  const btex=new T.CanvasTexture(bc2);btex.colorSpace=T.SRGBColorSpace;
  const beams=[[-3.4,-1.2,1.8,.28],[-.4,.2,2.2,.3],[2.8,-.6,1.6,.26],[.6,2.2,1.5,.3]].map(([x,z,w,rot],i)=>{const m=new T.Mesh(new T.PlaneGeometry(w,9),new T.MeshBasicMaterial({map:btex,transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,opacity:.55}));m.position.set(x,4.2,z);m.rotation.set(0,Math.PI/4,rot,'YXZ');m.userData.i=i;scene.add(m);return m});
  const pc=document.createElement('canvas');pc.width=pc.height=64;{const g=pc.getContext('2d'),q=g.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,'rgba(255,240,160,.7)');q.addColorStop(1,'rgba(255,240,160,0)');g.fillStyle=q;g.fillRect(0,0,64,64)}
  const ptex=new T.CanvasTexture(pc);ptex.colorSpace=T.SRGBColorSpace;
  const pools=beams.map(b=>{const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:ptex,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.45}));m.rotation.x=-Math.PI/2;const w=b.geometry.parameters.width;m.scale.set(w*1.6,w*1.2,1);m.position.set(b.position.x+Math.sin(b.rotation.z)*3.2*.7,.06,b.position.z-Math.sin(b.rotation.z)*3.2*.7);scene.add(m);return m});
  const pts=(n,size,col,fn)=>{const g=new T.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){const p=fn(i);a[i*3]=p[0];a[i*3+1]=p[1];a[i*3+2]=p[2]}g.setAttribute('position',new T.BufferAttribute(a,3));const p=new T.Points(g,new T.PointsMaterial({size,color:col,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));p.frustumCulled=false;scene.add(p);return p};
  const dust=pts(110,.07,0xfff2b0,()=>[rr(-6,6),rr(0,6),rr(-4.5,4.5)]),ff=pts(34,.14,0xe8ff9a,()=>[rr(-7,7),rr(.4,3.5),rr(-5,5)]);
  // carteles de Pokémon
  const K=.038,acts=new Map(),thr=new Map();
  const shG=new T.CircleGeometry(.5,14);
  const mkAct=()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const tx=new T.CanvasTexture(c);tx.magFilter=T.NearestFilter;tx.minFilter=T.NearestFilter;tx.colorSpace=T.SRGBColorSpace;
   const s=new T.Sprite(new T.SpriteMaterial({map:tx,transparent:true,alphaTest:.45}));s.center.set(.5,.078);s.scale.set(128*K,128*K,1);scene.add(s);
   const sh=new T.Mesh(shG,new T.MeshBasicMaterial({color:0x0b2a14,transparent:true,opacity:.45,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.set(.8,.5,1);scene.add(sh);return {s,c,g,tx,sh}};
  const actor=key=>{let a=acts.get(key);if(!a){a=mkAct();acts.set(key,a)}return a};
  const show=(a,id,an,ms,flip,sc,row,rot,x,y,z,k,ground,far)=>{a.g.clearRect(0,0,128,128);HERO.g=a.g;heroSprite(id,an,ms,64,118,flip,1,sc,row,rot);HERO.g=HERO.g0;a.tx.needsUpdate=true;const gg=far?1:gate;a.s.position.set(x*gg,y*gg,z*gg);a.s.visible=gg>.02;const q=(k||1)*gg;a.s.scale.set(128*K*q,128*K*q,1);a.sh.visible=!!ground&&gg>.02;a.sh.position.set(x*gg,.04,z*gg+.05);a.sh.scale.set(.8*gg,.5*gg,1)};
  const along=(P,k)=>{const n=P.length-1,f=Math.min(.9999,k)*n,i=Math.floor(f),q=f-i,a=P[i],b=P[i+1];return [a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q,a[2]+(b[2]-a[2])*q]};
  const ease=u=>u*u*(3-2*u),prof=u=>u<.2?ease(u/.2):u<.78?1:1-ease((u-.78)/.22);
  const col=new T.Color(),c2=new T.Color();
  let cw=0,ch=0,mixK=0,lastDraw=-1;
  const DWELL=24000,TRANS=2800;
  const applyMood=(a,b,k)=>{hemi.color.setHex(a.hemi[0]).lerp(c2.setHex(b.hemi[0]),k);hemi.groundColor.setHex(a.hemi[1]).lerp(c2.setHex(b.hemi[1]),k);hemi.intensity=a.hemi[2]+(b.hemi[2]-a.hemi[2])*k;
   sun.color.setHex(a.sun[0]).lerp(c2.setHex(b.sun[0]),k);sun.intensity=a.sun[1]+(b.sun[1]-a.sun[1])*k;
   const q=Math.round(k*20);if(q!==lastDraw){lastDraw=q;skyG.globalAlpha=1;skyG.drawImage(a.sky,0,0);skyG.globalAlpha=k;skyG.drawImage(b.sky,0,0);skyG.globalAlpha=1;skyTex.needsUpdate=true}
   const fc=col.setHex(a.fly).lerp(c2.setHex(b.fly),k);ff.material.color.copy(fc);dust.material.color.copy(fc);beamK=a.beam+(b.beam-a.beam)*k};
  let beamK=1;applyMood(BIO[cur],BIO[cur],0);
  const G={real:true,ly:{},
   update(t,Lx){
    const w=host.clientWidth,h=host.clientHeight;if(w&&h&&(w!==cw||h!==ch)){cw=w;ch=h;r.setPixelRatio(1);r.setSize(Math.round(w/1.7),Math.round(h/1.7),false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    // transición entre biomas: la isla se encoge girando y la siguiente crece
    if(tNext==null)tNext=t+DWELL;
    if(nxt<0&&t>tNext){nxt=(cur+1)%BIO.length;tChg=t;tag.style.opacity=0}
    let spin=0;
    if(nxt>=0){const u=Math.min(1,(t-tChg)/TRANS),A=BIO[cur],B=BIO[nxt];
     if(u<.5){const k=ease(u/.5);A.root.scale.setScalar(Math.max(.001,1-k));A.root.rotation.y=k*1.1;A.root.position.y=-k*1.2;gate=1-k;spin=k}
     else{if(!B.root.visible){A.root.visible=false;B.root.visible=true;Lx.ev=[]}const k=ease((u-.5)/.5);B.root.scale.setScalar(Math.max(.001,k));B.root.rotation.y=-(1-k)*1.1;B.root.position.y=-(1-k)*1.2;gate=k}
     applyMood(A,B,ease(u));
     if(u>=1){A.root.visible=false;A.root.scale.setScalar(.001);A.root.rotation.y=0;A.root.position.y=0;B.root.scale.setScalar(1);B.root.rotation.y=0;B.root.position.y=0;cur=nxt;nxt=-1;gate=1;tNext=t+DWELL;applyMood(B,B,0);tag.textContent=B.name;tag.style.opacity=1}}
    else if(t>1500&&tag.style.opacity==='0')tag.style.opacity=1;
    const Bc=BIO[cur];
    const sx=HERO.sx,sy=HERO.sy,yaw=Math.PI/4+.07*Math.sin(t/7000)+sx*.0015,pit=.62,D=78,ty=-2.4+sy*.01;
    cam.position.set(Math.sin(yaw)*Math.cos(pit)*D,ty+Math.sin(pit)*D,Math.cos(yaw)*Math.cos(pit)*D);cam.lookAt(0,ty,0);
    const live=new Set();
    const ra=Math.PI/4,rx=Math.cos(ra),rz=-Math.sin(ra);
    const peekL=Bc.peekL,peekR=Bc.peekR,anchors=Bc.anchors;
    const PL=Bc.pool;
    for(const e of Lx.ev){
     if(e.bid==null){if(e.k==='drop'&&!PL.drop){e.k=Bc.id==='cave'?'fly':'walk';e.side=Math.random()<.5?'L':'R';e.off=Math.random()*2.2-1.1;e.y=56+Math.random()*50}
      if(e.k==='cross')e.k='walk';const pl=e.k==='drop'?[14]:(PL[e.k]||PL.walk);e.bid=pl[(Math.random()*pl.length)|0]}
     live.add(e);const a=actor(e),u=(t-e.t0)/e.dur,ms=t+e.bid*311,sid=e.sh?e.bid+1000:e.bid;
     if(e.k==='peek'){const tl=(e.side==='L'?peekL:peekR),tr=tl[e.spot?1:0]||tl[0],dir=e.side==='L'?1:-1,p=prof(u),rad=tr[2]*.2;show(a,sid,'Idle',ms,dir<0,1,0,0,tr[0]+dir*(p*(rad+.55)),0,tr[1]-.3,1,true)}
     else if(e.k==='walk'||e.k==='cross'){const L2=e.side==='L',x=L2?-7+u*14:7-u*14;show(a,sid,'Walk',ms,!L2,1,0,0,x,0,pathZ(x)+(e.off||0)*.45-(L2?.2:-.2),1,true)}
     else if(e.k==='fly'){const L2=e.side==='L',x=L2?-9+u*18:9-u*18,z=-2+Math.sin(u*3+e.bid)*1.6,y=3.2+(e.y-56)/50*.8+Math.sin(t/800+e.bid)*.3+Math.sin(t/105)*.04,vy=.3/800*Math.cos(t/800+e.bid),vx=18/e.dur,tilt=Math.atan2(vy,vx)*2.2*(L2?1:-1);show(a,sid,e.bid===17?'FlapAround':'Idle',e.bid===17?(t-e.t0)*.9:t,!L2,1,e.bid===17?'R':0,tilt,x,y,z,1,false,true)}
     else if(e.k==='drop'){if(!e.an)e.an=anchors[Math.floor(Math.random()*anchors.length)];const down=u<.2?ease(u/.2):u<.74?1:1-ease((u-.74)/.26),len=down*(e.len/84*.55+.25),bot=u>=.2&&u<.74,[ax,ay,az]=e.an,yy=ay-len-.25;
      show(a,sid,bot?'Rotate':'Idle',bot?(t-e.t0)*.55:ms,false,1,0,0,ax+Math.sin(t/520)*.03*down,yy,az+.1,1,false);
      let th2=thr.get(e);if(!th2){const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(6),3));th2=new T.Line(g,new T.LineBasicMaterial({color:0xecf6ec}));th2.frustumCulled=false;scene.add(th2);thr.set(e,th2)}
      const pa=th2.geometry.attributes.position;pa.setXYZ(0,ax*gate,ay*gate,(az+.1)*gate);pa.setXYZ(1,(ax+Math.sin(t/520)*.03*down)*gate,(yy+.5)*gate,(az+.1)*gate);pa.needsUpdate=true;th2.visible=gate>.02}}
    for(const [e,t2] of thr)if(!live.has(e)){scene.remove(t2);t2.geometry.dispose();t2.material.dispose();thr.delete(e)}
    {const b=Lx.bf,a=actor('bf'),u=(t-b.t0)/b.dur;if(u>=0&&u<=1){live.add('bf');const L2=b.side==='L',x=L2?-9+u*18:9-u*18,y=2.6+Math.sin(u*9.4+b.ph)*.6+Math.sin(t/650)*.1;show(a,b.sh?PL.bf+1000:PL.bf,'Idle',t,!L2,1,0,0,x,y,2.4,1,false,true)}}
    if(Lx.leg){const b=Lx.leg,a=actor('leg'),u=(t-b.t0)/b.dur,L2=b.side==='L',s=L2?-34+u*68:34-u*68;live.add('leg');show(a,b.id,'Walk',t,!L2,1,0,0,-42+rx*s,12+Math.sin(t/700)*.5,-42+rz*s,b.id===145?5.4:4.4,0,true);a.s.material.opacity=.9}
    if(Lx.mew){const m=Lx.mew,a=actor('mew'),u=(t-m.t0)/m.dur,A=[[7,.1,6],[3.4,.2,3.2],[.8,.3,.9]],B=[[.8,.3,.9],[-.8,2.6,-.8],[-3,7,-3.5]];live.add('mew');
     let P,mode='Walk',row=0,flip=true;if(u<.36){P=along(A,1-Math.pow(1-u/.36,2))}else if(u<.66){P=A[2];mode='Idle';row='0';flip=false}else{const k=(u-.66)/.34;P=along(B,k*k)}
     const bob=mode==='Idle'?Math.sin(t/380)*.04:Math.abs(Math.sin(t/170))*.03,gr=P[1]<1&&u<.66;show(a,151,mode,t,flip,1,row,0,P[0],P[1]+bob,P[2],1.2,gr);
     for(let i=0;i<(mode==='Idle'?2:1);i++){const q=sp.geometry.attributes.position;spi=(spi+1)%80;q.setXYZ(spi,P[0]+(R()-.5)*.8,P[1]+.3+R()*1,P[2]+(R()-.5)*.5);spLife[spi]=1}}
    {const q=sp.geometry.attributes.position;for(let i=0;i<80;i++){if(spLife[i]>0){spLife[i]-=.045;q.setY(i,q.getY(i)-.006);if(spLife[i]<=0)q.setXYZ(i,0,-99,0)}}q.needsUpdate=true}
    for(const [k,a] of acts)if(!live.has(k)){scene.remove(a.s);scene.remove(a.sh);a.s.material.dispose();a.sh.material.dispose();a.tx.dispose();acts.delete(k)}
    for(const b of beams){b.material.opacity=(.55+.2*Math.sin(t/1800+b.userData.i*2))*beamK;b.visible=beamK>.02}pools.forEach((p,i)=>{p.material.opacity=(.4+.2*Math.sin(t/1800+i*2))*beamK;p.visible=beamK>.02});
    {const q=dust.geometry.attributes.position;for(let i=0;i<110;i++){q.setY(i,(q.getY(i)+.004+((i*7)%5)*.001)%6);q.setX(i,q.getX(i)+Math.sin(t/900+i)*.003)}q.needsUpdate=true;dust.material.opacity=.7+.3*Math.sin(t/600)}
    {const q=ff.geometry.attributes.position;for(let i=0;i<34;i++){q.setX(i,q.getX(i)+Math.sin(t/1700+i)*.006);q.setY(i,.4+((q.getY(i)-.4+Math.cos(t/1300+i)*.004+3)%3))}q.needsUpdate=true;ff.material.opacity=.45+.55*Math.max(0,Math.sin(t/500))}
    r.render(scene,cam)}};
  const old=$('titleScene');if(old)old.style.display='none';
  return G;
 }catch(e){console.warn('Portada 3D no disponible, se usa la 2D.',e);const g=$('titleGL');if(g)g.remove();return null}
}
function heroStart(){
 if(!HERO.cv){HERO.cv=$('titleScene');if(!HERO.cv)return;HERO.cv.width=480;HERO.cv.height=270;HERO.g=HERO.cv.getContext('2d');HERO.g.imageSmoothingEnabled=false;HERO.g0=HERO.g;try{HERO.L=heroBuild()}catch(e){console.error(e);return}HERO.g3=hero3D();if(HERO.g3)HERO.g=HERO.g0;
  const ov=$('titleOverlay');ov.addEventListener('pointermove',e=>{HERO.mx=(e.clientX/innerWidth-.5)*-16;HERO.my=(e.clientY/innerHeight-.5)*-8});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)heroStart()})}
 if(HERO.on)return;HERO.on=true;requestAnimationFrame(heroDraw)}
function heroRefresh(){
 const save=readSave(),ov=$('titleOverlay');
 const play=$('hPlay');if(!play)return;
 const d=save&&save.schema?save:null;let sub='Empieza tu aventura en Pueblo Paleta';
 if(d){const nm=(CAMPAIGN[d.chapter]||{}).name||'Kanto';sub=nm+' · '+((d.party||[]).length+(d.reserves||[]).length)+' Pokémon'}
 play.querySelector('b').textContent=d?'CONTINUAR':'JUGAR';play.querySelector('small').textContent=sub;
 $('hReturn').hidden=$('titleReturn').hidden;
 const P=$('heroPanel');
 if(d){const all=[...(d.party||[]),...(d.reserves||[])].slice(0,6);
  let med=0,nb=8;try{med=BADGES.filter(b=>(d.cleared||[]).includes(b[5])).length;nb=BADGES.length}catch(e){}
  P.innerHTML='<div class="hpHead">TU AVENTURA</div><div class="hpTeam">'+all.map(p=>{const src=(typeof porSrc==='function')?porSrc({id:p.id,shiny:p.shiny,hp:1,maxHp:1}):null;return '<div class="hpMon"><span class="hpPor">'+(src?'<img src="'+src+'" alt="">':'')+'</span><b>'+(p.shiny?'✨ ':'')+base[p.id].name+'</b><em>Nv. '+p.level+'</em></div>'}).join('')+'</div><div class="hpStats"><span>🏅 <b>'+med+'</b>/'+nb+'</span><span>₽ <b>'+(d.money||0)+'</b></span><span>📖 <b>'+((d.dexCaught||[]).length)+'</b></span></div>'+(d.savedAt?'<div class="hpFoot">Guardado: '+new Date(d.savedAt).toLocaleString('es-CL',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})+'</div>':'')}
 else P.innerHTML='<div class="hpHead">BIENVENIDO</div><p class="hpText">Elige tu primer Pokémon en el laboratorio del Profesor Oak, recorre Kanto, captura compañeros y vence a los líderes de gimnasio en combates tácticos por turnos.</p><div class="hpStats"><span>⚔ Táctico</span><span>🎣 Pesca</span><span>✨ Shiny</span></div>';
 heroStart()}
function heroInit(){
 const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
 on('hPlay',()=>{const s=readSave();(s&&s.schema?$('titleContinue'):$('titleNew')).click()});
 on('hNew',()=>$('titleNew').click());on('hImport',()=>$('titleImport').click());on('hReturn',()=>$('titleReturn').click());
 on('hOpt',()=>$('titleOptions').click());on('hCred',()=>$('titleCredits').click());
 const n=$('titleNotice');if(n)new MutationObserver(()=>{const h=$('hNotice');if(h)h.textContent=n.textContent}).observe(n,{childList:true,characterData:true,subtree:true})}
heroInit();

function showTitleScreen(){
 $('titleOverlay').classList.remove('behind');$('modal').hidden=true;$('titleOverlay').hidden=false;menuScreen('home');
}
function leaveTitle(){ $('titleOverlay').classList.remove('behind');$('titleOverlay').hidden=true; }
const STARTER_DETAILS=[
 {id:1,type:'PLANTA / VENENO',desc:'Resistente y paciente. Aguanta los golpes y desgasta al rival poco a poco.',theme:'#8bc39b',emoji:'🌱'},
 {id:4,type:'FUEGO',desc:'Ofensivo y ágil. Golpea fuerte y rápido, pero hay que cuidar su defensa.',theme:'#e7ac82',emoji:'🔥'},
 {id:7,type:'AGUA',desc:'Defensivo y equilibrado. Una apuesta segura que se adapta a cualquier situación.',theme:'#8cbde0',emoji:'💧'}
];
function chooseStarterScreen(){
 selectedStarter=null;const holder=$('starterCards');holder.replaceChildren();
 for(const p of STARTER_DETAILS){
   const b=document.createElement('button');b.type='button';b.className='starterCard';b.dataset.id=p.id;b.setAttribute('aria-pressed','false');
   fetchSprite(p.id);const image=spriteURL(p.id);
   b.innerHTML='<div class="starterSprite" style="background:'+p.theme+'"><span class="fallback">'+p.emoji+'</span><span class="pmdSlot" data-pmd="'+p.id+'" data-s="90"></span></div><div class="starterName">'+base[p.id].name+'</div><div class="starterType">'+p.type+'</div><div class="starterDesc">'+p.desc+'</div>';
   pmdFill(b);b.onclick=()=>{selectedStarter=p.id;playCry(p.id);holder.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('starterConfirm').disabled=false};holder.append(b)
 }
 $('starterConfirm').disabled=true;menuScreen('starter');
}
$('titleNew').onclick=()=>newGame();
$('titleContinue').onclick=()=>{const data=readSave();if(!data){$('titleNotice').textContent='No se encontró una partida guardada.';return}try{restoreSave(data);leaveTitle()}catch(err){$('titleNotice').textContent='No se pudo continuar: '+err.message}};
$('titleReturn').onclick=()=>leaveTitle();
$('titleOptions').onclick=()=>menuScreen('options');
$('titleCredits').onclick=()=>menuScreen('credits');
$('titleOptionsBack').onclick=()=>menuScreen('home');
$('titleCreditsBack').onclick=()=>menuScreen('home');
$('titleImport').onclick=()=>importGame();
$('starterBack').onclick=()=>menuScreen('home');
$('starterConfirm').onclick=()=>{if(![1,4,7].includes(selectedStarter))return;leaveTitle();reset(true,selectedStarter);playSfx('win');try{beginCampaignEncounter('pallet','main');$('campaignOverlay').hidden=true;window.__showHelpOnce&&window.__showHelpOnce();window.__tutStart&&window.__tutStart();updateUI()}catch(e){}};
$('titleSoundToggle').onclick=()=>{soundEnabled=!soundEnabled;try{localStorage.setItem('pokemon-tactics-sound',soundEnabled?'on':'off')}catch(e){}$('titleSoundToggle').textContent=soundEnabled?'ACTIVADOS':'DESACTIVADOS';if(soundEnabled)playSfx('select')};
$('titlePmdToggle').onclick=()=>{pmdOn=!pmdOn;try{localStorage.setItem('ptg_pmd',pmdOn?'1':'0')}catch(e){}$('titlePmdToggle').textContent=pmdOn?'SPRITECOLLAB (PMD)':'ORIGINALES'};
$('titleSmoothToggle').onclick=()=>{const c=window.__getPmdSmooth();window.__setPmdSmooth(c==='sharp'?'epx':c==='epx'?'off':'sharp');$('titleSmoothToggle').textContent=({off:'PIXEL PURO',sharp:'SUAVE (NÍTIDO)',epx:'SUAVE (SCALE2X)'})[window.__getPmdSmooth()]};
// Contador de FPS (opcional): muestra FPS medios, mínimo reciente y ms por cuadro; con 3D, llamadas de dibujo.
window.__fps=(()=>{let on=false,box=null,raf=0,last=0,fr=0,acc=0,worst=0,t0=0;
 const loop=t=>{if(!on)return;const host=document.fullscreenElement||document.body;if(box&&box.parentNode!==host)host.appendChild(box);raf=requestAnimationFrame(loop);if(last){const d=t-last;fr++;acc+=d;if(d>worst)worst=d}last=t;
  if(t-t0>=500){const fps=fr*1000/acc,ms=acc/fr;let extra='';try{const i=window.__R3&&window.__R3.renderer.info.render;if(i)extra=' · '+i.calls+' llam.'}catch(e){}
   box.textContent=Math.round(fps)+' FPS · '+ms.toFixed(1)+' ms · mín '+Math.round(1000/worst)+extra;box.style.color=fps>=55?'#7dff9a':fps>=40?'#ffe27a':'#ff7a7a';fr=0;acc=0;worst=0;t0=t}};
 const set=v=>{on=!!v;try{localStorage.setItem('ptg_fps',on?'1':'0')}catch(e){}
  if(on){if(!box){box=document.createElement('div');box.style.cssText='position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:2147483000;font:bold 13px monospace;background:rgba(0,0,0,.78);padding:4px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.25);pointer-events:none;color:#7dff9a';document.body.appendChild(box)}box.hidden=false;last=0;fr=0;acc=0;worst=0;t0=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  else{if(box)box.hidden=true;cancelAnimationFrame(raf)}};
 let s=false;try{s=localStorage.getItem('ptg_fps')==='1'}catch(e){}
 if(s)setTimeout(()=>set(true),500);
 return {set,get:()=>on}})();
$('titleFpsToggle').onclick=()=>{window.__fps.set(!window.__fps.get());$('titleFpsToggle').textContent=window.__fps.get()?'VISIBLE':'OCULTO'};
$('titleAnimToggle').onclick=()=>{animationEnabled=!animationEnabled;$('toggleAnimations').textContent='Animaciones: '+(animationEnabled?'ACTIVADAS':'DESACTIVADAS');$('titleAnimToggle').textContent=animationEnabled?'ACTIVADAS':'DESACTIVADAS'};
$('backTitle').onclick=()=>{if(cinematicBusy||captureBusy||progressIsOpen||motion||phase==='enemy'){log('Espera a que termine la acción antes de volver al menú.');return}showTitleScreen()};
