const CRY_BUF={};
function playCry(id,rate=1,vol=.16){
 if(!soundEnabled||!CRIES[id])return;
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
  if(!audioCtx)audioCtx=new Ctx();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
  const A=audioCtx,go=buf=>{const src=A.createBufferSource(),g=A.createGain();src.buffer=buf;src.playbackRate.value=rate;const lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;lp.Q.value=.4;const t0=A.currentTime,dur=buf.duration/rate;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.06);g.gain.setValueAtTime(vol,t0+Math.max(.07,dur-.18));g.gain.linearRampToValueAtTime(0,t0+dur);src.connect(lp);lp.connect(g);g.connect(A.destination);src.start()};
  if(CRY_BUF[id]){go(CRY_BUF[id]);return}
  const bin=atob(CRIES[id]),u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
  A.decodeAudioData(u8.buffer.slice(0),buf=>{CRY_BUF[id]=buf;go(buf)},()=>{});
 }catch(e){}
}
function bsfx(kind,arg){
 if(kind==='cry'){playCry(arg.id,arg.rate||1);return}
 if(!soundEnabled)return;
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
  if(!audioCtx)audioCtx=new Ctx();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
  const A=audioCtx,now=A.currentTime,master=A.createGain();master.gain.value=1;master.connect(A.destination);
  const tone=(f0,f1,t,d,wave='square',vol=.05)=>chipTone(A,master,now,f0,f1,t,d,wave,vol*.9);
  const noise=(f0,f1,t,d,vol=.06,q=1,type='bandpass')=>chipNoiseHit(A,master,now,f0,f1,t,d,vol*1.1,q,type);
  if(kind==='launch'){
   const ty=arg||'normal';
   if(ty==='fire'){noise(500,2600,0,.55,.08,.8);noise(3000,700,.05,.45,.03,2)}
   else if(ty==='water'){for(let i=0;i<5;i++)tone(500+i*90,900+i*120,i*.07,.09,'sine',.045)}
   else if(ty==='electric'){for(let i=0;i<7;i++)tone(i%2?2200:700,i%2?300:1800,i*.05,.06,'sawtooth',.04)}
   else if(ty==='grass'){noise(1200,3600,0,.4,.05,2);noise(2800,1000,.1,.25,.03,3)}
   else if(ty==='ice'){tone(2200,3400,0,.25,'triangle',.035);noise(5000,7000,0,.2,.03,3,'highpass')}
   else if(ty==='poison'){tone(320,150,0,.35,'sawtooth',.04);for(let i=0;i<4;i++)tone(300+i*70,500+i*90,.05+i*.08,.07,'sine',.035)}
   else if(ty==='psychic'){tone(600,300,0,.5,'sine',.05);tone(612,306,0,.5,'sine',.05);tone(900,450,.1,.4,'triangle',.025)}
   else if(ty==='ground'||ty==='rock'){noise(160,60,0,.5,.12,.7,'lowpass')}
   else if(ty==='flying'){noise(800,2200,0,.3,.05,1.5)}
   else if(ty==='ghost'){tone(220,90,0,.6,'sine',.06);noise(700,200,.05,.5,.03,2)}
   else if(ty==='dragon'){noise(300,1200,0,.5,.08,.8);tone(180,90,0,.5,'sawtooth',.05)}
   else{noise(1000,300,0,.14,.06,1)}
  }
  else if(kind==='hit'){
   const eff=arg&&arg.eff!=null?arg.eff:1,crit=!!(arg&&arg.crit),v=eff<1?.5:1;
   if(eff>1){
    // supereficaz (medido del audio de referencia): ráfaga de ruido ancha con cola larga continua y rebotes que se apagan
    const SE=(t0,g,d)=>{noise(2000,900,t0,d,.12*g,.3);noise(1000,300,t0,d*1.1,.12*g,.4,'lowpass')};
    SE(0,1,.34);SE(.07,.9,.3);SE(.15,.8,.3);tone(160,50,0,.2,'square',.05);
    noise(1700,700,.2,1.4,.04,.3);noise(800,250,.2,1.3,.04,.4,'lowpass');
    [[.42,.5,.26],[.57,.45,.22],[.78,.3,.22],[.98,.22,.22],[1.1,.2,.2]].forEach(([d,g,l])=>SE(d,g,l));
   }else if(eff<1&&eff>0){noise(2200,700,0,.26,.04,.7,'highpass');tone(210,140,0,.06,'sine',.02)}
   else{ // normal: impacto seco y definido, más corto y más contundente que el poco eficaz
    noise(2400,450,0,.09,.2,.9);noise(1200,150,0,.12,.15,.7,'lowpass');tone(220,55,0,.1,'square',.09);tone(130,45,.01,.12,'triangle',.07)}
   if(eff===0)tone(220,160,0,.18,'sine',.035);
   if(crit){noise(1200,100,0,.35,.12,.6);tone(110,38,0,.35,'sawtooth',.07)}
  }
  else if(kind==='miss'){noise(2600,600,0,.25,.04,1.5)}
  else if(kind==='faint'){tone(440,70,0,.75,'square',.05);tone(220,50,.1,.7,'triangle',.04)}
  else if(kind==='statUp'){tone(280,430,0,1.15,'square',.05);tone(560,860,0,1.1,'triangle',.025);[[1110,.0],[1300,.2],[1600,.38],[1900,.58],[2200,.78]].forEach(([f,t])=>tone(f,f*1.12,t,.18,'square',.018))}
  else if(kind==='statDown'){tone(470,280,0,1.15,'square',.05);tone(940,560,0,1.1,'triangle',.025);[[2300,.0],[2000,.2],[1700,.38],[1400,.58],[1100,.78]].forEach(([f,t])=>tone(f,f*.88,t,.18,'square',.018))}
  else if(kind==='restored'){tone(400,540,0,.05,'square',.06);tone(340,410,.06,.055,'square',.06);tone(300,1350,.15,.27,'square',.06)}
  else if(kind==='metalclaw'){ // medido de la referencia: ráfaga de ruido + resonancias metálicas inarmónicas (~1.0, 4.9, 7.0, 8.5 kHz)
   noise(5000,2500,0,.09,.1,.4);tone(2300,2000,.01,.08,'square',.03);noise(3500,1500,.08,.3,.035,.5);
   [[980,.07],[4900,.1],[7050,.06],[6400,.05],[8550,.06]].forEach(([f,v])=>tone(f,f,.08,.32,'sine',v));
   // luego dos desgarros como papel: ruido ancho en dos oleadas (medido en el audio de referencia)
   [.25,.62].forEach(t=>{noise(5200,3300,t,.32,.12,.3);noise(1200,600,t,.32,.08,.5,'lowpass')})}
  else if(kind==='constrict'){ // medido de la referencia: 4 oleadas de ruido que se cierran (agudo→medio) + chasquido + crujido pulsante
   [.06,.18,.29,.41].forEach((t,k)=>{noise(3400-k*150,2000,t,.12,.13,.5);noise(6500,3500,t,.1,.06,.5)});
   noise(2500,800,.83,.07,.16,.6);for(let k=0;k<11;k++)noise(1500,800,.99+k*.022,.016,.14,1.6);tone(900,800,.99,.24,'sawtooth',.03)}
  else if(kind==='zap'){for(let i=0;i<8;i++)tone(i%2?2400:600,i%2?260:1600,i*.045,.05,'sawtooth',.04)}
  else if(kind==='bubbles'){for(let i=0;i<6;i++)tone(260+((i*37)%5)*70,520+((i*53)%4)*100,i*.08,.1,'sine',.04)}
  else if(kind==='sleep'){[523,440,349,262].forEach((n,i)=>tone(n,n*.98,i*.22,.3,'sine',.045))}
  else if(kind==='confuse'){for(let i=0;i<8;i++)tone(500+(i%2)*260,520+(i%2)*260,i*.07,.07,'triangle',.04)}
  else if(kind==='leaf'){noise(1500,3500,0,.3,.04,2);tone(500,800,.1,.15,'sine',.03)}
  else if(kind==='slow'){tone(400,120,0,.5,'sawtooth',.04)}
  else if(kind==='throw'){noise(600,1900,0,.28,.045,2)}
  else if(kind==='ballhit'){tone(320,110,0,.14,'square',.06);noise(2000,300,0,.1,.05,1)}
  else if(kind==='absorb'){tone(1400,300,0,.35,'sine',.05);noise(3000,500,0,.3,.03,2)}
  else if(kind==='shake'){tone(240,170,0,.1,'square',.05);tone(200,140,.1,.08,'square',.04)}
  else if(kind==='click'){tone(1100,600,0,.05,'square',.05)}
  else if(kind==='caught'){[784,988,1175,1568].forEach((n,i)=>tone(n,n,i*.1,.2,'triangle',.05));tone(1568,1568,.45,.5,'sine',.04)}
  else if(kind==='escape'){tone(700,160,0,.35,'sawtooth',.05);noise(2500,500,.05,.3,.05,1)}
  else if(kind==='evoCharge'){for(let i=0;i<14;i++)tone(300+i*65,330+i*72,i*.2,.18,'triangle',.035)}
  else if(kind==='evoDone'){[[0.0,0.136,698],[0.17,0.116,698],[0.292,0.048,622],[0.34,0.544,524],[0.891,0.048,932],[0.986,0.17,932],[1.163,0.048,587],[1.204,0.048,698],[1.34,0.082,524],[1.455,0.116,466],[1.578,0.612,880]].forEach(([t,d,f])=>tone(f,f,t,d,'square',.045))}
  else if(kind==='coin'){tone(988,988,0,.08,'square',.05);tone(1319,1319,.08,.3,'square',.05)}
  else if(kind==='buy'){tone(1319,1319,0,.06,'square',.04);tone(1760,1760,.06,.08,'square',.04);tone(2093,2093,.14,.16,'square',.035)}
  else if(kind==='levelup'){[[0,.25,880],[.4,.17,523],[.62,.15,523],[.77,.15,784],[.95,.15,932],[1.15,.12,784],[1.27,.07,659],[1.35,.95,880]].forEach(([t,d,f])=>tone(f,f,t,d,'square',.05))}
 }catch(e){}
}
const FE_STATUS={
 atkUp:['ATAQUE ↑','up','#6ab8ff'],atkDown:['ATAQUE ↓','down','#f06a58'],defDown:['DEFENSA ↓','down','#f0a050'],accuracyDown:['PRECISIÓN ↓','down','#e8d27a'],
 defUp:['DEFENSA ↑','up','#6ab8ff'],evadeUp:['EVASIÓN ↑','up','#9af0b0'],
 paralysis:['¡PARALIZADO!','zap','#ffe04a'],poison:['¡ENVENENADO!','bubble','#b070e0'],poison20:['¡ENVENENADO!','bubble','#b070e0'],
 sleep:['¡DORMIDO!','zzz','#9ab8ff'],encore:['¡OTRA VEZ!','stars','#ffd070'],paralysis10:['¡PARALIZADO!','zap','#ffe04a'],confuse10:['¡CONFUSO!','stars','#ffd070'],confuse20:['¡CONFUSO!','stars','#ffd070'],slow10:['¡LENTO!','slow','#aab0c0'],flinch30:['¡AMEDRENTADO!','stars','#ffd070'],poison40:['¡ENVENENADO!','bubble','#b070e0'],speedUp:['VELOCIDAD ↑','up','#9af0b0'],mudsport:['ELÉCTRICO ↓','up','#d2b48c'],defDown2:['DEFENSA ↓↓','down','#f0a050'],confuse:['¡CONFUSO!','stars','#ffd070'],seed:['¡DRENADORAS!','leaf','#6fd070'],slow:['¡LENTO!','slow','#aab0c0'],trap:['¡ATRAPADO!','slow','#d09a5a'],critUp:['CRÍTICO ↑','up','#ffb04a']
};
function feStatusSound(kind){return ({down:'statDown',up:'statUp',zap:'zap',bubble:'bubbles',zzz:'sleep',stars:'confuse',leaf:'leaf',slow:'slow'})[kind]||'statUp'}
function feArrow(x,y,dirDown,color,alpha){
 sg.save();sg.globalAlpha=Math.max(0,Math.min(1,alpha));
 const d=dirDown?1:-1,yy=dirDown?y:y+30;
 polygon([[x-8,yy],[x+8,yy],[x+8,yy+12*d],[x+16,yy+12*d],[x,yy+30*d],[x-16,yy+12*d],[x-8,yy+12*d]],color);
 sg.restore();
}
function feRibbon(title,col){
 sg.font='900 17px monospace';const rw=Math.min(700,Math.ceil(sg.measureText(title).width)+70);
 px(360-rw/2+4,22,rw,38,'#08121c');px(360-rw/2,18,rw,38,'#0f1c2e');px(360-rw/2+3,21,rw-6,32,'#27425c');px(360-rw/2+3,21,10,32,col);
 textPixel(title,365,38,17,'#fff3cf','center');
}

