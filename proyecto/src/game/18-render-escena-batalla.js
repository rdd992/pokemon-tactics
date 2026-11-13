// Plataforma de hierba bajo cada Pokémon, como en los combates de GBA: ancla los sprites al suelo.
function drawBattleBase(cx,cy,rx,ry,critical){
    pixEllipse(cx,cy+ry*.55,rx+4,ry,critical?'#3d4a52':'#3f6c55');          // borde inferior oscuro
    pixEllipse(cx,cy,rx,ry,critical?'#7c8d93':'#6f9d6c');                   // césped
    pixEllipse(cx,cy-3,rx-12,Math.round(ry*.72),critical?'#8fa1a6':'#88b681'); // luz superior
    pixEllipse(cx,cy-5,rx-34,Math.round(ry*.4),critical?'#a2b3b6':'#a0cc96');
}
// El sprite trasero de GBA es de medio cuerpo (borde inferior plano): se apoya justo detrás del cuadro de texto, que empieza en y=478.
const ENEMY_GROUND=372,PLAYER_GROUND=476;
function drawStage(t,critical){
    const h=sg.createLinearGradient(0,0,0,600);h.addColorStop(0,critical?'#513954':'#92c3c9');h.addColorStop(.64,critical?'#ba8185':'#d7debd');h.addColorStop(1,'#5a8f75');
    px(0,0,720,600,h);
    // Fondo de bosque en varias capas, con píxeles grandes y sin antialias.
    for(let i=0;i<14;i++){
        const x=i*59-25,y=249+(i%4)*12;
        px(x+13,y-85,12,130,critical?'#61566b':'#698e87');
        polygon([[x-29,y+7],[x+21,y-102],[x+66,y+7]],critical?'#52617a':'#628e88');
        polygon([[x-22,y-27],[x+20,y-119],[x+60,y-27]],critical?'#607186':'#779f8a');
    }
    px(0,349,720,251,critical?'#667781':'#83ad8d');
    px(0,358,720,10,critical?'#a29aa0':'#a0c499');
    for(let i=0;i<45;i++){
        let x=(i*97+33)%720,y=382+(i*61)%197;
        px(x,y,10+(i%3)*4,3,i%2?'#769d80':'#a2c5a0');
    }
    drawBattleBase(537,ENEMY_GROUND+2,104,20,critical);
    drawBattleBase(179,PLAYER_GROUND+3,134,28,critical);
    if(critical){
        // atmósfera crítica teñida con bandas cinéticas.
        sg.save();sg.globalAlpha=.17+Math.sin(t/85)*.09;
        for(let i=0;i<12;i++){const yy=(i*67+t*.36)%600;polygon([[0,yy],[720,yy-88],[720,yy-75],[0,yy+13]],'#fff2c7')}
        sg.restore();
    }
    px(0,0,720,12,'#142836');px(0,588,720,12,'#142836');
}
function drawFallbackCreature(id,x,y,scale,isLeft){
    const t={4:['#e88155','#f9ca88'],7:['#74b3dc','#caeef3'],25:['#edd17c','#a57b55'],1:['#80b98b','#b7dca2'],16:['#c8aa7f','#e9d8ac'],74:['#aca599','#d9d1bf']}[id]||['#a9a0bd','#f5e9c9'];
    sg.save();sg.translate(x,y);sg.scale(isLeft?scale:-scale,scale);
    const blocks=[[-31,-30,62,60,t[0]],[-24,-43,48,20,t[0]],[-20,-19,40,25,t[1]],[-29,22,19,20,t[0]],[12,22,19,20,t[0]],[-21,-56,12,23,t[0]],[9,-56,12,23,t[0]],[-22,-9,9,9,'#28364a'],[13,-9,9,9,'#28364a']];
    for(let [bx,by,bw,bh,color] of blocks){px(bx-3,by-3,bw+6,bh+6,'#344c55');px(bx,by,bw,bh,color)}
    if(id===4){px(-52,4,20,16,'#db654a');px(-58,-3,18,11,'#ffda65')}
    if(id===25){px(-46,-53,22,18,'#3a424e');px(23,-53,22,18,'#3a424e')}
    if(id===7){px(-44,-22,19,47,'#cfb57c');px(-48,-12,13,24,'#88b3a7')}
    sg.restore();
}
// El recorte por transparencia evita que los píxeles vacíos del PNG separen los pies de la sombra.
const combatBoundsCache=new WeakMap();
function combatSpriteBounds(img){
    if(combatBoundsCache.has(img))return combatBoundsCache.get(img);
    const w=img.naturalWidth||img.width||32,h=img.naturalHeight||img.height||32;
    let bb={sx:0,sy:0,sw:w,sh:h};
    try{
        const cv=document.createElement('canvas');cv.width=w;cv.height=h;
        const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);
        const data=cx.getImageData(0,0,w,h).data;
        let minX=w,minY=h,maxX=-1,maxY=-1;
        for(let y=0;y<h;y++)for(let x=0;x<w;x++){
            if(data[(y*w+x)*4+3]>24){
                if(x<minX)minX=x;if(x>maxX)maxX=x;
                if(y<minY)minY=y;if(y>maxY)maxY=y;
            }
        }
        if(maxX>=minX&&maxY>=minY)bb={sx:minX,sy:minY,sw:maxX-minX+1,sh:maxY-minY+1};
    }catch(e){/* Imágenes sin lectura de píxeles: mostrar igualmente el sprite. */}
    combatBoundsCache.set(img,bb);return bb;
}
function drawCreature(u,isLeft,t,mode,critical,moveKind){
    const id=u.id,baseX=isLeft?179:537,groundY=isLeft?PLAYER_GROUND:ENEMY_GROUND;
    const facing=isLeft?1:-1;
    let move=0,recoil=0,zoom=1,vertical=0;
    if(mode==='attack'){
        const start=760,peak=1080,end=1500;
        if(t>start&&t<peak){
            const k=(t-start)/(peak-start);
            move=facing*(18+34*k);
            // Sólo el ataque tiene salto: parado o seleccionado no levita.
            vertical=-Math.sin(k*Math.PI)*8;
        }else if(t>=peak&&t<end){
            const k=(t-peak)/(end-peak);
            move=facing*(52*(1-k));
        }
        if(critical)zoom=1.06+.05*Math.sin(t/46);
    }else if(mode==='hit'){
        const hitAt=critical?2220:1560,len=critical?250:170;
        if(t>hitAt&&t<hitAt+len){
            const k=(t-hitAt)/len;
            recoil=-facing*Math.sin(k*Math.PI)*21;
            zoom=1-.04*Math.sin(k*Math.PI);
        }
    }
    const sprite=isLeft?getBackSprite(id):fetchSprite(id);
    const lowRes=!sprite||!sprite.ready||sprite.source==='local';
    const visibleHeight=isLeft?(lowRes?108:134):(lowRes?98:116);
    const bb=sprite&&sprite.ready?combatSpriteBounds(sprite.img):null;
    const ratio=bb?bb.sw/Math.max(1,bb.sh):.85;
    const width=Math.max(32,Math.min(166,visibleHeight*ratio));
    sg.save();sg.translate(Math.round(baseX+move+recoil),Math.round(groundY));
    // Sombra pegada al suelo: sigue el desplazamiento horizontal, pero no el salto del ataque.
    const shadowW=Math.max(28,Math.min(66,Math.round(width*.46/4)*4)),lift=Math.min(1,Math.abs(vertical)/8);
    sg.globalAlpha=.55-.2*lift;pixEllipse(0,0,shadowW-Math.round(lift*8/4)*4,8,critical?'#2a3138':'#2c5440');sg.globalAlpha=1;
    sg.translate(0,Math.round(vertical));sg.scale(zoom,zoom);
    if(sprite&&sprite.ready){
        sg.imageSmoothingEnabled=false;
        if(!isLeft&&sprite.source==='local'){
            sg.scale(-1,1); // el fallback local enemigo mira hacia el jugador
        }
        sg.drawImage(sprite.img,bb.sx,bb.sy,bb.sw,bb.sh,
            Math.round(-width/2),Math.round(-visibleHeight+1),Math.round(width),visibleHeight);
    }else drawFallbackCreature(id,0,-55,.8,!isLeft);
    sg.restore();
}
function drawHud(u,where,hp){
    const left=where==='left',x=left?29:423,y=left?29:49,w=270;
    px(x+4,y+6,w,89,'#192635');px(x,y,w,89,'#fff0cc');px(x+5,y+5,w-10,79,'#28485b');
    textPixel(base[u.id].name.toUpperCase(),x+15,y+21,17,'#ffe1a0');textPixel('NV '+u.level,x+w-15,y+21,13,'#ddf4e0','right');
    px(x+13,y+48,w-26,14,'#142e3b');px(x+16,y+51,(w-32)*Math.max(0,hp/u.maxHp),8,hp/u.maxHp<.3?'#f09d77':'#84d9a1');
    textPixel('PS '+Math.round(hp)+' / '+u.maxHp,x+w-17,y+73,12,'#f6ead3','right');
}
/* ===== v0.39 — Sprites de ataques en pixel art (diseño original, bitmaps de 1 px escalados) ===== */
const FX={
 flame:{pal:{r:'#d8402a',o:'#f39a3c',y:'#ffe36a',w:'#fff7d0'},rows:["...r...","..ror..","..ooor.",".rooyor",".royyor",".ryywyr","..ryyr.","...rr.."]},
 bubble:{pal:{b:'#2f78b0',c:'#8fdcf5',w:'#ffffff'},rows:["..bbb..",".bwwcb.","bwc..cb","bc...cb","bc...cb",".bccbb.","..bbb.."]},
 drop:{pal:{b:'#2f78b0',c:'#79cdef',w:'#ffffff'},rows:["..b..",".bcb.",".bcb.","bcwcb","bcccb","bcccb",".bbb."]},
 leaf:{pal:{g:'#2f7a3d',G:'#6fc462',d:'#b4ec96'},rows:["...gg..","..gGGg.",".gGdGGg","gGGdGg.",".gggg.."]},
 rock:{pal:{k:'#3f4651',g:'#b5bbc3',b:'#7d848e'},rows:["..kkk.",".kggbk","kgggbk","kggbbk",".kbbk.","..kk.."]},
 star:{pal:{y:'#ffd45c',w:'#ffffff'},rows:["...w...","...y...","..ywy..","wywwwyw","..ywy..","...y...","...w..."]},
 puff:{pal:{p:'#6b4a8c',P:'#b58ad6'},rows:["..ppp..",".pPPPp.","pPPPPPp",".pPPPp.","..ppp.."]},
 spark:{pal:{y:'#ffe36a',w:'#ffffff'},rows:["..w..",".wyw.","wywyw",".wyw.","..w.."]}
};
const FX_TYPE={fire:['#f39a3c','#ffe36a'],water:['#79cdef','#ffffff'],electric:['#ffe36a','#ffffff'],grass:['#6fc462','#b4ec96'],
 rock:['#b5bbc3','#7d848e'],ground:['#d4b36f','#a98d52'],poison:['#b58ad6','#6b4a8c'],bug:['#a8d44e','#e8f5a0'],flying:['#dce8f5','#ffffff'],
 normal:['#ffffff','#ffd45c'],fighting:['#f0b04c','#ffffff'],dark:['#8e7aa8','#ffffff'],steel:['#cfd6de','#ffffff'],ghost:['#a98ad6','#ffffff'],psychic:['#f06ab0','#ffd0ec']};
function blit(name,cx,cy,s,flipX,flipY,pal){
 const f=FX[name],rows=f.rows,h=rows.length,w=rows[0].length,colors=pal||f.pal;
 const ox=Math.round(cx-w*s/2),oy=Math.round(cy-h*s/2);
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const ch=rows[flipY?h-1-j:j][flipX?w-1-i:i];if(ch==='.')continue;
  const c=colors[ch];if(c)px(ox+i*s,oy+j*s,s,s,c);
 }
}
function fxSq(x,y,s,c){sg.fillStyle=c;sg.fillRect(Math.round(x-s/2),Math.round(y-s/2),s,s)}
function fxLine(x0,y0,x1,y1,thick,color,grid=2){
 const dx=x1-x0,dy=y1-y0,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/grid));
 for(let i=0;i<=n;i++)fxSq(Math.round((x0+dx*i/n)/grid)*grid,Math.round((y0+dy*i/n)/grid)*grid,thick,color);
}
function fxRing(cx,cy,r,thick,color){const n=Math.max(12,Math.round(r*.9));for(let i=0;i<n;i++){const a=i/n*Math.PI*2;fxSq(cx+Math.cos(a)*r,cy+Math.sin(a)*r,thick,color)}}
function fxBolt(x0,y0,x1,y1,t,thick,jag,seed){
 const segs=9,pts=[[x0,y0]],len=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/len,ny=(x1-x0)/len,frame=Math.floor(t/55);
 for(let i=1;i<segs;i++){const f=i/segs,off=((nh(i,frame,seed)%100)/100-.5)*2*jag;pts.push([x0+(x1-x0)*f+nx*off,y0+(y1-y0)*f+ny*off])}
 pts.push([x1,y1]);
 for(const [col,th] of [['#9a7418',thick+4],['#ffe36a',thick],['#ffffff',Math.max(2,thick-4)]])
  for(let i=0;i<pts.length-1;i++)fxLine(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],th,col);
}
function fxTeeth(cx,baseY,tipY,count,gap,color){
 const dir=tipY>baseY?1:-1;
 for(let i=0;i<count;i++){
  const x=cx+(i-(count-1)/2)*gap;
  for(let r=0;r<18;r+=2){const w=Math.max(2,Math.round(14*(1-r/18)));px(x-w/2,dir>0?baseY+r:baseY-r-2,w,2,color)}
 }
}
const fxKeyCache=new WeakMap();
function fxMoveKey(m){if(fxKeyCache.has(m))return fxKeyCache.get(m);const k=Object.keys(moveDB).find(key=>moveDB[key]===m)||'';fxKeyCache.set(m,k);return k}
const FX_PROJECTILE={leechlife:'leech',twineedle:'needle2',pinmissile:'needle2',confusion:'psy',psybeam:'psybeam',ember:'ember',flame:'flamethrower',dragonrage:'dragonflame',bubble:'bubbles',water:'watergun',shock:'shock',bolt:'bolt',razor:'razorleaf',vine:'vine',
 rock:'rockthrow',rocktomb:'rocktomb',gust:'gust',poisonsting:'needle',smog:'smog',stringshot:'thread',swift:'stars',quick:'streak',seed:'seeds'};