// v0.179 · animaciones propias para los movimientos de estado de las primeras rutas
function feStatusMove(key,A,ax,ay,tx,ty,dir,self,t,miss){
 const k0=t-(self?700:620),span=key==='screech'?800:1500;if(k0<0||k0>span+500)return;
 const k=Math.min(1,k0/span),fade=k0>span?Math.max(0,1-(k0-span)/500):1;
 sg.save();sg.globalAlpha=fade;
 const lerp=(a,b,q)=>a+(b-a)*q;
 const wave=(n,cols,wide)=>{for(let i=0;i<n;i++){const q=(k*1.1+i/n)%1,x=lerp(ax+dir*60,tx,q),r=14+q*wide;sg.strokeStyle=cols[i%cols.length];sg.lineWidth=Math.max(2,7*(1-q));sg.beginPath();sg.arc(x,ay,r,dir>0?-1.1:Math.PI-1.1,dir>0?1.1:Math.PI+1.1,dir<0&&false);sg.stroke()}};
 const cloud=(cols,n)=>{for(let i=0;i<n;i++){const q=Math.min(1,k*1.15),x=lerp(ax+dir*50,tx,q)+Math.sin(i*2.3+k0/120)*18,y=ay-30+((i*37)%60)+Math.cos(i+k0/150)*8,r=6+((i*7)%9)+q*10;sg.globalAlpha=fade*(.35+.4*(i%3)/2);sg.fillStyle=cols[i%cols.length];sg.beginPath();sg.arc(x,y,r,0,7);sg.fill()}sg.globalAlpha=fade};
 const note=(x,y,c)=>{px(x-6,y,12,10,c);px(x+4,y-26,4,28,c);px(x+4,y-26,16,6,c)};
 switch(key){
  case 'growl':wave(4,['#ffffff','#f6d27a'],70);break;
  case 'screech':for(let i=0;i<5;i++){const q=(k*1.15+i*.2)%1,x=lerp(ax+dir*50,tx,q),r=12+q*62;sg.strokeStyle='#2f7a34';sg.lineWidth=Math.max(4,12*(1-q*.5));sg.beginPath();sg.ellipse(x,ay,r*.55,r,0,0,7);sg.stroke();sg.strokeStyle=i%2?'#9fe36c':'#6cd060';sg.lineWidth=Math.max(2,7*(1-q*.5));sg.beginPath();sg.ellipse(x,ay,r*.55,r,0,0,7);sg.stroke()}break;
  case 'supersonic':for(let i=0;i<4;i++){const q=(k*1.1+i*.25)%1;sg.strokeStyle=i%2?'#7ad8ff':'#ffffff';sg.lineWidth=Math.max(2,6*(1-q));sg.beginPath();sg.arc(lerp(ax,tx,q),ay,10+q*60,0,7);sg.stroke()}break;
  case 'sing':for(let i=0;i<4;i++){const q=(k*1.1+i*.22)%1;note(lerp(ax+dir*40,tx,q),ay-20+Math.sin(q*9+i)*34-q*30,i%2?'#ffb0d8':'#ffffff')}break;
  case 'leer':{const g=Math.min(1,k*3);for(const sx of [-26,26]){polygon([[tx+sx-18,ty-70],[tx+sx+18,ty-70-8*g],[tx+sx+14,ty-56],[tx+sx-14,ty-60]],'#2a0a0a');px(tx+sx-8,ty-68,16,6,'#ff3030')}
   for(let i=0;i<6;i++)fxLine(tx+(i-2.5)*18,ty-100,tx+(i-2.5)*22,ty-120-g*12,3,'#ff6a5a');break}
  case 'scary':{const g=Math.min(1,k*2.2),r=30+g*60;sg.globalAlpha=fade*.85;sg.fillStyle='#1a0a2a';sg.beginPath();sg.ellipse(tx,ty-20,r,r*1.2,0,0,7);sg.fill();
   sg.fillStyle='#ffffff';polygon([[tx-r*.6,ty-60],[tx-r*.15,ty-40],[tx-r*.55,ty-30]],'#ffffff');polygon([[tx+r*.6,ty-60],[tx+r*.15,ty-40],[tx+r*.55,ty-30]],'#ffffff');
   for(let i=0;i<6;i++)polygon([[tx-r*.6+i*r*.24,ty+4],[tx-r*.48+i*r*.24,ty+26],[tx-r*.36+i*r*.24,ty+4]],'#ffffff');
   sg.globalAlpha=fade*.18;px(0,0,720,600,'#7a1a4a');break}
  case 'sand':for(let i=0;i<22;i++){const q=Math.min(1,k*1.4-i*.01),x=lerp(ax+dir*50,tx,q)+(i%5)*5,y=ay+20-Math.sin(q*Math.PI)*40+((i*13)%40)-20;fxSq(x,y,i%3?6:9,i%2?'#d8b878':'#b8945a')}
   if(k>.55)for(let i=0;i<14;i++){const a=i*.9,r=(k-.55)*160;fxSq(tx+Math.cos(a)*r*.8,ty+Math.sin(a)*r*.6,8,'#c8a468')}break;
  case 'smoke':for(let i=0;i<9;i++){const q=Math.min(1,k*1.3),x=lerp(ax+dir*50,tx,q)+(i%3-1)*16,y=ty-20+Math.floor(i/3)*26-24,r=14+q*30;sg.globalAlpha=fade*.7;sg.fillStyle=i%2?'#454a54':'#6a707c';sg.beginPath();sg.arc(x,y+Math.sin(k0/180+i)*5,r,0,7);sg.fill()}break;
  case 'harden':case 'withdraw':case 'curl':{const col=key==='withdraw'?'#6ab8ff':key==='curl'?'#e8d8a0':'#dfe6f2';
   sg.globalAlpha=fade*(.28+.18*Math.sin(k0/90));sg.fillStyle=col;sg.beginPath();sg.ellipse(ax,ay,64,82,0,0,7);sg.fill();sg.globalAlpha=fade;
   sg.strokeStyle='#ffffff';sg.lineWidth=5;sg.beginPath();sg.ellipse(ax,ay,64,82,0,0,7);sg.stroke();
   const sw=((k0/9)%240)-60;sg.save();sg.beginPath();sg.ellipse(ax,ay,64,82,0,0,7);sg.clip();px(ax-60+sw,ay-90,20,180,'rgba(255,255,255,.7)');sg.restore();
   if(key==='curl')for(let i=0;i<3;i++){sg.strokeStyle='#ffffff';sg.lineWidth=4;sg.beginPath();sg.arc(ax,ay,50+i*10,k0/140+i*2,k0/140+i*2+1.6);sg.stroke()}
   for(let i=0;i<4;i++){const a=k0/300+i*1.57;polygon([[ax+Math.cos(a)*80,ay+Math.sin(a)*96-8],[ax+Math.cos(a)*80+5,ay+Math.sin(a)*96],[ax+Math.cos(a)*80,ay+Math.sin(a)*96+8],[ax+Math.cos(a)*80-5,ay+Math.sin(a)*96]],'#ffffff')}break}
  case 'doubleteam':{const off=Math.sin(k0/110)*70;for(const m of [-1,1]){sg.save();sg.globalAlpha=fade*.4;sg.translate(m*off,0);try{drawFECreature(A,dir>0,t,{attacker:A,target:A,move:{},critical:false,miss:false,status:true,defAfter:1},{proj:null},0)}catch(e){}sg.restore()}break}
  case 'agility':for(let i=0;i<8;i++){const q=(k0/380+i*.13)%1,y=ay-70+i*20;fxLine(ax-dir*(40+q*110),y,ax-dir*(10+q*110),y,5,i%2?'#ffd0ec':'#f06ab0')}break;
  case 'focus':for(let i=0;i<8;i++){const a=i*.785+k0/400,q=(k0/600+i*.12)%1,r0=140*(1-q),r1=r0+30;fxLine(ax+Math.cos(a)*r1,ay+Math.sin(a)*r1,ax+Math.cos(a)*r0,ay+Math.sin(a)*r0,4,i%2?'#ffb040':'#ff5a3a')}
   sg.strokeStyle='#ff6a3a';sg.lineWidth=5;sg.globalAlpha=fade*.7;sg.beginPath();sg.ellipse(ax,ay,56+Math.sin(k0/80)*5,74,0,0,7);sg.stroke();break;
  case 'tailwhip':for(let i=0;i<3;i++){const sw=Math.sin(k0/70+i);sg.strokeStyle='#ffffff';sg.lineWidth=6;sg.beginPath();sg.arc(ax-dir*50,ay+30,34+i*14,dir>0?Math.PI*.8:-Math.PI*.2,(dir>0?Math.PI*.8:-Math.PI*.2)+dir*(1.1+.4*sw),dir<0);sg.stroke()}break;
  case 'mudsport':for(let i=0;i<10;i++){const q=(k0/700+i*.17)%1,x=ax-60+((i*41)%120),y=ay-130+q*210;sg.fillStyle=i%2?'#6b4a2a':'#8a643a';sg.beginPath();sg.arc(x,y,7+(i%3)*3,0,7);sg.fill()}break;
  case 'powderpoison':cloud(['#b070e0','#8a4ac0','#d8a8f0'],16);break;
  case 'powdersleep':cloud(['#ff9ac8','#9ab8ff','#ffffff'],16);break;
  case 'stunspore':cloud(['#ffe04a','#f6c020','#fff4a0'],16);for(let i=0;i<4;i++)fxBolt(tx-30+i*20,ty-80,tx-24+i*20,ty+10,t,3,10,i+3);break;
  case 'wave':for(let i=0;i<3;i++){const q=(k*1.2+i*.3)%1;fxBolt(ax+dir*50,ay,lerp(ax+dir*50,tx,q),ay+Math.sin(q*12)*20,t+i*40,3,14,i+1)}break;
  case 'seed':for(let i=0;i<4;i++){const q=Math.min(1,k*1.5-i*.12);if(q<=0)continue;const x=lerp(ax+dir*50,tx,q),y=ay-Math.sin(q*Math.PI)*90;px(x-6,y-8,12,16,'#3a2a12');px(x-4,y-6,8,12,'#8fd05a')}break;
  case 'stringshot':{const q=Math.min(1,k*1.6);for(let i=0;i<3;i++)fxLine(ax+dir*50,ay-10+i*10,lerp(ax+dir*50,tx,q),lerp(ay-10+i*10,ty-20+i*18,q),4,'#ffffff');
   if(q>=1)for(let i=0;i<4;i++){fxLine(tx-60,ty-70+i*34,tx+60,ty-50+i*34,3,'#e8eef2');fxLine(tx-50+i*34,ty-80,tx-30+i*34,ty+50,3,'#e8eef2')}break}
 }
 sg.restore();
}
function drawFEStatusFrame(ev,t,duration){
 window.__fed=null;
 const A=ev.attacker,self=ev.target===A,other=self?ev.foe:ev.target,aLeft=A.side==='player';
 const info=FE_STATUS[ev.move.effect]||['EFECTO','up','#ffffff'];
 const typeCol=(FX_TYPE[ev.move.type]||FX_TYPE.normal)[0],kind=info[1],col=info[2];
 sg.clearRect(0,0,720,600);
 feSolo=self;
 drawFEStage(t,false);
 const dummy={attacker:A,target:other||A,move:ev.move,critical:false,miss:ev.miss,status:true,defAfter:1};
 if(!self&&other&&other!==A)drawFECreature(other,!aLeft,t,dummy,{proj:null},0);
 drawFECreature(A,aLeft,t,dummy,{proj:null},0);
 const ax=self?360:(aLeft?FE.pX:FE.eX),dir=aLeft?1:-1,ay=FE.feet+FE.chest;
 const tx=self?ax:(aLeft?FE.eX:FE.pX),ty=ay;
 // aura del atacante al preparar el movimiento
 if(t>380&&t<1000){const k=(t-380)/620;sg.save();sg.globalAlpha=.55*Math.sin(k*Math.PI);sg.strokeStyle=typeCol;sg.lineWidth=5;sg.beginPath();sg.ellipse(ax,ay,50+k*30,60+k*30,0,0,7);sg.stroke();sg.restore()}
 // orbe hacia el objetivo
 if(!self&&t>=620&&t<1100){
  const k=(t-620)/480,x=ax+dir*70+(tx-ax-dir*70)*k*(ev.miss?1.5:1),y=ay-Math.sin(k*Math.PI)*30;
  for(let i=0;i<5;i++){sg.save();sg.globalAlpha=.7-i*.13;px(x-dir*i*14-8+ i,y-8+i,16-i*2,16-i*2,i?typeCol:'#ffffff');sg.restore()}
 }
 const eStart=self?800:1100;
 if(!ev.miss&&!ev.noEffect&&t>=eStart){
  const k=t-eStart;
  sg.save();
  if(kind==='down'||kind==='up'){
   for(let i=0;i<5;i++){const x=tx-52+i*26,off=(k*.14+i*34)%120,y=kind==='down'?ty-70+off:ty+60-off-30;feArrow(x,y,kind==='down',col,1-Math.abs(off-60)/70)}
   if(kind==='up'){sg.globalAlpha=.4+.2*Math.sin(k/90);sg.strokeStyle=col;sg.lineWidth=4;sg.beginPath();sg.ellipse(tx,ty,58,74,0,0,7);sg.stroke()}
  }else if(kind==='zap'){
   for(let b=0;b<3;b++){let x=tx-30+b*30,y=ty-150;sg.strokeStyle=(Math.floor(k/70)+b)%2?'#fff6a0':col;sg.lineWidth=5;sg.beginPath();sg.moveTo(x,y);
    for(let s=1;s<=6;s++){x+=((s*13+b*7+Math.floor(k/90)*5)%24)-12;y+=40;sg.lineTo(x,y)}sg.stroke()}
  }else if(kind==='bubble'){
   for(let i=0;i<8;i++){const off=(k*.09+i*29)%110,x=tx-45+((i*37)%90)+Math.sin(k/200+i)*8,y=ty+60-off,r=6+(i%3)*4;sg.globalAlpha=1-off/120;sg.fillStyle=col;sg.beginPath();sg.arc(x,y,r,0,7);sg.fill();sg.fillStyle='#e8c8ff';sg.fillRect(x-r/2,y-r/2,3,3)}
  }else if(kind==='zzz'){
   for(let i=0;i<3;i++){const off=((k*.05)+i*30)%90;sg.globalAlpha=1-off/100;textPixel('Z',tx+20+i*16,ty-80-off,16+i*8,col,'center')}
  }else if(kind==='stars'){
   for(let i=0;i<4;i++){const a=k/260+i*1.57,x=tx+Math.cos(a)*46,y=ty-92+Math.sin(a)*12;polygon([[x,y-9],[x+5,y],[x,y+9],[x-5,y]],col);polygon([[x-9,y],[x,y-5],[x+9,y],[x,y+5]],'#fff3b0')}
  }else if(kind==='leaf'){
   for(let i=0;i<7;i++){const a=k/230+i*.9,r=70-((k*.04+i*9)%46),x=tx+Math.cos(a)*r,y=ty+10+Math.sin(a)*r*.9;polygon([[x,y-8],[x+6,y],[x,y+8],[x-6,y]],i%2?col:'#2f8a42')}
  }else if(kind==='slow'){
   for(let i=0;i<4;i++){const off=(k*.2+i*40)%130;sg.globalAlpha=1-off/140;px(tx+dir*(off-20)-30,ty-50+i*30,60-off*.2,6,col)}
   px(tx-40,ty+80,80,8,'#707788');
  }
  sg.restore();
 }
 if(!ev.miss||t<1100)feStatusMove(fxMoveKey(ev.move),A,ax,ay,tx,ty,dir,self,t,ev.miss);
 const label=ev.miss?'FALLÓ':ev.noEffect?'NO AFECTA A '+base[ev.target.id].name.toUpperCase():info[0];
 if(t>(ev.miss||ev.noEffect?1100:eStart+250)){
  const w=label.length*13+44,bg=ev.miss||ev.noEffect?'#5d6676':kind==='up'?'#28775b':kind==='down'?'#8a3a3a':'#4a4f7a';
  px(360-w/2,78,w,32,bg);textPixel(label,360,95,16,'#fff1ba','center');
 }
 feRibbon((ev.counter?'CONTRAATAQUE · ':'')+base[A.id].name.toUpperCase()+' · '+ev.move.name.toUpperCase(),typeCol);
 if(self){drawFEPanel(192,486,336,102,A,aLeft,A.hp,ev,false)}else{
 const pl=aLeft?A:other,en=aLeft?other:A;
 if(pl)drawFEPanel(14,486,336,102,pl,true,pl.hp,ev,false);
 if(en)drawFEPanel(370,486,336,102,en,false,en.hp,ev,false)}
 feSolo=false;
 if(t<280||t>duration-210){const a=t<280?1-t/280:Math.max(0,(t-(duration-210))/210);sg.save();sg.globalAlpha=a;px(0,0,720,600,'#172d3b');sg.restore()}
}
/* ---- captura y evolución sobre el mismo escenario ---- */
function feBall(x,y,r,rot,openK,ballId){
 const top=ballId==='greatball'?'#2f6ed0':ballId==='ultraball'?'#e8c53a':'#d8423c';
 sg.save();sg.translate(Math.round(x),Math.round(y));sg.rotate(rot);
 const o=Math.max(0,Math.min(1,openK||0));
 if(o<=0){
  sg.fillStyle='#10161e';sg.beginPath();sg.arc(0,0,r+3,0,7);sg.fill();
  sg.fillStyle=top;sg.beginPath();sg.arc(0,0,r,Math.PI,0);sg.fill();
  sg.fillStyle='#f4f4ef';sg.beginPath();sg.arc(0,0,r,0,Math.PI);sg.fill();
  sg.fillStyle='#10161e';sg.fillRect(-r,-2,r*2,4);
  sg.fillStyle='#f4f4ef';sg.beginPath();sg.arc(0,0,r*.34,0,7);sg.fill();sg.strokeStyle='#10161e';sg.lineWidth=3;sg.stroke();
  sg.fillStyle='rgba(255,255,255,.55)';sg.fillRect(-r*.65,-r*.6,r*.3,r*.2);
 }else{
  // mitad inferior
  sg.fillStyle='#10161e';sg.beginPath();sg.arc(0,0,r+3,0,Math.PI);sg.closePath();sg.fill();
  sg.fillStyle='#f4f4ef';sg.beginPath();sg.arc(0,0,r,0,Math.PI);sg.closePath();sg.fill();
  // interior luminoso entre las dos mitades
  sg.fillStyle='#ffe9e4';sg.beginPath();sg.ellipse(0,0,r,Math.max(1,r*.38*o),0,0,7);sg.fill();
  sg.fillStyle='#10161e';sg.fillRect(-r,-2+Math.round(r*.1*o),r*2,3);
  // tapa articulada en el lado izquierdo
  sg.save();sg.translate(-r*.9,0);sg.rotate(-o*1.25);sg.translate(r*.9,0);
  sg.fillStyle='#10161e';sg.beginPath();sg.arc(0,0,r+3,Math.PI,0);sg.closePath();sg.fill();
  sg.fillStyle=top;sg.beginPath();sg.arc(0,0,r,Math.PI,0);sg.closePath();sg.fill();
  sg.fillStyle='#10161e';sg.fillRect(-r,-3,r*2,3);
  sg.fillStyle='rgba(255,255,255,.45)';sg.fillRect(-r*.65,-r*.6,r*.3,r*.2);
  sg.restore();
 }
 sg.restore();
}
const feTints=new WeakMap();
function feTint(img,bb,color){
 let m=feTints.get(img);if(!m){m=new Map();feTints.set(img,m)}
 let c=m.get(color);
 if(!c){c=document.createElement('canvas');c.width=bb.sw;c.height=bb.sh;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,bb.sx,bb.sy,bb.sw,bb.sh,0,0,bb.sw,bb.sh);g.globalCompositeOperation='source-atop';g.fillStyle=color;g.fillRect(0,0,bb.sw,bb.sh);m.set(color,c)}
 return c;
}
// Dibuja un Pokémon concreto en (x, feet) con escala, mirando a la izquierda (rival) o a la derecha (jugador).
/* Sprites animados (PMD) en interfaz y escenas; los sprites antiguos solo se quedan en la Pokédex. */
const _pmdCv=new Set();let _pmdRun=false;
function pmdAnimCanvas(id,size,still){const c=document.createElement('canvas');c._still=!!still;c.width=c.height=size*2;c.style.cssText='width:'+size+'px;height:'+size+'px;image-rendering:pixelated;flex:none';c._id=id;c._born=performance.now();_pmdCv.add(c);if(!_pmdRun){_pmdRun=true;requestAnimationFrame(_pmdTick)}return c}
function _pmdTick(now){
 for(const c of _pmdCv){if(!c.isConnected){if(now-c._born>3000)_pmdCv.delete(c);continue}
  const g=c.getContext('2d'),r=pmdOk(c._id);
  if(!r){if(c._fbT&&now-c._fbT<900)continue;c._fbT=now;g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;const s=getMiniSprite(c._id%1000);
   if(s&&s.ready){const iw=s.img.naturalWidth||32,ih=s.img.naturalHeight||32,fw=(iw>=ih*1.7&&iw>=48)?iw/2:iw,fh=(ih>=iw*1.7&&ih>=48)?ih/2:ih,k=Math.min(c.width/fw,c.height/fh);g.drawImage(s.img,0,0,fw,fh,(c.width-fw*k)/2,(c.height-fh*k)/2,fw*k,fh*k)}
   else{g.font=(c.height*.6)+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(base[c._id%1000]?base[c._id%1000].emoji:'',c.width/2,c.height/2)}
   continue}
  if(c._still&&c._fi!==undefined){_pmdCv.delete(c);continue}
  const fi=pmdFrame(r,c._still?0:now,true);if(c._fi===fi&&c._rd===r)continue;c._fi=fi;c._rd=r;
  const m=r.m,A0=r.alt['0'];
  if(A0&&A0.complete&&A0.naturalWidth&&!(m.bbs&&m.bbs['0'])){ // fila frontal sin caja propia: se calcula desde los píxeles reales (antes se recortaba con la caja del sprite de lado)
   if(!r._ab0){try{const n=Math.max(1,Math.floor(A0.naturalWidth/m.fw)),q=document.createElement('canvas');q.width=A0.naturalWidth;q.height=A0.naturalHeight;const x=q.getContext('2d');x.drawImage(A0,0,0);const d=x.getImageData(0,0,q.width,q.height).data;let x0=1e9,y0=1e9,x1=-1,y1=-1;for(let f=0;f<n;f++)for(let yy=0;yy<q.height;yy++)for(let xx=0;xx<m.fw;xx++)if(d[(yy*q.width+f*m.fw+xx)*4+3]>8){x0=Math.min(x0,xx);x1=Math.max(x1,xx+1);y0=Math.min(y0,yy);y1=Math.max(y1,yy+1)}r._ab0=x1>0?[x0,y0,x1,y1]:m.bb}catch(e){r._ab0=m.bb}}
   const b=r._ab0,bw=b[2]-b[0],bh=b[3]-b[1],sc=Math.min(c.width*.92/bw,c.height*.92/bh);
   g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.drawImage(A0,fi*m.fw+b[0],b[1],bw,bh,Math.round(c.width/2-bw*sc/2),Math.round(c.height*.97-bh*sc),Math.round(bw*sc),Math.round(bh*sc));continue}
  const ALT=!!(A0&&A0.complete&&m.bbs&&m.bbs['0']),b=ALT?m.bbs['0']:m.bb,bw=b[2]-b[0],bh=b[3]-b[1],sc=Math.min(c.width*.92/bw,c.height*.92/bh);
  g.clearRect(0,0,c.width,c.height);g.imageSmoothingEnabled=false;g.save();g.translate(Math.round(c.width/2-((b[0]+b[2])/2-m.fw/2)*sc),Math.round(c.height*.97));pmdDraw(g,r,fi,sc,0,'0');g.restore()}
 if(_pmdCv.size)requestAnimationFrame(_pmdTick);else _pmdRun=false}
function pmdFill(root){if(!root)return;for(const s of root.querySelectorAll('.pmdSlot')){s.replaceWith(pmdAnimCanvas(Number(s.dataset.pmd),Number(s.dataset.s)||48,s.dataset.still==='1'))}}
const _feTmp=document.createElement('canvas');_feTmp.width=_feTmp.height=700;
function feSprite(id,x,feet,facingRight,mul,alpha,tint,tintAlpha){
 const _pi=pmdOk(id)?feSpriteInfo({id:id},false):null;
 if(_pi&&_pi.pmd){const R=_pi.pmd,fi=pmdFrame(R,performance.now(),true);sg.save();sg.globalAlpha=alpha;sg.translate(Math.round(x),Math.round(feet));sg.imageSmoothingEnabled=false;sg.scale(mul*(window.__evoFront?1:facingRight?1:-1),mul);pmdDraw(sg,R,fi,_pi.scale,0,window.__evoFront?'0':0);
  if(tint&&tintAlpha>0){const tg=_feTmp.getContext('2d');tg.clearRect(0,0,700,700);tg.save();tg.translate(350,680);tg.imageSmoothingEnabled=false;pmdDraw(tg,R,fi,_pi.scale,0,window.__evoFront?'0':0);tg.restore();tg.globalCompositeOperation='source-atop';tg.fillStyle=tint;tg.fillRect(0,0,700,700);tg.globalCompositeOperation='source-over';sg.globalAlpha=alpha*tintAlpha;sg.drawImage(_feTmp,-350,-680)}
  sg.restore();return}
 const sprite=fetchSprite(id),ready=!!(sprite&&sprite.ready),local=!ready||sprite.source==='local';
 sg.save();sg.globalAlpha=alpha;sg.translate(Math.round(x),Math.round(feet));sg.imageSmoothingEnabled=false;sg.scale(mul,mul);
 const flip=local?!facingRight:facingRight;sg.scale(flip?-1:1,1);
 if(ready&&!local){
  const bb=combatSpriteBounds(sprite.img),sc=4,w=bb.sw*sc,h=bb.sh*sc;
  sg.drawImage(sprite.img,bb.sx,bb.sy,bb.sw,bb.sh,Math.round(-w/2),-h,w,h);
  if(tint){sg.globalAlpha=alpha*tintAlpha;sg.drawImage(feTint(sprite.img,bb,tint),Math.round(-w/2),-h,w,h)}
 }else if(ready){
  const iw=sprite.img.naturalWidth||32,ih=sprite.img.naturalHeight||32;sg.drawImage(sprite.img,-iw*3,-ih*6+8,iw*6,ih*6);
 }else drawFallbackCreature(id,0,-70,1.2,true);
 sg.restore();
}
function feRunTimeline(duration,draw,sounds){
 return new Promise(resolve=>{
  const flags={};let start=null;
  function tick(now){
   if(start===null)start=now;const t=Math.min(duration,(now-start)*animSpeed);
   try{draw(t)}catch(e){console.warn(e)}
   if(sounds)for(const s of sounds){if(!flags[s[0]]&&t>=s[0]){flags[s[0]]=1;bsfx(s[1],s[2])}}
   if(t<duration)requestAnimationFrame(tick);else resolve();
  }
  requestAnimationFrame(tick);
 });
}
async function showCaptureFE(actor,enemy,ballId,result){
 cinematicBusy=true;$('cinematic').hidden=false;
 const _sv={solo:feSolo,evo:window.__evoFront};feSolo=true;window.__evoFront=true;
 const ex=360,fy=FE.feet,px0=540,py0=720,shakes=result.success?3:Math.min(result.shakes,3);
 const T={throw:500,enter:1050,absorb:1500,drop:1950,shake0:2450,shakeLen:820};
 const shakeEnd=T.shake0+shakes*T.shakeLen,end=shakeEnd+1500;
 fetchSprite(enemy.id);fetchSprite(actor.id);
 const enemySid=(enemy.shiny&&pmdOk(enemy.id+1000))?enemy.id+1000:enemy.id; // v651: si es variocolor, se ve variocolor también al capturarlo
 const sounds=[[T.throw,'throw'],[T.enter,'ballhit'],[T.absorb,'absorb'],[T.drop,'ballhit']];
 for(let i=0;i<shakes;i++)sounds.push([T.shake0+i*T.shakeLen+120,'shake']);
 sounds.push([shakeEnd+100,result.success?'caught':'escape']);
 try{
  await feRunTimeline(end,t=>{
   sg.clearRect(0,0,720,600);drawFEStage(t,false);
   const slide=Math.min(1,t/350);
   const ballY=fy-18;let bx=ex,by=ballY,rot=0,showBall=false,br=17;
   // enemigo
   let mul=1,tint=null,ta=0,alpha=slide;
   if(t>=T.enter&&t<T.absorb){const k=(t-T.enter)/(T.absorb-T.enter);tint=k>.1?'#ff5a4a':'#ffffff';ta=Math.min(1,k*1.4);}
   if(t>=T.absorb){const k=Math.min(1,(t-T.absorb)/450);mul=Math.max(.02,1-k);tint='#ff5a4a';ta=1;alpha=1-k*.2}
   const escapeAt=shakeEnd+200;
   if(!result.success&&t>=escapeAt){const k=Math.min(1,(t-escapeAt)/420);mul=k;tint='#ffffff';ta=1-k;alpha=1}
   if(result.success&&t>=T.absorb+450)alpha=0;
   if(alpha>0&&mul>.03&&!(t>=T.drop&&t<escapeAt))feSprite(enemySid,ex,fy,false,mul*1.4,alpha,tint,ta);
   // pelota
   if(t>=T.throw&&t<T.enter){const k=(t-T.throw)/(T.enter-T.throw);bx=px0+(ex-px0)*k;by=py0+(fy-140-py0)*k-Math.sin(k*Math.PI)*170;rot=k*14;br=17+40*Math.pow(1-k,1.5);showBall=true}
   else if(t>=T.enter&&t<T.absorb){const k=(t-T.enter)/(T.absorb-T.enter);bx=ex;by=(fy-140)+Math.sin(k*3)*4;rot=0;showBall=true}
   else if(t>=T.absorb&&t<T.drop){const k=(t-T.absorb)/(T.drop-T.absorb),kk=Math.min(1,k*1.2);bx=ex;by=(fy-140)+(ballY-(fy-140))*kk*kk;showBall=true}
   else if(t>=T.drop&&t<escapeAt){
    const since=t-T.drop;by=ballY-(since<260?Math.abs(Math.sin(since/260*Math.PI))*26*(1-since/260):0);
    if(t>=T.shake0){const i=Math.floor((t-T.shake0)/T.shakeLen),k=((t-T.shake0)%T.shakeLen)/T.shakeLen;if(i<shakes)rot=Math.sin(k*Math.PI*2)*(k<.7?.5:0)*(1-k*.4)}
    showBall=true;
   }else if(t>=escapeAt&&!result.success){const k=Math.min(1,(t-escapeAt)/420);showBall=k<.4;rot=0}
   else if(t>=escapeAt&&result.success)showBall=true;
   // abre y cierra: se abre al tocar al Pokémon, absorbe con un haz rojo y se cierra antes de caer
   let openK=0;
   if(t>=T.enter&&t<T.drop){const cs=T.absorb+330;openK=t<T.enter+180?(t-T.enter)/180:t<cs?1:1-(t-cs)/(T.drop-cs)}
   if(!result.success&&t>=escapeAt)openK=Math.min(1,(t-escapeAt)/150);
   let beam=0;
   if(t>=T.enter+120&&t<T.absorb+450)beam=Math.min(1,(t-T.enter-120)/200)*(t<T.absorb?1:Math.max(0,1-(t-T.absorb)/450));
   else if(!result.success&&t>=escapeAt&&t<escapeAt+420)beam=Math.max(0,1-(t-escapeAt)/420);
   if(beam>0&&showBall){
    const wob=1+Math.sin(t/45)*.08,hw=Math.max(8,60*(mul>.03?mul:.3))*wob;
    sg.save();sg.globalAlpha=.55*beam;polygon([[bx-9,by+4],[bx+9,by+4],[ex+hw,fy-14],[ex-hw,fy-14]],'#ff4a3c');
    sg.globalAlpha=.55*beam;polygon([[bx-4,by+4],[bx+4,by+4],[ex+hw*.45,fy-14],[ex-hw*.45,fy-14]],'#ffe0d8');sg.restore();
   }
   if(showBall){if(t>=T.enter){sg.save();sg.globalAlpha=.3;pixEllipse(Math.round(bx),fy+6,22,6,'#1b2a20');sg.restore()}feBall(bx,by,br,rot,openK,ballId)}
   if(result.success&&t>=shakeEnd+100){const k=(t-shakeEnd-100)/900;for(let i=0;i<10;i++){const a=i*.63+k*2,r=20+k*70;sg.save();sg.globalAlpha=Math.max(0,1-k);polygon([[bx+Math.cos(a)*r,by+Math.sin(a)*r-8],[bx+Math.cos(a)*r+5,by+Math.sin(a)*r],[bx+Math.cos(a)*r,by+Math.sin(a)*r+8],[bx+Math.cos(a)*r-5,by+Math.sin(a)*r]],i%2?'#fff3a0':'#ffd04a');sg.restore()}}
   // textos
   feRibbon('CAPTURA · '+base[enemy.id].name.toUpperCase()+' · NV. '+enemy.level,'#d8423c');
   // v651: "¡Poké Ball lanzada!" solo mientras vuela y entra en el Pokémon; luego las sacudidas y el resultado (sin volver al texto inicial)
   let msg='';
   if(t>=T.throw-150&&t<T.absorb)msg='¡'+BALLS[ballId].name+' lanzada!';
   else if(t>=T.drop&&t<shakeEnd+200){const i=Math.min(shakes-1,Math.floor(Math.max(0,t-T.shake0)/T.shakeLen));msg=(t<T.shake0||shakes<1)?'…':['Uno…','Dos…','Tres…'][i]||'…'}
   else if(t>=shakeEnd+200)msg=result.success?'¡Capturado! '+base[enemy.id].name+' se unió a tu colección.':'¡Oh, no! ¡Se ha escapado!';
   if(msg){sg.save();const mw=Math.min(680,msg.length*12+60);px(360-mw/2+4,100,mw,40,'#08121c');px(360-mw/2,96,mw,40,result.success&&t>=shakeEnd+200?'#28775b':'#0f1c2e');textPixel(msg,360,116,16,'#fff3cf','center');sg.restore()}
   if(t<280||t>end-230){const a=t<280?1-t/280:Math.max(0,(t-(end-230))/230);sg.save();sg.globalAlpha=a;px(0,0,720,600,'#172d3b');sg.restore()}
  },sounds);
 }finally{feSolo=_sv.solo;window.__evoFront=_sv.evo;hideCinematic()}
}
async function showEvolutionScene(u,fromId,toId){
 cinematicBusy=true;$('cinematic').hidden=false;
 fetchSprite(fromId);fetchSprite(toId);
 const T1=1200,T2=7000,T3=7800,end=10200,fy=FE.feet+10,cx=360;
 const sounds=[[T3+80,'evoDone']];let _c1=0,_c2=0;
 evoPhase='music';musicStart('evolution');window.__evoFront=true;const evs=x=>(u&&u.shiny&&pmdOk(x+1000))?x+1000:x;
 try{
  await feRunTimeline(end,t=>{
   if(t>=T3-40&&evoPhase==='music'){evoPhase='hold';musicStop(.1)}
   sg.clearRect(0,0,720,600);drawFEStage(t,false);
   if(t>=250&&!_c1){_c1=1;try{playCry(fromId%1000,1,.2)}catch(e){}}
   if(t>=T3+330&&!_c2){_c2=1;try{playCry(toId%1000,1,.22)}catch(e){}}
   const dark=t<T3?Math.min(.55,t/900*.55):Math.max(0,.55-(t-T3)/700*.55);
   sg.save();sg.globalAlpha=dark;px(0,0,720,600,'#0b1226');sg.restore();
   // alternancia cada vez más rápida
   let showTo=false,white=0;
   if(t>=T1&&t<T2){const k=(t-T1)/(T2-T1),per=420-k*330,ph=((t-T1)/per);showTo=Math.floor(ph)%2===1;white=1}
   else if(t>=T2){showTo=true;white=t<T3?1:Math.max(0,1-(t-T3)/500)}
   const id=evs(showTo?toId:fromId),pulse=1+(t>=T1&&t<T3?Math.sin(t/60)*.02:0);
   if(t<T3&&t>=T1)feSprite(id,cx,fy,false,pulse,1,'#ffffff',white*.96);
   else if(t<T1)feSprite(evs(fromId),cx,fy,false,1,Math.min(1,t/350));
   else feSprite(evs(toId),cx,fy,false,1,1,'#ffffff',white*.96);
   // partículas ascendentes
   if(t>=T1&&t<T3+300){for(let i=0;i<22;i++){const ph=((t*.12+i*47)%260),x=cx-120+((i*61)%240)+Math.sin(t/300+i)*10,y=fy-ph*1.3+20;sg.save();sg.globalAlpha=Math.max(0,1-ph/260);px(x,y,i%3?5:8,i%3?5:8,i%2?'#ffffff':'#bfe3ff');sg.restore()}}
   if(t>=T1&&t<T3+500){const a0=t/900,fa=t<T3?Math.min(1,(t-T1)/600):Math.max(0,1-(t-T3)/500);sg.save();sg.globalAlpha=.32*fa;for(let i=0;i<10;i++){const a=a0+i*.628;polygon([[cx,fy-100],[cx+Math.cos(a-.07)*520,fy-100+Math.sin(a-.07)*520],[cx+Math.cos(a+.07)*520,fy-100+Math.sin(a+.07)*520]],i%2?'#ffffff':'#bfe3ff')}sg.restore()}
   if(t>=T3&&t<T3+900){const k=(t-T3)/900;for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=40+k*260,x=cx+Math.cos(a)*r,y=fy-100+Math.sin(a)*r*.8;sg.save();sg.globalAlpha=Math.max(0,1-k);polygon([[x,y-12],[x+5,y],[x,y+12],[x-5,y]],'#fff3b0');polygon([[x-12,y],[x,y-5],[x+12,y],[x,y+5]],'#ffffff');sg.restore()}}
   if(t>=T3-60&&t<T3+500){const k=(t-T3+60)/560;sg.save();sg.globalAlpha=Math.max(0,1-k);sg.strokeStyle='#ffffff';sg.lineWidth=8*(1-k)+2;sg.beginPath();sg.arc(cx,fy-100,40+k*320,0,7);sg.stroke();sg.restore()}
   if(t>=T3-60&&t<T3+140){sg.save();sg.globalAlpha=1-(t-(T3-60))/200;px(0,0,720,600,'#ffffff');sg.restore()}
   const msg=t<T3?'¡'+base[fromId].name+' está evolucionando!':'¡'+base[fromId].name+' evolucionó a '+base[toId].name+'!';
   const mw=Math.min(690,msg.length*13+60);px(360-mw/2+4,500,mw,50,'#08121c');px(360-mw/2,496,mw,50,'#0f1c2e');px(360-mw/2+3,499,mw-6,44,'#27425c');textPixel(msg,360,522,17,'#fff3cf','center');
   if(t<300||t>end-250){const a=t<300?1-t/300:Math.max(0,(t-(end-250))/250);sg.save();sg.globalAlpha=a;px(0,0,720,600,'#172d3b');sg.restore()}
  },sounds);
 }finally{window.__evoFront=false;evoPhase=null;hideCinematic()}
}