const FX_MELEE={scratch:'claw',slash:'slash',metalclaw:'steelclaw',karate:'chop',lowkick:'kick',bite:'fang',bugbite:'fangGreen',wing:'wing',peck:'beak',tackle:'ram',pound:'fist',doubleslap:'slap',astonish:'boo',bind:'coil',wrap:'coil',furyattack:'beak',pursuit:'ram',rage:'fist',dragonclaw:'claw'};
function fxPlan(ev){
 const m=ev.move,key=fxMoveKey(m),type=m.type;
 let proj=FX_PROJECTILE[key]||null;const hit=FX_MELEE[key]||'punch';
 if(!proj&&m.shape!=='melee')proj={fire:'ember',water:'bubbles',electric:'shock',grass:'razorleaf',rock:'rockthrow',ground:'rockthrow',flying:'gust',poison:'needle',bug:'thread'}[type]||'streak';
 const nh0=ev.hits||1;
 if(key==='bind'||key==='wrap')return {key,type,proj:null,hit:'coil',still:true,hits:nh0};
 if(key==='scratch')return {key,type,proj:null,hit,hop:true,hits:nh0};
 if(key==='metalclaw')return {key,type,proj,hit,hits:nh0,hold:420}; // v651: se queda junto al rival mientras da los dos zarpazos y luego vuelve
 if(key==='quick')return {key,type,proj:null,hit:'dash',dash:true};
 return {key,type,proj,hit,hits:nh0};
}
function fxDrawProjectile(plan,t,crit,sx,sy,ex,ey,f){
 const big=crit?1.5:1,dir=ex>=sx?1:-1,L=Math.hypot(ex-sx,ey-sy)||1,vx=(ex-sx)/L,vy=(ey-sy)/L;
 const hx=sx+(ex-sx)*f,hy=sy+(ey-sy)*f,at=(g,off=0)=>[sx+(ex-sx)*g,sy+(ey-sy)*g+off];
 sg.save();sg.globalAlpha=f>1?Math.max(0,1-(f-1)/.45):1;
 switch(plan.proj){
  case 'ember':{const [bx,by]=at(f,Math.sin(t/70)*3);blit('flame',bx,by,crit?18:10,Math.floor(t/90)%2===0,false);break}
  case 'dragonflame':{const dp={r:'#4a1f8c',o:'#8a4fe0',y:'#c99bff',w:'#f3e6ff'};for(let i=0;i<12;i++){const g=f*(i+1)/12,[bx,by]=at(g,Math.sin(t/60+i)*(6+i*.7));blit('flame',bx,by,Math.max(3,Math.round((2.5+i*.32)*big)),(i+Math.floor(t/70))%2===0,false,dp)}break}
  case 'flamethrower':for(let i=0;i<12;i++){const g=f*(i+1)/12,[bx,by]=at(g,Math.sin(t/60+i)*(6+i*.7));blit('flame',bx,by,Math.max(3,Math.round((2.5+i*.32)*big)),(i+Math.floor(t/70))%2===0,false)}break;
  case 'bubbles':for(let i=0;i<6;i++){const g=f-i*.08;if(g<0)continue;const [bx,by]=at(g,Math.sin(t/110+i*1.7)*14);blit('bubble',bx,by,Math.round((i%2?3:4)*big),false,false)}break;
  case 'watergun':for(let i=0;i<11;i++){const g=f-i*.04;if(g<0)continue;const [bx,by]=at(g,Math.sin(t/70+i)*3);blit('drop',bx,by,Math.round(4*big),false,false)}break;
  case 'shock':case 'bolt':{
   if(plan.proj==='shock'||plan.proj==='bolt'){const hv=plan.proj==='bolt';for(const [dx,s0,jg] of (hv?[[0,.08,22],[-60,.22,18],[62,.34,18],[-26,.5,20],[34,.62,20],[-84,.74,16],[88,.84,16]]:[[0,.1,18],[-54,.3,14],[56,.48,14],[-24,.66,16],[30,.82,16]])){if(f<s0||f>s0+.4)continue;const x1=ex+dx*.35,y1=ey+6;fxBolt(ex+dx,-14,x1,y1,t+s0*900,Math.round((hv?8:5)*big*.85),jg,Math.round(s0*20));blit('spark',x1,y1,Math.round(3*big),Math.floor(t/60)%2===0,false)}break}
   const heavy=plan.proj==='bolt',th=Math.round((heavy?8:5)*big*.85);
   fxBolt(sx,sy,hx,hy,t,th,heavy?26:16,3);if(heavy)fxBolt(sx,sy-8,hx,hy+8,t+30,Math.max(3,th-3),30,11);
   blit('spark',hx,hy,Math.round(4*big),false,false);blit('spark',sx,sy,3,false,false);break}
  case 'razorleaf':for(let i=0;i<5;i++){const g=f-i*.1;if(g<0)continue;const [bx,by]=at(g,Math.sin(i*2.3)*16+Math.sin(t/80+i)*5);blit('leaf',bx,by,Math.round(3*big),(Math.floor(t/60)+i)%2===0,(Math.floor(t/90)+i)%3===0)}break;
  case 'vine':{
   const ff=Math.min(1,f),reach=Math.min(1,ff*1.3),n=Math.max(14,Math.ceil(Math.hypot(hx-sx,hy-sy)/2.4));
      for(const [sg,amp0,rs,a0] of [[1,110,1,1.95],[1,80,.86,1.65]]){
    const hF=Math.max(f,.01),hxF=sx+(hx-sx)/hF,hyF=sy+(hy-sy)/hF,ffx=Math.max(0,Math.min(1,(ff-.2-(rs<1?.07:0))/.8)),p=Math.pow(ffx,1.5),fi=Math.atan2(hyF-sy,hxF-sx),an=(fi-dir*a0)+(dir*a0)*p,Lx=Math.hypot(hxF-sx,hyF-sy)*(.88+.12*p),cs=Math.cos(an),sn=Math.sin(an),bend=amp0*Math.pow(1-ffx,.85);
    const pt=u=>{const wv=Math.sin(u*6-ffx*10-(rs<1?.9:0))*Math.pow(u,1.15)*(16*(1-ffx)+3),lag=bend*Math.sin(u*Math.PI*.62+.2)*Math.pow(u,1.1),sH=Math.max(0,Math.min(1,(ffx-.84)/.14)),fl=u>.7?Math.pow((u-.7)/.3,2.2)*(-100*sH):0,o=dir*fl+dir*sH*.2*Lx*Math.sin(Math.PI*Math.min(1,u*1.05));return [sx+cs*Lx*u-sn*o,sy+sn*Lx*u+cs*o]};
    for(const [pad,col] of [[3,'#23240b'],[0,'#5a5f22']])for(let k=0;k<=n;k++){const u=k/n,[bx,by]=pt(u),sz=Math.round(6-2.2*u)+pad;fxSq(bx,by,sz,col)}
    const [tx,ty]=pt(1),[qx,qy]=pt(.93),dl=Math.hypot(tx-qx,ty-qy)||1,ux=(tx-qx)/dl,uy=(ty-qy)/dl;for(const [pad,col] of [[4,'#2a2010'],[0,'#8b6a2b']])for(let q=0;q<5;q++){const d=q*3.2;fxSq(tx-ux*d,ty-uy*d,[9,13,15,13,9][q]+pad,col)}fxSq(tx-ux*6-2,ty-uy*6-3,4,'#c2a45a')}
   if(ff>.8){const k2=Math.min(1,(ff-.8)/.2);fxRing(hx,hy,12+k2*30,5,'#e8f0b0')}
   break}
  case 'rockthrow':{
   const arc=g=>-Math.sin(Math.min(1,g)*Math.PI)*70,[bx,by]=at(f,arc(f));
   for(let i=1;i<4;i++){const g=Math.max(0,f-i*.06),[dx,dy]=at(g,arc(g));fxSq(dx,dy,Math.max(2,8-i*2),'#d8cdb0')}
   blit('rock',bx,by,Math.round(4*big),Math.floor(t/90)%2===0,false);break}
  case 'rocktomb':{const sizes=[15,19,14],dx=[-52,0,54],ty=ey-22;
   for(let i=0;i<3;i++){const fall=Math.max(0,Math.min(1,f*1.25-i*.14));if(fall<=0)continue;const land=fall>=1,sz=Math.round(sizes[i]*big),yy=land?ty+(i===1?0:6)-Math.max(0,Math.sin(Math.max(0,(f-.8-i*.1)*10))*8):ty-420*(1-fall*fall);
    blit('rock',ex+dx[i],yy,sz,i%2===0,false);
    if(!land)for(let q=1;q<4;q++)fxLine(ex+dx[i]+(q-2)*12,yy-sz*3-q*14,ex+dx[i]+(q-2)*12,yy-sz*3-q*14-34,4,'#cfd5dc')}
   if(f>.62){const k2=Math.min(1,(f-.62)*2.4);for(let i=0;i<10;i++){const a=Math.PI+i/9*Math.PI;fxSq(ex+Math.cos(a)*k2*130,ty+70-Math.abs(Math.sin(a))*k2*40+(i%2)*8,10+k2*8,'#d8cdb0')}fxRing(ex,ty+80,20+k2*120,6,'#e8dcc0')}
   break}
  case 'gust':{
   const [tx,ty]=at(f,0),cols=['#ffffff','#dff2fa','#b4dbea','#8cc3dc'];
   const grow=Math.min(1,.55+f*1.2),sc=1.5*big;
   for(let k=0;k<14;k++){
    const hw=(6+k*3.6)*grow*sc,yy=ty+48-k*11*grow*sc,off=Math.sin(t/65+k*.75)*hw*.22;
    sg.fillStyle='#4f8fb0';sg.fillRect(Math.round(tx+off-hw),Math.round(yy+4*sc),Math.round(hw*2),Math.round(7*sc));
    sg.fillStyle=cols[k%4];sg.fillRect(Math.round(tx+off-hw),Math.round(yy),Math.round(hw*2),Math.round(8*sc));
    sg.fillStyle='#ffffff';sg.fillRect(Math.round(tx+off-hw*.6),Math.round(yy+1),Math.round(hw*.5),3);
    if(k%2===1){const a=t/50+k*1.9;fxSq(tx+off+Math.cos(a)*(hw+12),yy+Math.sin(a)*8,6,'#ffffff');fxSq(tx+off-Math.cos(a)*(hw+6),yy-Math.sin(a)*6,4,'#d8f0e0')}
   }
   for(let i=0;i<5;i++){const g=f-i*.05;if(g<0)continue;const [dx,dy]=at(g,0);fxSq(dx+Math.sin(t/40+i)*10,dy+48,Math.max(4,12-i*2),'#d8e8ee')}
   break}
  case 'needle2':for(let i=0;i<(plan.hits>1?2:5);i++){const g=f-i*.07;if(g<0)continue;const [bx,by]=at(g,(i-2)*9);fxLine(bx-vx*30,by-vy*30,bx,by,5,'#8fb83a');fxLine(bx-vx*30,by-vy*30,bx,by,2,'#ffffff');fxSq(bx,by,8,'#ffe36a')}break;
  case 'psy':for(let i=0;i<4;i++){const g=f-i*.08;if(g<0)continue;const [bx,by]=at(g,0);sg.strokeStyle=i%2?'#ffd0ec':'#f06ab0';sg.lineWidth=6;sg.beginPath();sg.arc(bx,by,14+(3-i)*8+Math.sin(t/60)*3,0,7);sg.stroke()}
   for(let i=0;i<6;i++){const g=f-i*.03,a=t/60+i,[bx,by]=at(Math.max(0,g),0);fxSq(bx+Math.cos(a)*30,by+Math.sin(a)*30,6,'#ffffff')}break;
  case 'psybeam':{const cols=['#ff6a6a','#ffd04a','#6aff9a','#6ab8ff','#d06aff'];for(let i=0;i<5;i++)fxLine(sx+vx*30,sy+vy*30+(i-2)*9+Math.sin(t/50+i)*3,hx,hy+(i-2)*9+Math.sin(t/50+i)*3,7,cols[i]);fxSq(hx,hy,18,'#ffffff');break}
  case 'leech':for(let i=0;i<3;i++){const g=f-i*.1;if(g<0)continue;const [bx,by]=at(g,(i-1)*10);fxLine(bx-vx*28,by-vy*28,bx,by,5,'#e8b82a');fxLine(bx-vx*28,by-vy*28,bx,by,2,'#fff6a0');fxSq(bx,by,7,'#ffffff')}break;
  case 'needle':for(let i=0;i<3;i++){const g=f-i*.1;if(g<0)continue;const [bx,by]=at(g,(i-1)*10);fxLine(bx-vx*24,by-vy*24,bx,by,4,'#b58ad6');fxSq(bx,by,6,'#ffffff')}break;
  case 'smog':for(let i=0;i<5;i++){const g=f-i*.1;if(g<0)continue;const [bx,by]=at(g,Math.sin(t/80+i)*9);blit('puff',bx,by,Math.round((3+i*.4)*big),false,false)}break;
  case 'thread':{
   const n=Math.max(2,Math.ceil(Math.hypot(hx-sx,hy-sy)/8));
   for(let k=0;k<=n;k++){const [bx,by]=at(k/n*f,Math.sin(k*.9+t/60)*5);fxSq(bx,by,5,k%2?'#ffffff':'#d9e2e8')}
   fxSq(hx,hy,8,'#e8eef2');break}
  case 'stars':for(let i=0;i<6;i++){const g=f-i*.07;if(g<0)continue;const [bx,by]=at(g,(i-2.5)*13);blit('star',bx,by,Math.round(3*big),(Math.floor(t/70)+i)%2===0,false)}break;
  case 'streak':for(let i=0;i<6;i++){const g=f-i*.05;if(g<0)continue;const [bx,by]=at(g,(i-2.5)*6);fxLine(bx-vx*46,by-vy*46,bx,by,4,i%2?'#ffffff':'#d7e8f5')}break;
  case 'seeds':for(let i=0;i<3;i++){const g=f-i*.12;if(g<0)continue;const [bx,by]=at(g,Math.sin(t/70+i*2)*9);fxSq(bx,by,9,'#2f7a3d');fxSq(bx,by,5,'#b4ec96')}break;
 }
 sg.restore();
}
function fePress(d){const fadeOut=d>1100?Math.max(0,(1360-d)/260):1;return Math.min(1,d/180)*(.5-.5*Math.cos(d/165))*fadeOut}
function feCoilHalf(ex,ey,delta,half){
 if(delta<0||delta>1360)return;
 const pr=fePress(delta),fadeA=delta>1110?Math.max(0,(1360-delta)/250):Math.min(1,delta/90);
 sg.save();sg.globalAlpha=fadeA;sg.lineCap='round';
 for(let i=0;i<3;i++){const sp=46-8*pr,cy=ey-8+(i-1)*sp,w=(80-30*pr)*(1-.06*Math.abs(i-1)),rot=(i-1)*.05,ry=12;
  const a0=half==='front'?0:Math.PI,a1=half==='front'?Math.PI:Math.PI*2;
  sg.strokeStyle='#2f7a34';sg.lineWidth=13;sg.beginPath();sg.ellipse(ex,cy,w,ry,rot,a0,a1);sg.stroke();
  sg.strokeStyle=half==='front'?'#9fe36c':'#6cb84a';sg.lineWidth=7;sg.beginPath();sg.ellipse(ex,cy,w,ry,rot,a0,a1);sg.stroke();
  if(half==='front'){sg.strokeStyle='#e4ffc8';sg.lineWidth=3;sg.beginPath();sg.ellipse(ex,cy-2,w-6,ry-2,rot,Math.PI*.15,Math.PI*.85);sg.stroke()}}
 sg.restore();
}
// Mano de karateka (canto hacia abajo) para Golpe Karate; e = avance de la caída (0–1)
function feChopHand(ex,ey,e,fade){feChopHandAt(ex,ey,e,fade,ex<360?-1:1)}
// Mano de "golpe de karate" estilo Pokémon: silueta negra con borde blanco, en posición horizontal (dedos hacia un lado), cae desde arriba con el canto hacia abajo.
function feChopHandAt(ex,ey,e,fade,mv){
 // Mano de "golpe karate" (Blanco/Negro): silueta negra con borde blanco, dedos hacia el atacante; cae en arco rápido sobre la cabeza del rival con un destello rojo.
 const R=150,th=0,dir=mv>0?1:-1,fcy=ey-44,fall=1-e;
 const cx=ex,cy=fcy-200*fall;
 sg.save();sg.globalAlpha=fade;
 if(e<1){const gr=sg.createRadialGradient(cx,cy,4,cx,cy,70);gr.addColorStop(0,'rgba(255,90,40,.75)');gr.addColorStop(1,'rgba(255,60,20,0)');sg.fillStyle=gr;sg.beginPath();sg.arc(cx,cy,70,0,7);sg.fill();
  sg.strokeStyle='#ffffff';sg.lineCap='round';for(let i=0;i<4;i++){sg.globalAlpha=fade*(.7-i*.12);sg.lineWidth=3;sg.beginPath();sg.moveTo(cx-30+i*20,cy-28);sg.lineTo(cx-30+i*20,cy-28-(40+i*16)*(.4+fall));sg.stroke()}sg.globalAlpha=fade}
 sg.translate(cx,cy);sg.rotate(-mv*th*.7);sg.scale(-dir*.9,.9);
 const hand=()=>{const rr=(x,y,w,h,r)=>{sg.beginPath();sg.roundRect(x,y,w,h,r);sg.fill()};rr(2,-13,36,33,11);rr(-42,-12,50,8,4);rr(-47,-3,55,8,4);rr(-42,6,50,8,4);rr(-35,15,43,7,3.5);rr(-16,-24,38,9,4.5)};
 sg.fillStyle='#ffffff';sg.shadowColor='#ffffff';sg.shadowBlur=10;sg.save();sg.scale(1.14,1.22);hand();sg.restore();sg.shadowBlur=0;
 sg.fillStyle='#0b0b12';hand();sg.strokeStyle='rgba(255,255,255,.85)';sg.lineWidth=1.6;for(const yy of [-3.8,5.2,14.2]){sg.beginPath();sg.moveTo(-40,yy);sg.lineTo(6,yy);sg.stroke()}
 sg.restore();
}

// v651: una marca de garra: media luna afilada a lo largo de una curva cuadrática, revelada de inicio a fin (pr 0→1).
function fxClawMark(x0,y0,x1,y1,bend,W,pr){const mx=(x0+x1)/2,my=(y0+y1)/2,L=Math.hypot(x1-x0,y1-y0)||1;fxClawMarkQ(x0,y0,mx-(y1-y0)/L*bend,my+(x1-x0)/L*bend,x1,y1,W,pr)}
// v651: marca de garra fina y afilada a lo largo de una curva cuadrática (P0→Q→P1), revelada desde P0 (pr 0→1).
function fxClawMarkQ(x0,y0,qx,qy,x1,y1,W,pr,g=sg,pal=CLAW_RED){
 const pt=t=>{const u=1-t;return [u*u*x0+2*u*t*qx+t*t*x1,u*u*y0+2*u*t*qy+t*t*y1]};
 const tg=t=>{const u=1-t;const a=2*u*(qx-x0)+2*t*(x1-qx),b=2*u*(qy-y0)+2*t*(y1-qy),h=Math.hypot(a,b)||1;return [-b/h,a/h]};
 const N=24,end=Math.max(.02,pr);
 // perfil: punta muy fina arriba, lo más ancho algo pasado el centro, y vuelve a afinarse en la punta final
 const prof=t=>Math.pow(Math.sin(Math.PI*Math.pow(t,1.25)),.9);
 const shape=(scale)=>{const A=[],B=[];for(let j=0;j<=N;j++){const t=end*j/N,[x,y]=pt(t),[ox,oy]=tg(t),w=W*scale*prof(t)*(pr<1?Math.min(1,(end-t)/.16+.3):1);A.push([x+ox*w,y+oy*w]);B.push([x-ox*w,y-oy*w])}
  g.beginPath();g.moveTo(A[0][0],A[0][1]);for(const q of A)g.lineTo(q[0],q[1]);for(let j=B.length-1;j>=0;j--)g.lineTo(B[j][0],B[j][1]);g.closePath();g.fill()};
 g.save();
 g.fillStyle=pal[0];shape(1.6);   // borde oscuro
 g.fillStyle=pal[1];shape(1.05);  // herida roja
 g.fillStyle=pal[2];shape(.42);   // filo blanco
 if(pr<1){const [hx,hy]=pt(end),z=Math.max(4,W*1.4);g.fillStyle='#ffffff';g.fillRect(Math.round(hx-z/2),Math.round(hy-z/2),z,z)} // chispa en la punta mientras corta
 g.restore();
}

// v651: pixelado del zarpazo: se dibuja a 1/P de resolución en un lienzo aparte, se recorta el alfa (bordes duros) y se amplía sin suavizado.
const CLAW_PX=2,CLAW_R=330;
const CLAW_RED=['#3a0c0c','#d23b31','#ffffff'],CLAW_STEEL=['#1e2632','#8f9db2','#f4f8ff']; // Arañazo · Garra Metal
const hexRGB=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
// forma de referencia del zarpazo (tres cortes curvos), compartida por Arañazo y Garra Metal
const CLAW_SHAPE=[[535,130,510,388,165,735,1],[720,115,650,462,160,840,1.15],[818,275,731,561,280,843,1]];
function fxClawSet(ex,ey,p0,sc,mir,W,G,pal){for(let i=0;i<3;i++){const pr=Math.min(1,Math.max(0,(p0-i*.1)/.72));if(pr<=0)continue;
  const c0=CLAW_SHAPE[i],mx=(c0[0]+c0[4])/2,my=(c0[1]+c0[5])/2,GX=490,GY=480,JN=.72,LN=.82; // JN: juntar las marcas · LN: acortarlas
  const tr=(x,y)=>[GX+(mx-GX)*JN+(x-mx)*LN,GY+(my-GY)*JN+(y-my)*LN],c=[...tr(c0[0],c0[1]),...tr(c0[2],c0[3]),...tr(c0[4],c0[5]),c0[6]];
  const X=v=>ex+mir*((v-490)*sc+12),Y=v=>ey-14+(v-480)*sc;
  fxClawMarkQ(X(c[0]),Y(c[1]),X(c[2]),Y(c[3]),X(c[4]),Y(c[5]),W*c[6],pr,G,pal)}}let clawCv=null;