let _wipe=null;function battleWipe(cover){return new Promise(res=>{if(!_wipe){const d=document.createElement('div');d.id='battleWipe';d.className='cinematic wipeBox';d.style.cssText='display:none;flex-direction:column;z-index:30';for(let i=0;i<10;i++){const b=document.createElement('i');b.style.cssText='flex:1 0 0;background:#000;margin-bottom:-1px;padding-bottom:1px;box-sizing:content-box;will-change:transform';d.append(b)}$('cinematic').parentNode.append(d);_wipe=d}const d=_wipe,bs=[...d.children];d.style.display='flex';bs.forEach((b,i)=>{b.style.transition='none';b.style.transformOrigin=cover?(i%2?'right':'left'):(i%2?'left':'right');b.style.transform=cover?'scaleX(0)':'scaleX(1)'});void d.offsetWidth;bs.forEach((b,i)=>{b.style.transition='transform 230ms cubic-bezier(.55,0,.35,1) '+(i*16)+'ms';b.style.transform=cover?'scaleX(1)':'scaleX(0)'});setTimeout(()=>{if(!cover)d.style.display='none';res()},230+9*16+20)})}
async function showCinematic(events){
    cinematicBusy=true;if(animationEnabled!==false){const _pre=new Map(),_real=new Map();for(const e of events){if(e.target&&typeof e.defBefore==='number'&&!_pre.has(e.target)){_pre.set(e.target,e.defBefore);_real.set(e.target,e.target.hp)}}try{for(const [u,h] of _pre)u.hp=h;await battleWipe(true)}catch(e){}finally{for(const [u,h] of _real)u.hp=h}}$('cinematic').hidden=false;battleWipe(false);await new Promise(r=>setTimeout(r,140));
    $('demoNormal').disabled=true;$('demoCrit').disabled=true;
    try{
        for(let ei=0;ei<events.length;ei++){
            const ev=events[ei];
            // Ataque y contraataque forman una sola escena: sin fundido entre ambos y sin pausa muerta.
            ev.seamIn=!!(ev.counter&&ei>0&&!events[ei-1].counter);ev._spk=[ev.attacker,ev.target].filter(q=>q&&q.shiny&&!q._spkDone);ev._spk.forEach(q=>q._spkDone=true);
            ev.seamOut=!!(events[ei+1]&&events[ei+1].counter&&!ev.counter);
            // Preparar imágenes con anticipación; el sprite de GBA se usa si ya se descargó.
            fetchSprite(ev.attacker.id);fetchSprite(ev.target.id);
            getBackSprite(ev.attacker.id);getBackSprite(ev.target.id);
            const isStat=ev.move.power===0;
            const duration0=(isStat?(fxMoveKey(ev.move)==='screech'?1800:2300):ev.critical?3500:2700)+((ev.hits||1)>1?170*(ev.hits-1):0)+(['bind','wrap'].includes(fxMoveKey(ev.move))?800:0)+(fxMoveKey(ev.move)==='metalclaw'?420:0);
            const duration=duration0-(ev.seamOut?420:0),t0=ev.seamIn?300:0;ev._dur=duration;
            const pv=ev.seamIn?events[ei-1]:null;ev.idleOff=pv?(pv._dur-(pv.critical?114:75))-t0:0;
            const fl={};let plan0=null;try{plan0=isStat?null:fxPlan(ev)}catch(e){}
            const melee=!plan0||!plan0.proj,impactAt=ev.critical?2220:1560;
            const sched=[];
            if(isStat){if(!ev.status||ev.miss||ev.noEffect){sched.push([620,'launch',ev.move.type])}else{sched.push([620,'launch',ev.move.type]);const fk=(FE_STATUS[ev.move.effect]||[0,'up'])[1];sched.push([(ev.target===ev.attacker?800:1100)+60,feStatusSound(fk)])}if(ev.miss)sched.push([1100,'miss'])}
            else{sched.push([melee?(ev.critical?1500:760):(ev.critical?1490:980)-140,melee?'launch':'launch',melee?'normal':ev.move.type]);
              if(ev.miss)sched.push([impactAt-100,'miss']);else{if(fxMoveKey(ev.move)==='metalclaw')sched.push([impactAt-250,'metalclaw']);sched.push(ev.move.effect==='trap'?[impactAt-60,'constrict']:[impactAt,'hit',{eff:ev.eff,crit:ev.critical}]);for(let hi=1;hi<(ev.hits||1);hi++){sched.push([impactAt+170*hi-80,'launch','normal']);sched.push([impactAt+170*hi,'hit',{eff:ev.eff,crit:false}])}if(ev.defAfter<=0)sched.push([impactAt+Math.max(650,170*(ev.hits||1)),'faint'])}}
            await new Promise(resolve=>{
                let start=null;
                function tick(now){
                    if(start===null)start=now;
                    let t=Math.min(duration,t0+(now-start)*animSpeed);
                    for(const sc of sched){if(!fl[sc[0]+sc[1]]&&t>=sc[0]){fl[sc[0]+sc[1]]=1;bsfx(sc[1],sc[2])}}
                    drawCinematicFrame(ev,t,duration);
                    if(t<duration)requestAnimationFrame(tick);else resolve();
                }
                requestAnimationFrame(tick);
            });
        }
    }finally{hideCinematic();$('demoNormal').disabled=false;$('demoCrit').disabled=false}
}
async function previewAnimation(critical){
    if(cinematicBusy||locked||!$('modal').hidden)return;
    const key=($('demoMove')&&$('demoMove').value)||'ember';
    const ch=unit(4,'player',1,8,15,[key]);
    const sq=unit(7,'enemy',9,1,13,['water']);
    const m=moveDB[key];
    let ev;
    if(m.power===0){ev={attacker:ch,target:m.shape==='self'?ch:sq,foe:sq,move:m,from:ch.hp,to:ch.hp,defBefore:sq.hp,defAfter:sq.hp,damage:0,critical:false,miss:false,status:true}}
    else{let nH=1;if(m.multi){const r=Math.random();nH=m.multi[0]===m.multi[1]?m.multi[0]:(r<.375?2:r<.75?3:r<.875?4:5)}
    let points=0;for(let h=0;h<nH;h++)points+=damage(ch,sq,m,false,critical&&h===0);points=Math.min(sq.hp-1,points);
    ev={attacker:ch,target:sq,move:m,from:ch.hp,to:ch.hp,defBefore:sq.hp,defAfter:sq.hp-points,damage:points,critical,miss:false,eff:effect(m.type,base[sq.id].types),hits:nH}}
    const oldLock=locked;locked=true;updateUI();
    try{await showCinematic([ev])}finally{locked=oldLock;updateUI()}
}
// Selector de efectos: todos los movimientos de daño del juego.
(()=>{
    const sel=$('demoMove');if(!sel)return;
    const keys=Object.keys(moveDB).filter(k=>moveDB[k].name&&!['tackleold','ragemove'].includes(k)).sort((x,y)=>moveDB[x].name.localeCompare(moveDB[y].name,'es'));
    sel.innerHTML=keys.map(k=>'<option value="'+k+'">'+moveDB[k].name+' · '+moveDB[k].type+(moveDB[k].power?'':' · estado')+'</option>').join('');
    sel.value='ember';
})();
$('demoNormal').onclick=()=>previewAnimation(false);
$('demoCrit').onclick=()=>previewAnimation(true);
const styleLabel=()=>battleStyle==='face'?'FRENTE A FRENTE':'CLÁSICA (ESPALDAS)';
function setBattleStyle(v){battleStyle=v;try{localStorage.setItem('pokemon-tactics-battle-style',v)}catch(e){}$('toggleBattleStyle').textContent='Escena: '+styleLabel();$('titleStyleToggle').textContent=styleLabel()}
$('toggleBattleStyle').onclick=()=>setBattleStyle(battleStyle==='face'?'classic':'face');
function setAnimSpeed(v){animSpeed=v;try{localStorage.setItem('pokemon-tactics-anim-speed',String(v))}catch(e){}$('toggleBattleSpeed').textContent='Velocidad de combate: '+speedLabel(v);{const cb=$('cinSpeed');if(cb)cb.textContent='⏩ x'+String(v).replace('.',',')}$('titleSpeedToggle').textContent='x'+speedLabel(v).slice(1).toUpperCase()}
{const cb=document.createElement('button');cb.type='button';cb.id='cinSpeed';cb.className='cinSpeed';cb.title='Cambiar la velocidad de las animaciones de combate';cb.onclick=e=>{e.stopPropagation();setAnimSpeed(nextAnimSpeed())};$('cinematic').append(cb)}
$('toggleBattleSpeed').onclick=()=>setAnimSpeed(nextAnimSpeed());
$('titleSpeedToggle').onclick=()=>setAnimSpeed(nextAnimSpeed());
setAnimSpeed(animSpeed);
$('titleStyleToggle').onclick=()=>setBattleStyle(battleStyle==='face'?'classic':'face');
setBattleStyle(battleStyle);
$('toggleMusic').onclick=()=>setMusic(!musicOn);$('titleMusicToggle').onclick=()=>setMusic(!musicOn);setMusic(musicOn);
$('toggleAnimations').onclick=()=>{animationEnabled=!animationEnabled;$('toggleAnimations').textContent='Animaciones: '+(animationEnabled?'ACTIVADAS':'DESACTIVADAS')};