function fxClawPixel(ex,ey,drawFn,pal=CLAW_RED){
 const PAL=pal.map(hexRGB);
 const P=CLAW_PX,R=CLAW_R,n=Math.ceil(R/P);
 if(!clawCv){clawCv=document.createElement('canvas');clawCv.width=clawCv.height=n}
 const g=clawCv.getContext('2d',{willReadFrequently:true});
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,n,n);
 g.setTransform(1/P,0,0,1/P,-(ex-R/2)/P,-(ey-R/2)/P);
 drawFn(g);
 const im=g.getImageData(0,0,n,n),d=im.data;for(let q=0;q<d.length;q+=4){if(d[q+3]<110){d[q+3]=0;continue}const al=d[q+3]/255;let best=0,bd=1e9;for(let c=0;c<3;c++){const C=PAL[c],dr=d[q]/al-C[0],dg=d[q+1]/al-C[1],db=d[q+2]/al-C[2],dd=dr*dr+dg*dg+db*db;if(dd<bd){bd=dd;best=c}}const C=PAL[best];d[q]=C[0];d[q+1]=C[1];d[q+2]=C[2];d[q+3]=255} /* bordes duros y paleta de 3 colores */ g.setTransform(1,0,0,1,0,0);g.putImageData(im,0,0);
 const sm=sg.imageSmoothingEnabled;sg.imageSmoothingEnabled=false;sg.drawImage(clawCv,0,0,n,n,Math.round(ex-R/2),Math.round(ey-R/2),n*P,n*P);sg.imageSmoothingEnabled=sm;
}
function fxDrawImpact(plan,delta,dur,crit,ex,ey){
 const k=Math.min(1,delta/dur),cols=FX_TYPE[plan.type]||FX_TYPE.normal,big=crit?1.5:1;
 sg.save();sg.globalAlpha=k>.7?Math.max(0,(1-k)/.3):1;
 if(k<.6&&plan.key!=='lowkick')fxRing(ex,ey,18+k*60*big,Math.max(2,Math.round(8*(1-k))),cols[0]);
 if(k<.35&&plan.key!=='lowkick')fxRing(ex,ey,10+k*50*big,4,'#ffffff');
 let bigStar=true;
 if(plan.key==='leechlife'){const axx=ex<360?FE.eX:FE.pX,ayy=FE.feet+FE.chest;
  for(let i=0;i<9;i++){const p=(delta-250)/650-i*.06;if(p<0||p>1)continue;const x=ex+(axx-ex)*p+Math.sin(i*2.1+p*5)*14,y=ey+(ayy-ey)*p-Math.sin(p*Math.PI)*34+Math.cos(i*1.7)*10,sz=Math.round(16-8*p);sg.save();sg.globalAlpha=Math.min(1,p*5)*(1-Math.max(0,p-.85)*6);fxSq(x,y,sz+4,'#c89a1a');fxSq(x,y,sz,i%2?'#ffe04a':'#fff6a0');sg.restore()}}
 switch(plan.hit){
  case 'claw':{bigStar=false;
   // v651: forma tomada de la referencia del usuario (CLAW_SHAPE): tres cortes largos, finos y curvos, de mano izquierda; pixelado
   const W=crit?4.4:3.6;
   fxClawPixel(ex,ey,G=>{
   if(!crit){const p=Math.min(1,k/.32);fxClawSet(ex,ey,p*1.2,.19,-1,W,G,CLAW_RED)}
   else{const p1=Math.min(1,k/.3),p2=Math.min(1,Math.max(0,(k-.24)/.3));fxClawSet(ex,ey,p1*1.2,.23,-1,W,G,CLAW_RED);if(p2>0)fxClawSet(ex,ey,p2*1.2,.23,1,W,G,CLAW_RED)}},CLAW_RED);
   if(k>.12&&k<.5)blit('star',ex+8,ey+14,crit?4:3,false,false);
   break}
  case 'fang':case 'fangGreen':{bigStar=false;const close=Math.min(1,k/.3),gap=44*(1-close)+4,col=plan.hit==='fang'?'#ffffff':'#d6f5a0';
   if(k<.85){fxTeeth(ex,ey-gap-18,ey-gap,5,15,col);fxTeeth(ex,ey+gap+18,ey+gap,5,15,col)}break}
  case 'wing':{bigStar=false;const prog=Math.min(1,k/.4);
   if(k<.85)for(let i=0;i<3;i++){const r=28+i*15;for(let a=-1.25;a<=-1.25+2.5*prog;a+=.14)fxSq(ex+Math.cos(a)*r*(ex<360?1:-1),ey+Math.sin(a)*r,i===1?7:5,i===1?'#ffffff':'#bfe3f2')}
   break}
  case 'dash':{bigStar=false;const dr=ex<360?1:-1;
   if(k<.4)blit('star',ex,ey,Math.round(6*(1-k*1.8)),false,false);break}
  case 'ram':{bigStar=false;
   for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.4,r0=16+k*34,r1=34+k*70;fxLine(ex+Math.cos(a)*r0,ey+Math.sin(a)*r0,ex+Math.cos(a)*r1,ey+Math.sin(a)*r1,5,i%2?'#ffffff':'#f6e08a')}
   for(let i=0;i<5;i++)fxSq(ex+(i-2)*22,ey+34-k*12,10+k*16,'#e8e0c8');
   if(k<.35)blit('star',ex,ey,Math.round(6*(1-k*1.8)),false,false);break}
  case 'fist':{bigStar=false;const sz=Math.round(54*(1-k*.35));
   if(k<.7){px(ex-sz/2-4,ey-sz/2-4,sz+8,sz+8,'#3a2a22');px(ex-sz/2,ey-sz/2,sz,sz,'#f2cf9f');for(let i=1;i<4;i++)px(ex-sz/2+i*sz/4-2,ey-sz/2+4,4,sz*.38,'#c79a6a');px(ex-sz/2,ey+sz/2-10,sz,10,'#d9ae7c')}
   fxRing(ex,ey,26+k*70,5,'#ffffff');break}
  case 'slap':{bigStar=false;const n=Math.max(2,plan.hits||2),gap=plan.hits>1?170:200;
   const palm=(x,y,c,fl,al)=>{sg.save();sg.globalAlpha=al;sg.translate(x,y);sg.rotate((ex>360?1:-1)*Math.PI/2);sg.scale(1.5,fl>0?1.5:-1.5);px(-18,-4,36,32,'#3a2a22');px(-15,-2,30,28,c);for(let q=0;q<4;q++){px(-16+q*8,-26+(q%3===1?-4:0),7,26,'#3a2a22');px(-15+q*8,-24+(q%3===1?-4:0),5,24,c)}px(-26,6,12,10,'#3a2a22');px(-24,8,9,6,c);sg.restore()};
   for(let i=0;i<n;i++){const d0=i*gap;if(delta<d0||delta>d0+260)continue;const q=Math.min(1,(delta-d0)/200),dr=i%2?-1:1,pos=qq=>ex+dr*(-120+210*(1-Math.pow(1-Math.max(0,qq),2))),y=ey-4;
    for(let g=3;g>=1;g--)palm(pos(q-g*.1),y,i%2?'#f6dbb4':'#f2cf9f',dr,.22*(4-g)/3);
    palm(pos(q),y,i%2?'#f6dbb4':'#f2cf9f',dr,1);
    for(let t2=0;t2<3;t2++)px(pos(q)-dr*(50+t2*26),y-10+t2*14,34,4,'#ffffff');
    if(q>.55){fxRing(ex,ey,10+(q-.55)*90,4,'#ffffff');blit('star',ex+dr*12,ey,3,false,false)}}
   break}
  case 'whip':{bigStar=false;const prog=Math.min(1,k/.4),dr=ex<360?1:-1;
   sg.save();sg.lineCap='round';
   for(const [lw,c] of [[22,'#8a6a3a'],[14,'#e8d4a0'],[6,'#ffffff']]){sg.strokeStyle=c;sg.lineWidth=lw;sg.beginPath();sg.arc(ex+dr*50,ey-10,92,dr>0?Math.PI*1.1:-Math.PI*.1,dr>0?Math.PI*(1.1+.95*prog):-Math.PI*(.1+.95*prog),dr<0);sg.stroke()}
   sg.restore();
   sg.save();sg.globalAlpha=Math.max(0,1-k*1.3);sg.strokeStyle='#d8cdb0';sg.lineWidth=6;sg.beginPath();sg.ellipse(ex,ey+60,30+k*110,10+k*20,0,0,7);sg.stroke();sg.restore();
   if(k>.3&&k<.7)blit('star',ex,ey,5,false,false);break}
  case 'boo':{bigStar=false;const g=Math.min(1,k/.25),r=12+g*40;
   sg.save();sg.globalAlpha=Math.min(1,(1-k)*1.6);
   sg.fillStyle='#2b1646';sg.beginPath();sg.ellipse(ex,ey-6,r,r*1.15,0,0,7);sg.fill();
   sg.strokeStyle='#8a5ad0';sg.lineWidth=5;sg.stroke();
   px(ex-r*.5,ey-r*.5,r*.28,r*.44,'#ffffff');px(ex+r*.22,ey-r*.5,r*.28,r*.44,'#ffffff');
   px(ex-r*.4,ey+r*.15,r*.8,r*.3,'#ffffff');for(let i=0;i<4;i++)px(ex-r*.4+i*r*.2,ey+r*.15,r*.1,r*.15,'#2b1646');
   sg.restore();break}
  case 'coil':{bigStar=false;feCoilHalf(ex,ey,delta,'front');if(delta<140)blit('star',ex,ey,3,false,false);break}
  case 'beak':{bigStar=false;const n=(plan.hits>1?plan.hits:3),gap=plan.hits>1?170:130;
   for(let i=0;i<n;i++){const d0=i*gap;if(delta<d0||delta>d0+230)continue;const x=ex+((i*37)%60)-30,y=ey+((i*53)%50)-25,q=(delta-d0)/230,hy=y-48*(1-Math.min(1,q*1.6));
    polygon([[x-14,hy-14],[x+14,hy-14],[x,y+12]],'#3a2a22');polygon([[x-11,hy-12],[x+11,hy-12],[x,y+8]],'#f4c24a');polygon([[x-5,hy-10],[x+5,hy-10],[x,y+2]],'#fff0b0');
    if(q>.45){fxRing(x,y+8,10+(q-.45)*80,4,'#ffffff');blit('star',x,y+8,3,false,false)}}break}
  case 'kick':{bigStar=false;const dr=ex<360?-1:1,kk=Math.max(0,(k-.3)/.7),pop=Math.min(1,Math.max(0,k/.06)),sc=pop<1?.4+pop*.75:1.15-Math.min(.15,(k-.22)*.4),mv=Math.min(1,k/.3),fx0=ex+dr*(-230+310*mv),fy0=ey+60,sh=0;
   const put=(lx,ly,s,c)=>fxSq(fx0+dr*lx*.7*sc,fy0+ly*.7*sc+sh,s*.7*sc,c);
   if(k>.01&&k<.62){sg.save();sg.globalAlpha=k<.5?1:Math.max(0,1-(k-.5)/.12);sg.strokeStyle='#0a0a10';sg.lineCap='round';for(const [oy,w,ln] of [[-9,3,170],[0,3.5,210],[9,3,150]]){sg.lineWidth=w;sg.beginPath();sg.moveTo(fx0-dr*14,fy0+oy*.8+sh);sg.lineTo(fx0-dr*(14+(34+70*mv)*(ln/200)),fy0+oy*.8+sh);sg.stroke()}sg.restore()}
   if(k>.01&&k<.62){sg.save();sg.globalAlpha=k<.5?1:Math.max(0,1-(k-.5)/.12);sg.translate(fx0,fy0+sh);sg.scale(dr*sc*.62,sc*.62);sg.rotate(Math.PI/2);sg.translate(0,-40);sg.fillStyle='#0a0a10';const el=(x,y,rx,ry)=>{sg.beginPath();sg.ellipse(x,y,rx,ry,0,0,7);sg.fill()};el(0,32,14,18);el(0,12,12,16);el(0,-12,25,26);el(-21,-42,5.5,5.5);el(-10,-51,6,6);el(1,-54,6.5,6.5);el(13,-51,7.5,7.5);el(25,-42,9,9);sg.restore()}
   if(k>.3){const cy=ey+34;sg.save();{const gr=sg.createRadialGradient(ex,cy,4,ex,cy,60+kk*40);gr.addColorStop(0,'rgba(255,250,200,.9)');gr.addColorStop(.55,'rgba(255,230,80,.45)');gr.addColorStop(1,'rgba(255,225,60,0)');sg.fillStyle=gr;sg.globalAlpha=Math.max(0,1-kk*.65);sg.beginPath();sg.arc(ex,cy,110,0,7);sg.fill()}sg.restore();
    for(let i=0;i<18;i++){const an=i/18*Math.PI*2+.3*i,r=16+kk*(54+(i%4)*14),sz=Math.max(3,(i%3?7:11)-kk*5);if(kk<.92||i%2)fxSq(ex+Math.cos(an)*r,cy+Math.sin(an)*r*.8,sz,i%2?'#ffe14a':'#fff3a0')}
    if(k<.55)blit('star',ex,cy,5,false,false);fxRing(ex,cy,14+kk*58,4,'#ffe98a')}
   break}
  case 'slash':{bigStar=false;const prog=Math.min(1,k/.25),dr=ex<360?1:-1;
   if(k<.9){const x0=ex+dr*60,y0=ey-90,x1=x0-dr*130*prog,y1=y0+190*prog;fxLine(x0,y0,x1,y1,16,'#bfe3f2');fxLine(x0,y0,x1,y1,8,'#ffffff')}
   if(k>.15&&k<.6)blit('star',ex,ey,4,false,false);break}
  case 'steelclaw':{bigStar=false;
   // v651: igual que Arañazo, pero de acero y doble: primer zarpazo (mano izquierda) y, a los 370 ms, el segundo (mano derecha) que deja una X
   const dd=k*dur,p1=Math.min(1,dd/150),p2=Math.min(1,Math.max(0,(dd-370)/150)),sc=crit?.23:.19,W=crit?4.4:3.6;
   if(k<.95)fxClawPixel(ex,ey,G=>{fxClawSet(ex,ey,p1*1.2,sc,-1,W,G,CLAW_STEEL);if(p2>0)fxClawSet(ex,ey,p2*1.2,sc,1,W,G,CLAW_STEEL)},CLAW_STEEL);
   if(dd>60&&dd<200)polygon([[ex-10,ey-16],[ex-4,ey],[ex-10,ey+16],[ex-16,ey]],'#ffffff');
   if(dd>430&&dd<570)polygon([[ex+10,ey-16],[ex+16,ey],[ex+10,ey+16],[ex+4,ey]],'#ffffff');break}
  case 'chop':{bigStar=false;
   // la mano ya cayó antes del impacto (ver drawFEFrame); aquí se mantiene un instante y se desvanece
   const fade=k>.35?Math.max(0,1-(k-.35)/.3):1,hx=ex,hy=ey-38;
   if(fade>0)feChopHand(ex,ey,1,fade);
   if(k<.5){const a=1-k/.5,gr=sg.createRadialGradient(hx,hy,2,hx,hy,22+k*60);gr.addColorStop(0,'rgba(255,240,70,'+(.95*a)+')');gr.addColorStop(1,'rgba(255,220,40,0)');sg.fillStyle=gr;sg.beginPath();sg.arc(hx,hy,22+k*60,0,7);sg.fill()}
   for(let i=0;i<18;i++){const an=-Math.PI*(.1+.8*((i*37)%18)/18),r=14+k*(50+(i%5)*16),sz=Math.max(2,5-k*4);if(k<.9)fxSq(hx+Math.cos(an)*r*1.3,hy+Math.sin(an)*r+k*k*40,sz,i%2?'#e8602c':'#ff9a3c')}
   break}
 }
 if(bigStar&&k<.55)blit('star',ex,ey,Math.max(2,Math.round((crit?9:6)*(1-k*.8))),false,false);
 else if(!bigStar&&k<.4&&plan.key!=='lowkick')blit('star',ex,ey,3,false,false);
 const n=crit?14:9;
 switch(plan.type){
  case 'dragon':for(let i=0;i<3;i++)blit('flame',ex+(i-1)*24,ey+10-k*46-(i%2)*10,Math.round(3*big),i%2===0,false,{r:'#4a1f8c',o:'#8a4fe0',y:'#c99bff',w:'#f3e6ff'});break;
  case 'fire':for(let i=0;i<3;i++)blit('flame',ex+(i-1)*24,ey+10-k*46-(i%2)*10,Math.round(3*big),i%2===0,false);break;
  case 'water':for(let i=0;i<n;i++){const a=Math.PI+i/(n-1)*Math.PI;blit('drop',ex+Math.cos(a)*k*60*big,ey+Math.sin(a)*k*60*big+k*k*55,2,false,false)}break;
  case 'electric':for(let i=0;i<6;i++){const a=i*1.05+.4,r=(34+10*(i%2))*big*Math.min(1,k*3);fxBolt(ex,ey,ex+Math.cos(a)*r,ey+Math.sin(a)*r,delta,3,8,i+2)}break;
  case 'grass':for(let i=0;i<6;i++){const a=i*1.05;blit('leaf',ex+Math.cos(a)*k*64,ey+Math.sin(a)*k*64+k*22,3,i%2===0,i%3===0)}break;
  case 'rock':case 'ground':for(let i=0;i<6;i++){const a=-.3-i*.5;blit('rock',ex+Math.cos(a)*k*66,ey+Math.sin(a)*k*66+k*k*80,2,i%2===0,false)}
   for(let i=0;i<4;i++)fxSq(ex+(i-1.5)*20,ey+26-k*8,10+k*8,'#d8cdb0');break;
  case 'poison':for(let i=0;i<5;i++)blit('puff',ex+(i-2)*18,ey-k*50-(i%2)*8,2,false,false);break;
  case 'bug':for(let i=0;i<5;i++)blit('spark',ex+Math.cos(i*1.3)*k*50,ey+Math.sin(i*1.3)*k*50,3,false,false,{y:'#a8d44e',w:'#e8f5a0'});break;
 }
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.3,r=(14+nh(i,3,5)%24)*k*1.5+k*40*big;fxSq(ex+Math.cos(a)*r,ey+Math.sin(a)*r,i%2?6:4,cols[i%2])}
 sg.restore();
}
function drawFEImpactBurst(ev,t,crit,impact){
 if(ev.miss||t<impact||t>impact+240)return;
 const k=(t-impact)/240,tx=(ev.target.side==='player'?FE.pX:FE.eX),ty=FE.feet+FE.chest;
 sg.save();sg.globalAlpha=1-k;
 const n=crit?12:8,r0=18+k*(crit?70:46),r1=r0+(crit?34:22)*(1-k);
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2+(crit?.2:0);fxLine(tx+Math.cos(a)*r0,ty+Math.sin(a)*r0,tx+Math.cos(a)*r1,ty+Math.sin(a)*r1,crit?5:3,i%2?'#fff4b0':'#ffffff',2)}
 sg.restore();
}
function drawParticles(ev,t,crit){
 const plan=fxPlan(ev),fromLeft=ev.attacker.side==='player';
 let sx=fromLeft?272:466,sy=fromLeft?399:322,ex=fromLeft?537:179,ey=ev.miss?(fromLeft?268:357):(fromLeft?312:412);
 if(battleStyle==='face'){const dir=fromLeft?1:-1;sx=(fromLeft?FE.pX:FE.eX)+dir*70;sy=FE.feet+FE.chest;ex=fromLeft?FE.eX:FE.pX;ey=(ev.miss?FE.feet-170:FE.feet+FE.chest+2)+(fromLeft?-16:0)}
 const firing=crit?1490:980,impact=crit?2220:1560;
 if(plan.proj){
  // Ataques de varios golpes a distancia (Doble Ataque, Misil Aguja): un disparo por cada golpe
  const shots=(!ev.miss&&plan.hits>1)?plan.hits:1;
  for(let hi=0;hi<shots;hi++){
   const t0=firing+170*hi;if(t<t0)continue;
   const travel=(t-t0)/(impact-firing);
   if(travel<=(ev.miss?1.45:1))fxDrawProjectile(plan,t-170*hi,crit,sx,sy,ex,ey,travel);
  }
 }
 if(!ev.miss){const dur=(plan.key==='leechlife'?900:0)+(plan.key==='metalclaw'?400:0)+(crit?800:560)+(plan.still?800:0)+(plan.hits>1?170*(plan.hits-1):0),delta=t-impact,ld=plan.key==='lowkick'?.3*dur:0;if(delta>=-ld&&delta<dur-ld)fxDrawImpact(plan,delta+ld,dur,crit,ex,ey)}
}
function drawCriticalCutIn(ev,t){
    if(t<560||t>1420)return;
    let alpha=Math.min(1,(t-560)/120,(1420-t)/180);
    sg.save();sg.globalAlpha=Math.max(0,alpha);
    polygon([[0,205],[720,118],[720,338],[0,414]],'#243347');
    polygon([[0,220],[720,133],[720,151],[0,240]],'#f5d989');
    polygon([[0,383],[720,308],[720,327],[0,407]],'#d86a5e');
    // Primer plano del atacante en el centro del corte cinematográfico.
    const sprite=fetchSprite(ev.attacker.id);
    if(sprite&&sprite.ready){sg.imageSmoothingEnabled=false;
        if(ev.attacker.side==='player'){sg.save();sg.translate(268,0);sg.scale(-1,1);sg.drawImage(sprite.img,0,139,240,240);sg.restore()}
        else sg.drawImage(sprite.img,28,139,240,240);
    }else drawFallbackCreature(ev.attacker.id,140,290,1.75,true);
    textPixel('¡GOLPE',440,245,39,'#fff5d3','center');
    textPixel('CRÍTICO!',440,301,39,'#ffd889','center');
    sg.restore();
}
function drawCinematicFrameClassic(ev,t,duration){
    const crit=!!ev.critical;sg.clearRect(0,0,720,600);
    const hitAt=crit?2220:1560;
    const hitProgress=Math.max(0,Math.min(1,(t-hitAt)/600));
    let hpBefore=ev.defBefore,hpCurrent=ev.defBefore+(ev.defAfter-ev.defBefore)*hitProgress;
    let player=ev.attacker.side==='player'?ev.attacker:ev.target;
    let enemy=ev.attacker.side==='enemy'?ev.attacker:ev.target;
    const healK=ev.heal?Math.max(0,Math.min(1,(t-hitAt-250)/600)):0,healAdd=Math.round((ev.heal||0)*healK);
    const playerHp=player===ev.target?hpCurrent:(player===ev.attacker?ev.from+healAdd:player.hp);
    const enemyHp=enemy===ev.target?hpCurrent:(enemy===ev.attacker?ev.from+healAdd:enemy.hp);
    const shaking=t>hitAt&&t<hitAt+(crit?460:220)&&!ev.miss;
    sg.save();if(shaking)sg.translate((Math.sin(t*.67)*(crit?14:6))|0,(Math.cos(t*.54)*(crit?11:4))|0);
    drawStage(t,crit);
    const attackingFromLeft=ev.attacker.side==='player';
    const playerMode=player===ev.attacker?'attack':(player===ev.target?'hit':'idle');
    const enemyMode=enemy===ev.attacker?'attack':(enemy===ev.target?'hit':'idle');
    drawCreature(player,true,t,playerMode,crit,ev.move.category);
    drawCreature(enemy,false,t,enemyMode,crit,ev.move.category);
    drawHud(player,'left',playerHp);drawHud(enemy,'right',enemyHp);
    drawParticles(ev,t,crit);
    // texto inferior siempre legible
    px(14,478,692,97,'#142a3b');px(18,482,684,89,'#f4e4c3');px(25,489,670,75,'#244559');
    const title=(ev.counter?'CONTRAATAQUE · ':'')+base[ev.attacker.id].name+' usa '+ev.move.name;
    textPixel(title,37,512,17,'#fff0c1');
    let subtitle=ev.miss&&t>hitAt?'¡EL ATAQUE FALLÓ!':t>hitAt?crit?'¡GOLPE CRÍTICO!  -'+ev.damage+' PS':ev.damage>0?'-'+ev.damage+' PS': '¡SIN EFECTO!':crit?'Concentrando energía…':'¡Preparando el ataque!';
    textPixel(subtitle,37,543,16,t>hitAt&&crit?'#ffc287':'#d8ebe1');
    if(t>hitAt&&!ev.miss&&crit){const cm='¡GOLPE CRÍTICO!';sg.font='900 18px monospace';const cw=sg.measureText(cm).width+22;px(360-cw/2,392,cw,35,'#a8323f');textPixel(cm,360,418,18,'#fff1ba','center')}
    if(t>hitAt&&!ev.miss&&ev.move.power&&typeof ev.eff==='number'&&ev.eff!==1){
        const msg=typeMessage(ev.eff);
        const w=sg.measureText(msg).width+22;
        px(360-w/2,434,w,35,ev.eff>1?'#28775b':ev.eff===0?'#646b84':'#6a7180');
        textPixel(msg,360,460,18,'#fff1ba','center');
    }
    sg.restore();
    if((t<280&&!ev.seamIn)||(t>duration-210&&!ev.seamOut)){let a=t<280?1-t/280:Math.max(0,(t-(duration-210))/210);sg.save();sg.globalAlpha=a;px(0,0,720,600,'#172d3b');sg.restore()}
    if(crit&&t>hitAt&&t<hitAt+145){sg.save();sg.globalAlpha=1-(t-hitAt)/145;px(0,0,720,600,'#fff2c5');sg.restore()}
}
/* ===== v0.51 — Escena de combate frente a frente (inspirada en los combates de GBA tipo Fire Emblem) ===== */
// v651: velocidades disponibles x1 (normal), x1,5 y x2 (rápida). Un x3 guardado de versiones anteriores pasa a x2.
const ANIM_SPEEDS=[1,1.5,2];
let animSpeed=1;try{const sp=Number(localStorage.getItem('pokemon-tactics-anim-speed'));animSpeed=sp>=2?2:sp===1.5?1.5:1}catch(e){}
const speedLabel=v=>'x'+String(v).replace('.',',')+(v===1?' · normal':v===2?' · rápida':'');
const nextAnimSpeed=()=>ANIM_SPEEDS[(ANIM_SPEEDS.indexOf(animSpeed)+1)%ANIM_SPEEDS.length];
let battleStyle='face';
try{const saved=localStorage.getItem('pokemon-tactics-battle-style');if(saved==='classic'||saved==='face')battleStyle=saved}catch(e){}
const FE={pX:196,eX:524,feet:458,chest:-66};
let feSolo=false; // ataques sobre uno mismo: solo se ve al Pokémon, centrado
const FE_TYPE_ES={normal:'NORMAL',fire:'FUEGO',water:'AGUA',electric:'ELÉCTRICO',grass:'PLANTA',ice:'HIELO',fighting:'LUCHA',poison:'VENENO',ground:'TIERRA',flying:'VOLADOR',psychic:'PSÍQUICO',bug:'BICHO',rock:'ROCA',ghost:'FANTASMA',dragon:'DRAGÓN',dark:'SINIESTRO',steel:'ACERO',fairy:'HADA'};
const feWhite=new WeakMap();
function feWhiteSprite(img,bb){
 let c=feWhite.get(img);
 if(!c){c=document.createElement('canvas');c.width=bb.sw;c.height=bb.sh;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.drawImage(img,bb.sx,bb.sy,bb.sw,bb.sh,0,0,bb.sw,bb.sh);g.globalCompositeOperation='source-atop';g.fillStyle='#ffffff';g.fillRect(0,0,bb.sw,bb.sh);feWhite.set(img,c)}
 return c;
}
function drawFEPlatform(cx,cy,rx,ry,top,rim,shade){
 if(window.__r3d&&B3)return;
 if(feSolo){if(cx===FE.eX)return;cx=360}
 sg.fillStyle=shade;sg.beginPath();sg.ellipse(cx,cy+10,rx,ry,0,0,Math.PI*2);sg.fill();
 sg.fillStyle=rim;sg.beginPath();sg.ellipse(cx,cy+4,rx,ry,0,0,Math.PI*2);sg.fill();
 sg.fillStyle=top;sg.beginPath();sg.ellipse(cx,cy,rx-4,ry-4,0,0,Math.PI*2);sg.fill();
}
function drawFELabBackdrop(){
 // Laboratorio de Oak: pared con vitrinas y máquina arriba, suelo blanco con diagonales.
 px(0,0,720,330,'#cfcfd9');
 for(let y=0;y<330;y+=4){for(let x=((y/4)%8)*4;x<720;x+=32)px(x,y,4,4,'#b9b9c6')}
 px(0,0,720,22,'#a5a5b8');px(0,22,720,4,'#e4e4ec');
 px(0,330,720,10,'#8d8da4');px(0,324,720,6,'#e8e8f0');
 sg.imageSmoothingEnabled=false;
 const sl=labSprite('shelfL'),sr=labSprite('shelfR'),ma=labSprite('machine'),tb=labSprite('table');
 sg.drawImage(sl,0,0,64,32,28,150,256,128);
 sg.drawImage(sr,0,0,64,32,436,150,256,128);
 sg.drawImage(ma,0,0,ma.width,ma.height,300,106,ma.width*4,ma.height*4);
 // sombras bajo los muebles
 px(28,278,256,8,'#b4b4c6');px(436,278,256,8,'#b4b4c6');
 // suelo
 px(0,340,720,260,'#efeef4');
 for(let y=340;y<600;y+=4){for(let x=(((y-340)/4)%8)*4;x<720;x+=32)px(x,y,4,4,'#c8c8d4')}
 px(0,340,720,12,'#dcdce8');
}
function drawFEField(forest,crit){
 // v0.63 · campo de combate hecho con los mismos sprites del mapa: hierba verde azulada, abetos, matas altas y flores.
 const base=forest?'#4f9f7c':'#73cea5',tuft=forest?'#66b793':'#8cdebd';
 px(0,0,720,600,base);
 for(let i=0;i<260;i++){const x=(i*97+13)%700,y=((i*61+7)%600);px(x,y,4,4,tuft);px(x+8,y,4,4,tuft)}
 sg.imageSmoothingEnabled=false;
 const tr=getTreeSprite(),tall=getTallSprite();
 // filas de abetos escalonadas que llenan la parte alta como en el borde de las rutas
 if(forest)sg.filter='brightness(.68) saturate(1.1)';
 // una sola línea horizontal de abetos al fondo; por encima, solo el campo abierto
 for(let i=-1;i<10;i++)sg.drawImage(tr,0,0,32,48,i*84-8,136-144,96,144);
 sg.filter='none';
 // camino de arena entre los Pokémon (como el sendero del mapa)
 if(!forest){px(150,350,420,60,'#e9d9a0');px(150,350,420,4,'#f4ead0');px(150,406,420,4,'#cdb87a');for(let i=0;i<60;i++)px(160+(i*53)%400,358+(i*29)%44,4,4,'#d8c58a')}
 // matas de hierba alta y flores en los lados
 const clump=(x,y)=>sg.drawImage(tall,0,0,16,16,x,y,64,64);
 for(const [y,off] of [[176,0],[236,64]])for(let x=off+10;x<700;x+=128)if(!(y===296&&x>250&&x<470))clump(x,y);
 for(const [x,y] of [[10,360],[74,360],[582,360],[646,360],[10,416],[646,416]])clump(x,y);
 for(const [x,y] of [[300,430],[420,420],[250,470],[470,472]]){px(x,y+8,16,4,'#18a56b');for(const [dx,dy,c] of [[0,0,'#c63142'],[4,0,'#ef846b'],[8,0,'#c63142'],[0,4,'#c63142'],[4,4,'#ffc673'],[8,4,'#c63142']])px(x+dx,y+dy,4,4,c)}
 const pt=forest?'#8ed4b2':'#a9e8cb',pr=forest?'#3f8a68':'#4ea583',ps=forest?'#2f6e52':'#3a8466';
 drawFEPlatform(FE.pX,FE.feet+6,160,32,pt,pr,ps);drawFEPlatform(FE.eX,FE.feet+6,160,32,pt,pr,ps);
 if(crit)px(0,0,720,600,'rgba(110,50,90,.18)');
}
function drawFEStage(t,crit){
 if(window.__r3d&&b3draw(t)){
  if(crit){sg.save();sg.globalAlpha=.14+Math.sin(t/85)*.07;for(let i=0;i<12;i++){const yy=(i*67+t*.36)%600;polygon([[0,yy],[720,yy-88],[720,yy-75],[0,yy+13]],'#fff2c7')}sg.restore()}
  return}
 const gym=stageId==='gymguard'||stageId==='pewter';
 const lab=stageId==='pallet',forest=stageId==='forest'||stageId==='forestdoug'||stageId==='forestmid'||stageId==='forestexit';
 const caveB=stageId==='mtmoon'||stageId==='mtmoonj'||stageId==='mtmoonb'||stageId==='mtmoonc',poolB=stageId==='ceruleanguard'||stageId==='cerulean',cliffB=stageId==='route3'||stageId==='route3b';
 if(caveB){
  px(0,0,720,600,'#5a4e44');for(let i=0;i<120;i++){const x=(i*89+11)%700,y=(i*53+7)%330;px(x,y,8,4,i%2?'#463c34':'#6a5c50')}
  px(0,300,720,30,'#7a6c5e');px(0,330,720,270,'#a89c86');
  for(let i=0;i<220;i++){const x=(i*97+13)%700,y=330+((i*61+7)%260);px(x,y,4,4,i%3?'#948872':'#bcb09a')}
  drawFEPlatform(FE.pX,FE.feet+6,150,30,'#bcb09a','#8a7e6a','#6a5c50');drawFEPlatform(FE.eX,FE.feet+6,150,30,'#bcb09a','#8a7e6a','#6a5c50');
 }else if(poolB){
  px(0,0,720,250,'#3a5a9a');for(let x=0;x<720;x+=32)px(x,40,4,210,'#2e4a84');px(0,230,720,24,'#5a7cbc');px(0,254,720,8,'#243a6c');
  px(0,262,720,76,'#4aa0e8');for(let i=0;i<40;i++){const x=(i*83+9)%700,y=270+((i*37)%60);px(x,y,28,4,i%2?'#8cd0ff':'#7cc0f4')}px(0,338,720,6,'#2e78c0');
  for(let y=344;y<600;y+=64)for(let x=0;x<720;x+=64)px(x,y,64,64,((x/64)+((y-344)/64))%2===0?'#e4edf8':'#c9d9ec');
  drawFEPlatform(FE.pX,FE.feet+6,150,30,'#f6faff','#a8bcd8','#8aa0c0');drawFEPlatform(FE.eX,FE.feet+6,150,30,'#f6faff','#a8bcd8','#8aa0c0');
 }else if(gym){
  // fondo del gimnasio: panel de pared, viga con almenas y suelo de arena, tomados del mapa
  if(GYM_BG.complete&&GYM_BG.naturalWidth){
   sg.imageSmoothingEnabled=false;
   sg.drawImage(GYM_BG,24,12,150,16,0,0,720,250);
   sg.drawImage(GYM_BG,24,28,150,5,0,250,720,34);
   px(0,282,720,6,'#8a7a5a');
   for(let ty=288;ty<600;ty+=96)for(let tx=0;tx<720;tx+=96)sg.drawImage(GYM_BG,148,52,24,24,tx,ty,96,96);
  }else{px(0,0,720,330,'#c8d890');px(0,330,720,270,'#d4c48c')}
  drawFEPlatform(FE.pX,FE.feet+6,150,30,'#d8c890','#a89868','#8a7a54');drawFEPlatform(FE.eX,FE.feet+6,150,30,'#d8c890','#a89868','#8a7a54');
 }else if(lab){
  drawFELabBackdrop();
  drawFEPlatform(FE.pX,FE.feet+6,150,30,'#f6f6fb','#b8b8cc','#a0a0b8');drawFEPlatform(FE.eX,FE.feet+6,150,30,'#f6f6fb','#b8b8cc','#a0a0b8');
 }else{
  drawFEField(forest,crit);
 }
 if(crit){sg.save();sg.globalAlpha=.14+Math.sin(t/85)*.07;for(let i=0;i<12;i++){const yy=(i*67+t*.36)%600;polygon([[0,yy],[720,yy-88],[720,yy-75],[0,yy+13]],'#fff2c7')}sg.restore()}
}
function feDash(t,impact,reach){return 0}
// Golpes múltiples: el atacante repite la embestida una vez por cada golpe
function feMulti(t,crit,impact,reach,hits){
 const last=impact+170*(hits-1);
 if(t<=impact)return feLunge(t,crit,true,impact,reach);
 if(t<last+140){const p=((t-impact)%170)/170;return reach-80*Math.sin(p*Math.PI)}
 return feLunge(t-170*(hits-1),crit,true,impact,reach);
}
function feLunge(t,crit,melee,impact,reach,hold=0){
 if(melee){
  const s=crit?1500:760,arrive=impact-70,back=impact+140+hold,end=impact+540+hold;
  if(t<s-300)return 0;
  if(t<s){const k=(t-(s-300))/300;return -18*Math.sin(k*Math.PI/2)}
  if(t<arrive){const k=(t-s)/(arrive-s);return -18+(reach+18)*k*k}
  if(t<back)return reach;
  if(t<end){const k=(t-back)/(end-back);return reach*(1-k)}
  return 0;
 }
 const f=crit?1490:980;
 if(t>f-160&&t<f+300){const k=(t-(f-160))/460;return -14*Math.sin(k*Math.PI)}
 return 0;
}
let pmdOn=true;try{pmdOn=localStorage.getItem('ptg_pmd')!=='0'}catch(e){}
