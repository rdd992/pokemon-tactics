// forma por máscara con relleno, luz arriba-izquierda y contorno oscuro
function pxaBlob(w,h,lobes,pal,seed,extra){
 const Q=2;
 return pxaCanvas(w*Q,h*Q,(P0)=>{
  const W2=w*Q,H2=h*Q,P=P0;
  const m=new Int8Array(W2*H2).fill(-1);
  lobes.forEach((l,i)=>{for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const dx=(x+.5-l[0]*Q)/(l[2]*Q),dy=(y+.5-l[1]*Q)/(l[3]*Q);if(dx*dx+dy*dy<=1)m[y*W2+x]=i}});
  const at=(x,y)=>x<0||y<0||x>=W2||y>=H2?-1:m[y*W2+x];
  if(extra&&extra.under)extra.under((x,y,c)=>{for(let a=0;a<Q;a++)for(let b=0;b<Q;b++)P0(x*Q+a,y*Q+b,c)});
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=m[y*W2+x];if(i<0)continue;const l=lobes[i];
   const edge=at(x-1,y)<0||at(x+1,y)<0||at(x,y-1)<0||at(x,y+1)<0;
   if(edge){P(x,y,pal[0]);continue}
   const t=((x+.5-l[0]*Q)/(l[2]*Q))*-.62+((y+.5-l[1]*Q)/(l[3]*Q))*-.78;
   let c=pal[2];if(t>.42)c=pal[3];else if(t<-.28)c=pal[1];
   {const dy=(y+.5-l[1]*Q)/(l[3]*Q),dx=(x+.5-l[0]*Q)/(l[2]*Q);if(dy>.38)c=pal[1];else if(dy<-.2&&dx<.1&&dy>-.75)c=pal[3];if(dy>.38&&dy<.52&&dx<-.2)c=pal[2]}
   P(x,y,c)}
 })}
function pxaPal(base){return [pxaShade(base,.36),pxaShade(base,.7),base,pxaShade(base,1.28)]}
function pxaTreeRound(base,seed){
 return pxaBlob(18,24,[[9,14.5,8.3,6.6],[9,9,6.3,5.6],[9,4.8,4.4,4.2]],pxaPal(base),seed,{under:P=>{for(let y=18;y<24;y++){P(8,y,'#4a3020');P(9,y,'#7a5636');P(10,y,'#4a3020')}for(let x=7;x<12;x++)P(x,23,'#4a3020')}})}
function pxaPine(base,seed){
 const pal=pxaPal(base),Q=2;
 return pxaCanvas(16*Q,26*Q,(P)=>{
  const tier=(ay,by,hw)=>{const y0=ay*Q,y1=by*Q;for(let y=y0;y<=y1;y++){const k=(y-y0)/(y1-y0),w=Math.round(hw*Q*(.25+.75*k)+(((y>>1)&1)?-.6:.6));for(let x=-w;x<=w;x++){const px=8*Q+x,edge=Math.abs(x)>=w||y===y1||y===y0;let c=pal[2];if(!edge){if(x<-w*.25)c=pal[3];else if(x>w*.3)c=pal[1];if(k>.78)c=pal[1]}else c=pal[0];P(px,y,c)}}};
  for(let y=22*Q;y<26*Q;y++)for(let x=7*Q;x<9*Q+1;x++)P(x,y,x===7*Q||x===9*Q?'#4a3020':'#7a5636');
  tier(11,22,7);tier(6,16,5.6);tier(1,10,4)})}
function r3RockBlock(T,w,h,d,mat,seed){const bv=.12,rr=Math.min(.35,w*.2,d*.2),hx=w/2-bv,hz=d/2-bv,sh=new T.Shape();
 sh.moveTo(-hx+rr,-hz);sh.lineTo(hx-rr,-hz);sh.absarc(hx-rr,-hz+rr,rr,-Math.PI/2,0,false);sh.lineTo(hx,hz-rr);sh.absarc(hx-rr,hz-rr,rr,0,Math.PI/2,false);sh.lineTo(-hx+rr,hz);sh.absarc(-hx+rr,hz-rr,rr,Math.PI/2,Math.PI,false);sh.lineTo(-hx,-hz+rr);sh.absarc(-hx+rr,-hz+rr,rr,Math.PI,Math.PI*1.5,false);
 const g=new T.ExtrudeGeometry(sh,{depth:Math.max(.1,h-2*bv),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:3,curveSegments:4});g.rotateX(-Math.PI/2);g.translate(0,bv,0);g.computeVertexNormals();
 const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv,K=.34,col=new Float32Array(p.count*3);
 for(let k=0;k<p.count;k++){const px=p.getX(k),py=p.getY(k),pz=p.getZ(k),ny=n.getY(k);if(Math.abs(ny)>.5)uv.setXY(k,px*K+seed,pz*K);else if(Math.abs(n.getX(k))>.5)uv.setXY(k,pz*K+seed,py*K);else uv.setXY(k,px*K+seed,py*K);
  const c=ny>.98?1:ny>.15?.5:.85;col[k*3]=c;col[k*3+1]=c*.96;col[k*3+2]=c*.98}
 g.setAttribute('color',new T.BufferAttribute(col,3));return new T.Mesh(g,mat)}
function pxaBoulder(seed){const W=32,H=32,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const hs=(a,b)=>{const v=Math.sin(a*127.1+b*311.7+seed*17.3)*43758.5453;return v-Math.floor(v)};
 const j=(i)=>(hs(i,3)-.5)*2;
 const bl=[[11+j(1),21+j(2),10,9],[21+j(3),19+j(4),9,8],[16+j(5),14+j(6),9,7]];
 const id=new Int8Array(W*H).fill(-1);
 bl.forEach(([cx,cy,rx,ry],k)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)id[y*W+x]=k});
 const at=(x,y)=>x<0||y<0||x>=W||y>=H?-1:id[y*W+x];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=at(x,y);if(k<0)continue;const [cx,cy,rx,ry]=bl[k];let col;
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const o=at(x+dx,y+dy);return o<k});
  if(edge)col='#34202c';
  else{const t=-((x-cx)/rx)*.6-((y-cy)/ry)*.8+(hs(x>>2,y>>2)-.5)*.18;col=t>.62?'#d6a39a':t>.22?'#b07a7a':t>-.3?'#8a5a62':'#5e3a48'}
  g.fillStyle=col;g.fillRect(x,y,1,1)}
 return c}
function pxaRock(base,seed){return pxaBlob(14,10,[[7,6,6.3,3.9],[5,4.8,3.6,3],[10,5.5,3.3,2.8]],pxaPal(base),seed)}
function pxaBush(base,seed){return pxaBlob(14,10,[[7,6,6.4,4],[4.5,5,3.8,3.2],[9.7,5.2,3.6,3.2]],pxaPal(base),seed)}
function pxaStalag(base,seed){const pal=pxaPal(base);return pxaCanvas(12,20,(P)=>{for(let y=0;y<20;y++){const w=Math.round(.5+y*.28);for(let x=-w;x<=w;x++){const edge=Math.abs(x)>=w||y===0;P(6+x,y,edge?pal[0]:x<0?pal[3]:x>w*.4?pal[1]:pal[2])}}})}
function pxaTuft(g1,g2){return pxaCanvas(10,8,(P)=>{const bl=[[1,5,2],[3,7,4],[5,6,3],[7,7,4],[8,5,2]];bl.forEach(([x,h,l],i)=>{for(let k=0;k<l+1;k++)P(x+(k>l-2?(i%2?1:-1):0),7-k,k===l?g2:g1)})})}
function pxaFlower(c){return pxaCanvas(7,8,(P)=>{P(3,7,'#3a7a30');P(3,6,'#3a7a30');P(3,5,'#3a7a30');P(3,2,'#ffd447');for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]])P(3+dx,3+dy-0,c);P(3,3,'#ffd447')})}
// textura de suelo (alpha 0 donde no hay suelo plano)
function pxaLedge(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const st=(x%4===0||x%4===1);let c=st?'#8a4048':'#a2545a';if(y<2)c='#c88a7a';else if(y===2)c='#4b2430';if(y>=13)c=st?'#4b2430':'#6a3038';if(x===0||x===15)c='#4b2430';P(x,y,c)}})}
function pxaWaterTex(seed){return pxaCanvas(24,24,(P)=>{for(let y=0;y<24;y++)for(let x=0;x<24;x++){const g=pxaHash(Math.floor((x+seed*5)/4),y,17);let v=.9;if(g>.86)v=1;else if(g<.12)v=.74;if((y%8===3)&&((x+seed*7)%12<5)&&seed!==9)v=1;P(x,y,'#'+[v,v,v].map(q=>Math.round(Math.min(1,q)*255).toString(16).padStart(2,'0')).join(''))}})}
function pxaGround(th,rows,W,H,tp,bevel){bevel=bevel!==false;
 const S=18;
 return pxaCanvas(W*S,H*S,(P)=>{
  for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
   const ch=rows(tx,ty),kind=tp(ch);if(kind==='none')continue;
   const chk=(tx+ty)%2;let base=chk?th.a:th.b;
   if(kind==='mat')base=chk?'#ee8f8f':'#e68282';else if(kind==='path')base=chk?th.path:pxaShade(th.path,.96);else if(kind==='tall')base=chk?th.tall:pxaShade(th.tall,.94);
   for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const px=tx*S+x,py=ty*S+y,h=pxaHash(px,py,3);let c=base;
    
    if(kind==='grass'||kind==='tall'){const bx=pxaHash(tx,ty,7),by=pxaHash(tx,ty,9);
     if((x===Math.floor(bx*14)+1||x===Math.floor(bx*14)+2)&&y===Math.floor(by*10)+5)c=pxaShade(base,.72);
     if(x===Math.floor(bx*14)+1&&y===Math.floor(by*10)+4)c=pxaShade(base,.72);
     if(kind==='tall'){if((x+y*2+tx*3)%7===0&&y>2)c=pxaShade(base,.78);if((x*2+y+ty)%9===0&&y<13)c=pxaShade(base,1.16)}}
    if(kind==='deck2'){const ro=py%4;c=ro===3?'#cdae5e':ro===0?'#f7e8a4':'#efd98a'}
    else if(kind==='deck'){const ro=py%6;c=ro===5?'#a9863f':ro===0?'#f4e096':'#e8cf78';if((px+(Math.floor(py/6)%3)*8)%24===0)c='#a9863f'}
    else if(kind==='plank'){c='#f1eff7';const u=px+py,v=px-py+4000;if(u%18<2||v%18<2)c='#c9c3de';else if(u%18===2||v%18===2)c='#e4e0f0'}
    else if(false&&kind==='plank'){const row=Math.floor(y/6),off=((tx*3+ty*5+row*7)%4)*4+((row%2)*9);c=base;if(y%6===5)c=pxaShade(base,.9);else if((x+off)%18===0)c=pxaShade(base,.93);else if(h>.97)c=pxaShade(base,.97)}
    if(kind!=='plank'&&kind!=='deck'&&kind!=='deck2'){ // estilo PMD: zonas planas con trazos horizontales
     c=kind==='path'?th.path:kind==='tall'?th.tall:kind==='stone'?th.a:kind==='plank'?th.a:kind==='mat'?'#ee8f8f':base===th.a||base===th.b?th.a:base;
     if(kind==='grass'||kind==='tall'||kind==='path'||kind==='stone'||kind==='plank'||kind==='mat'){
      const g3=pxaHash(Math.floor(px/3),py,5),g2=pxaHash(Math.floor((px+1)/2),Math.floor(py/2),11);
      
      if(kind==='tall'){c=pxaShade(th.a,.9)}
     }
     if(kind==='grass'){const bx=pxaHash(tx,ty,7),by=pxaHash(tx,ty,9),ox=(ty%2)*4;
      for(const [qx,qy] of [[3+ox,4],[11+ox,12]]){if(((tx*7+ty*3+qx)%3)!==0)continue;if((x===qx&&y===qy)||(x===qx-1&&y===qy-1)||(x===qx+1&&y===qy-1))c='#3a8a34';if(x===qx&&y===qy-1)c='#9be07a'}
      if(by>.93){const fx=Math.floor(bx*6)+5,fy=Math.floor(by*5)+3;if((x===fx&&Math.abs(y-fy)<=1)||(y===fy&&Math.abs(x-fx)<=1))c=(x===fx&&y===fy)?'#ff9a4a':'#e0452f'}}
    }
    
    if(th.lunar&&(kind==='grass'||kind==='tall'||kind==='path')){c=base;const nn=pxaHash(px,py,41);if(nn>.94)c=pxaShade(base,1.2);else if(nn<.06)c=pxaShade(base,.8);
     if(pxaHash(tx,ty,61)>.6){const q1=pxaHash(tx,ty,63),q2=pxaHash(tx,ty,65),q3=pxaHash(tx,ty,67),ccx=6+Math.floor(q1*6),ccy=6+Math.floor(q2*6),rr=2.2+q3*2.6,ddx=x-ccx,ddy=(y-ccy)*1.35,dd=Math.sqrt(ddx*ddx+ddy*ddy);
      if(dd<rr-.9)c=pxaShade(base,.7);else if(dd<rr+.6)c=(ddx+ddy<0)?pxaShade(base,.55):pxaShade(base,1.3)}}
    if(false){if(y===S-1||x===S-1)c=pxaShade(base,.9)}
    if(false){if(x===0||y===0)c=pxaShade(c,1.1);else if(x===S-1||y===S-1)c=pxaShade(c,.9)}
    if(kind==='stone'&&th.kind==='cave'){const row=Math.floor(py/6),v=py%6,off=(row%2)*5+((row*5)%4),uu=(px+off)%10,cell=Math.floor((px+off)/10),ok=pxaHash(cell,row,13)>.12;
     if(ok){if(v===2&&uu<=6)c='#aeb08c';else if(v===1&&uu>=2&&uu<=4)c='#aeb08c';else if(v===3&&uu>=1&&uu<=4)c='#756d5b';else if(v===5&&uu>=7&&uu<=8&&pxaHash(cell,row,17)>.4)c='#a3a384'}}
    if(kind==='path'){const q=(px*5+py*3)%11;if(th.kind==='cave'){const h2=pxaHash(px>>1,py>>1,23);if(h2>.93)c='#ecd88a';else if(h2<.05)c='#c8ae55'}else if(q===0)c='#dcb85a';else if(q===5&&py%2===0)c='#fff2b4'}
    if(kind==='grass'||kind==='tall'){const nb=(dx,dy)=>{const X=tx+dx,Y=ty+dy;return X<0||Y<0||X>=W||Y>=H?null:tp(rows(X,Y))};
     if((y<2&&nb(0,-1)==='path')||(y>=S-2&&nb(0,1)==='path')||(x<2&&nb(-1,0)==='path')||(x>=S-2&&nb(1,0)==='path'))c='#a6e27e'}
    P(px,py,c)}}
 })}
// fondo pixelado (cielo en bandas con dither, nubes y cuadrícula suave)
function pxaEarth(){return pxaCanvas(40,40,(P)=>{const ER=19;for(let dy=-ER;dy<=ER;dy++)for(let dx=-ER;dx<=ER;dx++){const d=Math.sqrt(dx*dx+dy*dy);if(d>ER)continue;
  let c='#2d66c8';const lv=pxaHash(((dx+40)/5)|0,((dy+40)/5)|0,71),lv2=pxaHash(((dx+40)/3)|0,((dy+40)/3)|0,72);if(lv>.6&&lv2>.35)c=lv2>.7?'#8aa655':'#4f9a48';
  if(pxaHash((dx+40)>>1,(dy+40)>>2,73)>.84)c='#eef6ff';if(dy<-ER+6||dy>ER-6){if(pxaHash(dx>>1,dy,74)>.3)c='#e6f0fb'}
  if(dx*.8+dy*.6>6)c=pxaShade(c,dx*.8+dy*.6>12?.42:.62);if(d>ER-1.6)c='#8cc0ff';P(20+dx,20+dy,c)}})}
function pxaBackdrop(th,grid,noEarth){grid=grid!==false;
 const w=320,h=240,cave=th.kind==='cave',indoor=th.kind!=='out'&&!cave;
 return pxaCanvas(w,h,(P)=>{
  const c0=cave||indoor||th.night||th.lunar?th.sky[0]:'#43a5e6',c1=cave||indoor||th.night||th.lunar?th.sky[1]:'#a9defa',bands=6;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const f=y/h*bands,bi=Math.floor(f),fr=f-bi,dith=0;
   const k=Math.min(bands-1,bi+dith)/(bands-1);
   const a=pxaRGB(c0),b=pxaRGB(c1),m=a.map((v,i)=>Math.round(v+(b[i]-v)*(1-k)));
   P(x,y,'#'+m.map(v=>v.toString(16).padStart(2,'0')).join(''))}
  if(th.night||th.lunar){for(let i=0;i<(th.lunar?170:70);i++){const sx=(pxaHash(i,5,3)*w)|0,sy=(pxaHash(i,6,3)*h*.78)|0,big=pxaHash(i,7,3)>.86;P(sx,sy,i%5===0?'#ffe9b0':'#dfe8ff');if(big){P(sx+1,sy,'#aab8e8');P(sx-1,sy,'#aab8e8');P(sx,sy+1,'#aab8e8');P(sx,sy-1,'#aab8e8')}}
   if(th.lunar){if(!noEarth){const ec=pxaEarth(),ed=ec.getContext('2d').getImageData(0,0,40,40).data;for(let yy=0;yy<40;yy++)for(let xx=0;xx<40;xx++){const i=(yy*40+xx)*4;if(ed[i+3]>0)P(216+xx,26+yy,'#'+[ed[i],ed[i+1],ed[i+2]].map(v=>v.toString(16).padStart(2,'0')).join(''))}}}
   else for(let dy=-11;dy<=11;dy++)for(let dx=-11;dx<=11;dx++){const d2=dx*dx+dy*dy;if(d2<=110){const cx=dx+4,cy=dy+4;if(cx*cx+cy*cy>72)P(250+dx,40+dy,d2>92?'#cdb98a':'#fff1b8')}}}
  else if(!cave&&!indoor){for(let i=0;i<5;i++){const cx=24+i*68+(pxaHash(i,1,1)*28|0),cy=28+(pxaHash(i,2,1)*120|0);for(let dy=-6;dy<=6;dy++)for(let dx=-18;dx<=18;dx++){const e=(dx*dx)/324+(dy*dy)/36;if(e<=1&&!(dy>2&&Math.abs(dx)>12)){P(cx+dx,cy+dy,dy>=4?'#dbe8f2':'#ffffff')}}for(let dx=-10;dx<=10;dx++)for(let k=0;k<2;k++)P(cx+dx,cy-7-k,'#ffffff')}}
  else if(th.kind!=='pool'){for(let i=0;i<30;i++){P((pxaHash(i,3,2)*w)|0,(pxaHash(i,4,2)*h)|0,cave?'#aab8e8':'#8fa0c8')}}
  if(grid)for(let y=0;y<h;y+=20)for(let x=0;x<w;x++)P(x,y,pxaShade(c1,.975));
  if(grid)for(let x=0;x<w;x+=20)for(let y=0;y<h;y++)P(x,y,pxaShade(c1,.975));
 })}


/* ===== Laboratorio de Oak: muebles en pixel art (15 px por casilla) ===== */
function pxaLab(w,h,fn,ol){
 const c=pxaCanvas(w+2,h+2,(P)=>{
  const R=(x,y,ww,hh,col)=>{for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)P(x+1+i,y+1+j,col)};
  const D=(x,y,col)=>P(x+1,y+1,col);
  const C=(cx,cy,r,col)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r+r*.6)P(cx+1+i,cy+1+j,col)};
  fn(R,D,C,w,h)});
 const x=c.getContext('2d'),im=x.getImageData(0,0,c.width,c.height),d=im.data,W=c.width,H=c.height,o=pxaRGB(ol||'#3c4658'),res=new Uint8ClampedArray(d);
 const a=(i,j)=>i<0||j<0||i>=W||j>=H?0:d[(j*W+i)*4+3];
 for(let j=0;j<H;j++)for(let i=0;i<W;i++){if(a(i,j)===0&&(a(i-1,j)||a(i+1,j)||a(i,j-1)||a(i,j+1))){const k=(j*W+i)*4;res[k]=o[0];res[k+1]=o[1];res[k+2]=o[2];res[k+3]=255}}
 im.data.set(res);x.putImageData(im,0,0);return c}
const PXL={white:'#f6f7f9',lt:'#dfe4ea',md:'#b6bfca',dk:'#8d97a5',cream:'#ead29a',creamD:'#c9ae6e',blue:'#4aa3d9',teal:'#46c6c6',red:'#d8453a',redD:'#a8302a',wood:'#8a5a34'};
const PXL_BOOKS=['#d9772b','#3c9a4a','#6a4bb5','#2f5fb5','#d8453a','#e8c02f','#2aa6a0','#c04a8a'];
function pxaShelf(seed){return pxaLab(15,20,(R)=>{
 R(0,0,15,20,PXL.white);R(0,0,15,1,'#ffffff');R(14,1,1,19,PXL.lt);R(0,19,15,1,PXL.md);R(0,9,15,1,PXL.md);R(0,10,15,1,PXL.lt);
 for(const [y0,hh] of [[1,8],[11,8]]){let x=1;let k=0;while(x<13){const bw=1+((pxaHash(x,y0,seed)*2)|0),bh=hh-1-((pxaHash(x+3,y0,seed)*2)|0),col=PXL_BOOKS[(((pxaHash(x,y0+1,seed))*8)|0)%8];R(x,y0+hh-bh,bw,bh,col);R(x,y0+hh-bh,1,bh,pxaShade(col,1.2));x+=bw+(k%5===4?1:0);k++}}
 R(0,0,1,20,PXL.lt)})}
function pxaCabinet(){return pxaLab(15,32,(R)=>{
 R(0,0,15,32,PXL.white);R(0,0,15,1,'#ffffff');R(12,1,3,31,PXL.lt);R(0,31,15,1,PXL.md);
 R(2,3,5,12,PXL.blue);for(let i=0;i<3;i++){R(3,4+i*4,3,2,'#bfe6ff')}
 R(8,3,3,12,PXL.lt);R(2,19,6,7,'#2c3342');R(2,19,6,1,PXL.dk);R(10,20,1,5,PXL.md);R(0,16,15,1,PXL.md);R(1,28,3,2,PXL.red)})}
function pxaDesk(){return pxaLab(15,18,(R)=>{
 R(4,0,8,7,PXL.white);R(5,1,6,5,PXL.teal);R(5,1,6,1,'#9ff0f0');R(7,7,2,2,PXL.lt);R(5,9,6,1,PXL.md);
 R(0,10,15,2,PXL.cream);R(0,10,15,1,'#f6e6b8');R(1,12,13,6,PXL.cream);R(1,12,13,1,PXL.creamD);R(7,12,1,6,PXL.creamD);
 R(3,14,3,1,PXL.creamD);R(10,14,3,1,PXL.creamD)})}
function pxaMachine(){return pxaLab(30,34,(R,D,C)=>{
 C(15,10,9,PXL.red);R(5,10,21,4,PXL.red);for(let i=0;i<5;i++)D(10+i,4,'#ff8a7e');D(9,6,'#ff8a7e');
 R(6,13,19,3,PXL.white);R(7,16,17,6,'#7fd6ea');R(7,16,17,1,'#c9f2fb');R(11,17,1,5,'#5ab6cc');R(19,17,1,5,'#5ab6cc');
 R(4,22,23,10,PXL.white);R(4,22,23,1,'#ffffff');R(22,23,5,9,PXL.lt);R(4,31,23,1,PXL.md);R(8,25,1,6,PXL.md);R(14,25,1,6,PXL.md);R(20,25,1,6,PXL.md);R(2,28,4,4,PXL.white);R(25,28,4,4,PXL.lt)})}
function pxaLabTable(){return pxaLab(45,26,(R,D,C)=>{
 for(let y=0;y<9;y++){R(4+Math.round((8-y)*.35),y,37-Math.round((8-y)*.7),1,y===0?'#8fdc9a':'#5cb86a')}
 R(3,9,39,3,PXL.white);R(3,11,39,1,PXL.md);R(4,12,3,13,PXL.white);R(5,12,1,13,PXL.lt);R(38,12,3,13,PXL.lt);R(39,12,1,13,PXL.md);R(8,12,29,1,PXL.lt);
 for(const bx of [13,22,31]){C(bx,5,3,PXL.white);for(let i=-3;i<=3;i++)for(let j=-3;j<=-1;j++)if(i*i+j*j<=11)P0(R,bx+i,5+j,PXL.red);R(bx-3,5,7,1,'#2c3342');D(bx,5,PXL.white)}
 })}
function P0(R,x,y,c){R(x,y,1,1,c)}
function pxaPlant(){return pxaLab(11,17,(R,D,C)=>{
 R(2,9,7,1,'#a56a3c');R(2,10,7,6,PXL.wood);R(3,15,5,1,'#5e3a1f');R(3,10,1,5,'#a56a3c');
 C(5,4,3,'#3d9a48');C(2,6,2,'#4cb05a');C(8,6,2,'#2f8a3e');C(5,2,2,'#6cc873');R(5,7,1,3,'#2f7a38')})}
function pxaWindow(){return pxaLab(15,13,(R)=>{R(0,0,15,13,PXL.white);R(1,1,13,5,'#36508f');R(1,7,13,5,'#36508f');R(1,1,13,1,'#6c8cd0');R(1,7,13,1,'#6c8cd0');R(0,6,15,1,PXL.md)})}
function pxaPoster(){return pxaLab(11,14,(R)=>{R(0,0,11,14,'#fbf8e8');R(1,1,9,12,'#fffdf2');for(let i=0;i<6;i++)R(2,3+i*2,i%3===2?4:7,1,'#8a8a78');R(2,1,5,1,'#4a6a9a')})}
function pxaVent(){return pxaLab(9,11,(R)=>{R(0,0,9,11,PXL.white);R(1,2,7,1,'#444c5c');R(1,5,7,1,'#444c5c');R(1,8,7,1,'#444c5c');R(8,0,1,11,PXL.lt)})}

const PXS=1,PXB=1;
/* ===== Post-proceso "pixel art": paleta reducida + contorno oscuro por profundidad ===== */
function pxRun(O,renderer,scene,cam,edge,lv,overlay){
 const T=window.THREE,sz=renderer.getDrawingBufferSize(new T.Vector2());
 if(!O.px){
  const rt=new T.WebGLRenderTarget(sz.x,sz.y,{minFilter:T.NearestFilter,magFilter:T.NearestFilter,type:T.HalfFloatType,depthTexture:new T.DepthTexture(sz.x,sz.y)});
  const mat=new T.ShaderMaterial({uniforms:{tC:{value:null},tD:{value:null},px:{value:new T.Vector2(1/sz.x,1/sz.y)},zn:{value:cam.near},zf:{value:cam.far},lv:{value:lv},edge:{value:edge},ua:{value:overlay?1:0},nt:{value:new T.Vector3(1,1,1)}},
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
   fragmentShader:`uniform sampler2D tC,tD;uniform vec2 px;uniform vec3 nt;uniform float zn,zf,lv,edge,ua;varying vec2 vUv;
float lin(float d){float z=d*2.-1.;return 2.*zn*zf/(zf+zn-z*(zf-zn));}
void main(){vec4 c=texture2D(tC,vUv);float d0=lin(texture2D(tD,vUv).x);float e=0.;
 vec2 o[4];o[0]=vec2(px.x,0.);o[1]=vec2(-px.x,0.);o[2]=vec2(0.,px.y);o[3]=vec2(0.,-px.y);
 for(int i=0;i<4;i++){float dn=lin(texture2D(tD,vUv+o[i]).x);if(dn-d0>edge)e=1.;}
 gl_FragColor=vec4(c.rgb,1.);
 gl_FragColor.rgb=pow(clamp(gl_FragColor.rgb*1.12,0.,1.),vec3(1./2.2));
 {float l=dot(gl_FragColor.rgb,vec3(.3,.59,.11));gl_FragColor.rgb=clamp((mix(vec3(l),gl_FragColor.rgb,1.12)-.5)*1.1+.5,0.,1.);}
 gl_FragColor.rgb*=nt;
 vec3 q=floor(gl_FragColor.rgb*lv+.5)/lv;if(e>0.)q*=.4;gl_FragColor=(ua>.5&&c.a<.01)?vec4(0.):vec4(q,1.);}`,depthTest:false,depthWrite:false,toneMapped:true});
  const quad=new T.Mesh(new T.PlaneGeometry(2,2),mat);quad.frustumCulled=false;
  const qs=new T.Scene();qs.add(quad);
  O.px={rt,mat,qs,qc:new T.OrthographicCamera(-1,1,1,-1,0,1)};
 }
 const P=O.px;
 if(P.rt.width!==sz.x||P.rt.height!==sz.y){P.rt.setSize(sz.x,sz.y);P.mat.uniforms.px.value.set(1/sz.x,1/sz.y)}
 P.mat.uniforms.zn.value=cam.near;P.mat.uniforms.zf.value=cam.far;{const n=O.nt||[1,1,1];P.mat.uniforms.nt.value.set(n[0],n[1],n[2])}
 const lay=cam.layers.mask;
 cam.layers.set(0);renderer.setRenderTarget(P.rt);renderer.clear();renderer.render(scene,cam);renderer.setRenderTarget(null);
 P.mat.uniforms.tC.value=P.rt.texture;P.mat.uniforms.tD.value=P.rt.depthTexture;
 renderer.render(P.qs,P.qc);
 if(overlay){const ac=renderer.autoClear;renderer.autoClear=false;renderer.clearDepth();
  const om=P.dm||(P.dm=new window.THREE.MeshBasicMaterial({colorWrite:false}));cam.layers.set(0);const ov=scene.overrideMaterial;scene.overrideMaterial=om;const hid=O.fade?[...O.fade.map].filter(([m,s])=>s.a<.9).map(x=>x[0]):[];hid.forEach(m=>m.visible=false);renderer.render(scene,cam);hid.forEach(m=>m.visible=true);scene.overrideMaterial=ov;
  cam.layers.set(1);renderer.render(scene,cam);renderer.autoClear=ac}
 cam.layers.mask=lay;
}

function r3init(){
 if(R3||R3fail||!window.THREE)return;
 const T=window.THREE,wrap=canvas.parentElement;
 const camStep=d=>{R3.yawT+=d};
 const zoomBy=f=>{R3.zmT=Math.min(1.35,Math.max(.55,(R3.zmT||1)*f))};
 wrap.addEventListener('wheel',e=>{if(e.target.closest&&e.target.closest('.camCtl,#modal,.modalBox'))return;if(!(e.target===canvas||e.target.tagName==='CANVAS'))return;e.preventDefault();zoomBy(e.deltaY>0?1.12:1/1.12)},{passive:false});
 let pd=0;wrap.addEventListener('touchstart',e=>{if(e.touches.length===2)pd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});
 wrap.addEventListener('touchmove',e=>{if(e.touches.length===2&&pd){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(d>0){R3.zmT=Math.min(1.35,Math.max(.55,(R3.zmT||1)*pd/d));R3.zm=R3.zmT}pd=d;e.preventDefault()}},{passive:false});
 wrap.addEventListener('touchend',()=>{pd=0},{passive:true});
 // v650: deslizar un dedo hacia un lado gira la cámara 90° (el tablero sigue al dedo). Sin límite de tiempo; vale empezar sobre cualquier parte del tablero que no sea un botón o un panel.
 {let sw=null,swUsed=false;const NO='button,input,select,textarea,.camCtl,.battleMenu,.fsMenu,.cinematic,.gameBag,.captureScene,.expScene,.shopOverlay,.managerOverlay,.campaignOverlay,#modal,.titleOverlay,.revivePicker';
  const onBoard=t=>!!t&&wrap.contains(t)&&!(t.closest&&t.closest(NO));
  const start=(x,y,tg)=>{swUsed=false;sw=onBoard(tg)?{x,y}:null};
  const move=(x,y,ev)=>{if(!sw)return;const dx=x-sw.x,dy=y-sw.y,lim=Math.max(36,Math.min(80,wrap.clientWidth*.08));
   if(Math.abs(dx)>lim&&Math.abs(dx)>Math.abs(dy)*1.2){camStep(dx<0?Math.PI/2:-Math.PI/2);swUsed=true;sw=null;if(ev&&ev.cancelable)ev.preventDefault()}};
  wrap.addEventListener('touchstart',e=>{if(e.touches.length!==1){sw=null;return}start(e.touches[0].clientX,e.touches[0].clientY,e.target)},{passive:true,capture:true});
  wrap.addEventListener('touchmove',e=>{if(e.touches.length!==1){sw=null;return}move(e.touches[0].clientX,e.touches[0].clientY,e)},{passive:false,capture:true});
  wrap.addEventListener('touchend',e=>{if(sw&&e.changedTouches&&e.changedTouches[0])move(e.changedTouches[0].clientX,e.changedTouches[0].clientY,null);sw=null},{passive:true,capture:true});
  wrap.addEventListener('touchcancel',()=>{sw=null},{passive:true,capture:true});
  // tras un deslizamiento, no tomar el toque como selección de casilla
  wrap.addEventListener('click',e=>{if(swUsed){swUsed=false;e.stopPropagation();e.preventDefault()}},true)}
 const ctl=document.createElement('div');ctl.className='camCtl';ctl.setAttribute('aria-label','Girar cámara');
 [['↶','Girar cámara a la izquierda (Q)',()=>camStep(-Math.PI/2)],['⟲','Restablecer cámara (R)',()=>{R3.yawT=Math.PI/4+Math.round((R3.yawT-Math.PI/4)/(2*Math.PI))*2*Math.PI;R3.zmT=1}],['↷','Girar cámara a la derecha (E)',()=>camStep(Math.PI/2)],['＋','Acercar (rueda del ratón o +)',()=>zoomBy(1/1.25)],['－','Alejar (rueda del ratón o -)',()=>zoomBy(1.25)]].forEach(([t,ti,fn])=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.title=ti;b.setAttribute('aria-label',ti);b.addEventListener('click',e=>{e.stopPropagation();fn()});b.addEventListener('pointerdown',e=>e.stopPropagation());ctl.append(b)});
 wrap.append(ctl);
 const FS_IN='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',FS_OUT='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
 const fsb=document.createElement('button');fsb.type='button';fsb.className='fsBtn';fsb.innerHTML=FS_IN;fsb.title='Pantalla completa (F)';fsb.setAttribute('aria-label','Pantalla completa');
 const isFS=()=>document.fullscreenElement===wrap||wrap.classList.contains('fakeFS');
 // v651: en el móvil solo se usa la pantalla de juego: el tablero ocupa siempre toda la pantalla y el resto de menús queda en ☰
 const MOB=()=>matchMedia('(pointer:coarse)').matches&&Math.min(innerWidth,innerHeight)<=820;
 const nativeFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
 const FSOV=['modal','shopOverlay','dexOverlay','managerOverlay','campaignOverlay','titleOverlay','helpOv'],fsHomeOv=new Map();
 const moveOv=on=>{for(const id of FSOV){const el=document.getElementById(id);if(!el)continue;if(on){if(el.parentNode!==wrap){fsHomeOv.set(id,{p:el.parentNode,n:el.nextSibling});wrap.appendChild(el)}}else{const h=fsHomeOv.get(id);if(h&&el.parentNode===wrap){h.p.insertBefore(el,h.n&&h.n.parentNode===h.p?h.n:null)}fsHomeOv.delete(id)}}};
 const sync=()=>{const on=isFS();moveOv(on);const ic=MOB()?nativeFS():on;fsb.innerHTML=ic?FS_OUT:FS_IN;fsb.setAttribute('aria-label',ic?'Salir de pantalla completa':'Pantalla completa');fsb.title=ic?'Salir de pantalla completa (F)':'Pantalla completa (F)';document.body.classList.toggle('inFS',on);document.body.classList.toggle('mobGame',on&&MOB())};
 let fsHome=null,fsDocReq=false;
 const enterFake=()=>{if(wrap.classList.contains('fakeFS'))return;fsHome={p:wrap.parentNode,n:wrap.nextSibling};document.body.appendChild(wrap);wrap.classList.add('fakeFS');sync()};
 const leaveFake=()=>{if(!wrap.classList.contains('fakeFS'))return;fsDocReq=false;if(document.fullscreenElement&&document.exitFullscreen)try{document.exitFullscreen()}catch(e){}wrap.classList.remove('fakeFS');if(fsHome&&fsHome.p)fsHome.p.insertBefore(wrap,fsHome.n&&fsHome.n.parentNode===fsHome.p?fsHome.n:null);fsHome=null;sync()};
 const toggleFS=()=>{
  if(MOB()){ // en el móvil el tablero ya ocupa la pantalla: el botón solo pone o quita la pantalla completa del navegador
   enterFake();if(nativeFS()){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}}else{fsDocReq=true;const de=document.documentElement,rd=de.requestFullscreen||de.webkitRequestFullscreen;try{const r=rd&&rd.call(de,{navigationUI:'hide'});r&&r.catch&&r.catch(()=>{})}catch(e){}}setTimeout(sync,300);return}
  if(isFS()){if(document.fullscreenElement)document.exitFullscreen&&document.exitFullscreen();leaveFake();sync();return}
  // Táctil (Android/iOS): el tablero ocupa la pantalla con CSS (fakeFS) y la pantalla completa nativa se pide sobre toda la página.
  // Con el contenedor del tablero como elemento a pantalla completa, Chrome en Android dejaba el lienzo WebGL en negro.
  if(matchMedia('(pointer:coarse)').matches){enterFake();fsDocReq=true;const de=document.documentElement,rd=de.requestFullscreen||de.webkitRequestFullscreen;try{const r=rd&&rd.call(de,{navigationUI:'hide'});r&&r.catch&&r.catch(()=>{})}catch(e){}return}
  const rq=wrap.requestFullscreen||wrap.webkitRequestFullscreen;
  if(rq){let r;try{r=rq.call(wrap)}catch(e){enterFake();return}Promise.resolve(r).catch(()=>enterFake())}else enterFake();
 };
 fsb.addEventListener('click',e=>{e.stopPropagation();toggleFS()});fsb.addEventListener('pointerdown',e=>e.stopPropagation());
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&wrap.classList.contains('fakeFS')&&fsDocReq&&!MOB())leaveFake();sync()});
 wrap.append(fsb);
 {const mobOn=()=>{if(MOB())enterFake();else if(wrap.classList.contains('fakeFS')&&!nativeFS()&&!fsDocReq)leaveFake()};mobOn();addEventListener('resize',()=>setTimeout(mobOn,150));addEventListener('orientationchange',()=>setTimeout(mobOn,300))}
 // v650: menú del juego dentro de la pantalla completa (los botones de la barra superior quedan fuera de la vista)
 {const mb=document.createElement('button');mb.type='button';mb.className='fsMenuBtn';mb.textContent='☰';mb.title='Menú del juego (M)';mb.setAttribute('aria-label','Menú del juego');
  const pan=document.createElement('div');pan.className='fsMenu';pan.hidden=true;pan.setAttribute('role','dialog');pan.setAttribute('aria-label','Menú del juego');
  pan.innerHTML='<div class="fsMenuBox"><div class="fsMenuHead"><span>MENÚ DEL JUEGO</span><button type="button" data-a="close">✕ Volver</button></div><div class="fsMenuChips"></div><div class="fsMenuGrid">'+
   [['openCampaign','🗺️ Mapa de Kanto'],['openTeam','🐾 Equipo'],['openDex','📕 Pokédex'],['quickSave','💾 Guardar'],['openHelp','❓ Cómo jugar'],['endTurn','▶ Terminar fase','main'],['backTitle','☰ Menú principal'],['abandonBtn','🏳️ Abandonar','warn'],['__exit','✕ Salir de pantalla completa','wide']].map(([id,t,c])=>'<button type="button" data-a="'+id+'"'+(c?' class="'+c+'"':'')+'>'+t+'</button>').join('')+'</div></div>';
  const vis=el=>!!el&&!el.hidden&&el.style.display!=='none'&&!el.disabled;
  const fill=()=>{pan.querySelector('.fsMenuChips').innerHTML=['moneyChip','medalChip','phaseChip'].map(id=>{const e=document.getElementById(id);return e&&e.textContent.trim()?'<span>'+e.textContent.trim().replace(/[<>&]/g,'')+'</span>':''}).join('');
   for(const b of pan.querySelectorAll('.fsMenuGrid button')){const id=b.dataset.a;if(id==='__exit'){b.textContent=(MOB()?nativeFS():isFS())?'✕ Salir de pantalla completa':'⛶ Pantalla completa';continue}b.hidden=!vis(document.getElementById(id))}};
  const close=()=>{pan.hidden=true};
  mb.addEventListener('click',e=>{e.stopPropagation();if(pan.hidden){fill();pan.hidden=false}else close()});mb.addEventListener('pointerdown',e=>e.stopPropagation());
  pan.addEventListener('pointerdown',e=>e.stopPropagation());
  pan.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(!b){if(e.target===pan)close();return}const a=b.dataset.a;close();if(a==='close')return;if(a==='__exit'){toggleFS();return}const t=document.getElementById(a);if(t)t.click()});
  document.addEventListener('fullscreenchange',()=>{if(!isFS())close()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!pan.hidden){close();e.stopImmediatePropagation()}},true);
  wrap.append(mb,pan)}
 // v650: tutorial interactivo de gestos la primera vez en un teléfono (se hace cada gesto sobre el tablero real)
 {const KEY='pt_gestureHint_v1',touch=matchMedia('(pointer:coarse)').matches;let seen=true;try{seen=!!localStorage.getItem(KEY)}catch(e){}
  // v652: primero la cámara (acercar y girar): de cerca es mucho más fácil tocar las casillas desde el teléfono
  const STEPS=[{ico:'<span class="gcPinch">🤏</span>',t:'Acerca la cámara',d:'Separa dos dedos sobre el tablero. De cerca es más fácil tocar las casillas. ⟲ la deja como al inicio.',ok:o=>(R3.zmT||1)<o.zm-.04},
   {ico:'<span class="gcSwipe">👆</span>',t:'Gira la cámara',d:'Desliza un dedo hacia un lado sobre el tablero.',ok:o=>Math.abs(R3.yawT-o.yaw)>.5},
   {ico:'<span class="gcMenuI">☰</span>',t:'Toca ☰ arriba a la derecha',d:'ahí están el mapa, el equipo, guardar…',ok:()=>{const m=wrap.querySelector('.fsMenu');return !!m&&!m.hidden},hl:'.fsMenuBtn'}];
  const run=()=>{const h=$('helpOv');if((h&&!h.hidden)||!$('titleOverlay').hidden||!wrap.offsetWidth){setTimeout(run,800);return}
   if(wrap.querySelector('.gCoach:not(.mcCoach)'))return;
   const c=document.createElement('div');c.className='gCoach';c.setAttribute('role','status');c.setAttribute('aria-live','polite');wrap.append(c);
   let k=0,base=null,timer=0,hl=null;
   const finish=()=>{window.__gcPending=false;clearInterval(timer);if(hl)hl.classList.remove('gcPulse');c.remove();try{localStorage.setItem(KEY,'1')}catch(e){}if(window.__helpAfterGestures){window.__helpAfterGestures=false;setTimeout(()=>window.__showHelpOnce&&window.__showHelpOnce(),300)}};
   const draw=()=>{if(hl){hl.classList.remove('gcPulse');hl=null}
    if(k>=STEPS.length){c.innerHTML='<div class="gcBox gcDone"><div class="gcIco">✨</div><div class="gcTxt"><b>¡Listo!</b><small>Ahora, a combatir…</small></div></div>';setTimeout(finish,1800);clearInterval(timer);return}
    const st=STEPS[k];base={yaw:R3.yawT,zm:R3.zmT||1};
    c.innerHTML='<div class="gcBox"><div class="gcIco">'+st.ico+'</div><div class="gcTxt"><b>'+st.t+'</b><small>'+st.d+'</small><div class="gcDots">'+STEPS.map((_,i)=>'<i class="'+(i<k?'ok':i===k?'on':'')+'"></i>').join('')+'</div></div><button type="button" class="gcSkip">Saltar</button></div>';
    c.querySelector('.gcSkip').onclick=e=>{e.stopPropagation();finish()};
    if(st.hl){hl=wrap.querySelector(st.hl);if(hl)hl.classList.add('gcPulse')}};
   c.addEventListener('pointerdown',e=>e.stopPropagation());
   const tick=()=>{const st=STEPS[k];if(st&&st.ok(base)){const bx=c.querySelector('.gcBox');if(bx)bx.classList.add('gcOk');k++;clearInterval(timer);setTimeout(()=>{if(!c.isConnected)return;draw();if(k<STEPS.length)timer=setInterval(tick,250)},700)}};
   draw();timer=setInterval(tick,250)};
  // v652: en el móvil se enseña al empezar cada partida nueva (lo lanza __tutStart), antes del tutorial de combate
  window.__gestureCoach=()=>{if(touch){window.__gcPending=true;setTimeout(run,600)}}}
 addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;if(e.key.toLowerCase()==='f'){toggleFS();e.preventDefault()}else if(e.key==='Escape'&&wrap.classList.contains('fakeFS')&&!MOB())leaveFake()});
 addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'||tg==='SELECT')return;const k=e.key.toLowerCase();if(k==='q')camStep(-Math.PI/2);else if(k==='e')camStep(Math.PI/2);else if(k==='r'){R3.yawT=Math.PI/4+Math.round((R3.yawT-Math.PI/4)/(2*Math.PI))*2*Math.PI;R3.zmT=1}else if(k==='+'||k==='=')zoomBy(1/1.25);else if(k==='-'||k==='_')zoomBy(1.25)});
 const cv=document.createElement('canvas');cv.id='map3d';cv.setAttribute('aria-label','Tablero táctico 3D');wrap.insertBefore(cv,canvas.nextSibling);
 let renderer;try{renderer=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:true,powerPreference:'high-performance'})}catch(e){cv.remove();R3fail=true;console.warn('WebGL no disponible: se usa el tablero 2D.');return}
 renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
 const scene=new T.Scene(),cam=new T.PerspectiveCamera(12,1.2,20,260);
 const hemi=new T.HemisphereLight(0xffffff,0x888888,.85);scene.add(hemi);
 const sun=new T.DirectionalLight(0xffffff,2);sun.position.set(-5,13,6);sun.target.position.set(W/2,0,H/2);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:9,bottom:-9,near:1,far:40});sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;
 scene.add(sun,sun.target);
 const rim=new T.DirectionalLight(0x9ec9ff,.5);rim.position.set(8,6,-8);scene.add(rim);
 const decalTex=new T.CanvasTexture(canvas);decalTex.colorSpace=T.SRGBColorSpace;decalTex.anisotropy=8;decalTex.minFilter=T.LinearFilter;
 const decal=new T.Mesh(new T.PlaneGeometry(W,H),new T.MeshBasicMaterial({map:decalTex,transparent:true,depthWrite:false,toneMapped:false}));
 decal.rotation.x=-Math.PI/2;decal.position.set(W/2,.05,H/2);decal.renderOrder=5;scene.add(decal);
 const stageGroup=new T.Group();scene.add(stageGroup);
 const unitGroup=new T.Group();scene.add(unitGroup);
 const ray=new T.Raycaster(),ground=new T.Plane(new T.Vector3(0,1,0),0),v3=new T.Vector3(),ndc=new T.Vector2();
 R3={yaw:Math.PI/4,yawT:Math.PI/4,T,wrap,cv,renderer,scene,cam,hemi,sun,rim,decalTex,stageGroup,unitGroup,ray,ground,v3,ndc,sig:'',anim:{water:[],grass:[],motes:null},units:new Map(),mouse:{x:0,y:0},shake:0,size:{w:0,h:0},mats:new Map()};
 wrap.classList.add('r3d');
 const resize=()=>{const r=wrap.getBoundingClientRect(),w=Math.max(200,Math.round(r.width)),h=Math.max(160,Math.round(r.height));if(R3.size.w===w&&R3.size.h===h)return;R3.size={w,h};renderer.setPixelRatio(1/PXS);renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};
 new ResizeObserver(resize).observe(wrap);resize();
 const reResize=()=>{R3.size={w:0,h:0};resize()};document.addEventListener('fullscreenchange',()=>{reResize();setTimeout(reResize,250);setTimeout(reResize,800)});addEventListener('resize',()=>setTimeout(reResize,60));
 cv.addEventListener('webglcontextlost',()=>{R3.lost=true;console.warn('Contexto WebGL del tablero perdido');setTimeout(()=>{if(R3.lost)gameErr('Tablero 3D (v653)','el teléfono liberó el contexto gráfico del tablero y no lo devolvió')},2000)});cv.addEventListener('webglcontextrestored',()=>{R3.lost=false;R3.sig='';reResize()});
 // Ratón: se lanza un rayo contra el suelo y se reenvía como evento de casilla al lienzo 2D oculto, que conserva toda la lógica original.
 const touchSnap=ev=>{if(!(ev.pointerType==='touch'||matchMedia('(pointer:coarse)').matches)||typeof units==='undefined')return null;const r=cv.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top,P=(x,y,z)=>{const p=new T.Vector3(x,y,z).project(cam);return [(p.x+1)/2*r.width,(1-p.y)/2*r.height]};let best=null,bd=1e9;for(const u of units){if(!(u.hp>0)||u.x<0)continue;const fy=(R3.elev&&R3.elev.has(u.x+','+u.y))?R3.eh:0,f=P(u.x+.5,fy,u.y+.5),hd=P(u.x+.5,fy+1.15,u.y+.5),b=P(u.x+1.5,fy,u.y+.5),cs=Math.hypot(f[0]-b[0],f[1]-b[1]),dx=Math.abs(px-f[0]);
  // solo se "imanta" al Pokémon si el toque cae sobre su cuerpo (entre la cabeza y los pies); un toque por delante de los pies es para la casilla de delante
  if(dx<cs*.42&&py>hd[1]-cs*.15&&py<f[1]+cs*.12){const d=Math.hypot(px-f[0],py-(f[1]+hd[1])/2);if(d<bd){bd=d;best={x:u.x,y:u.y}}}}return best};
 const toCell=ev=>{const sn=touchSnap(ev);if(sn)return sn;const r=cv.getBoundingClientRect();ndc.set(((ev.clientX-r.left)/r.width)*2-1,-((ev.clientY-r.top)/r.height)*2+1);R3.mouse.x=ndc.x;R3.mouse.y=ndc.y;ray.setFromCamera(ndc,cam);if(R3.elev&&R3.elev.size){const hp=new T.Plane(new T.Vector3(0,1,0),-R3.eh),v4=new T.Vector3();if(ray.ray.intersectPlane(hp,v4)&&R3.elev.has(Math.floor(v4.x)+','+Math.floor(v4.z)))return {x:Math.floor(v4.x),y:Math.floor(v4.z)}}if(!ray.ray.intersectPlane(ground,v3))return null;return {x:Math.floor(v3.x),y:Math.floor(v3.z)}};
 const fwd=(type,c,ev)=>{const r=canvas.getBoundingClientRect(),cx=r.left+((c.x+.5)/W)*r.width,cy=r.top+((c.y+.5)/H)*r.height;const o={clientX:cx,clientY:cy,bubbles:true,button:0,pointerType:ev.pointerType||'mouse'};canvas.dispatchEvent(type==='click'?new MouseEvent('click',o):new PointerEvent(type,o))};
 cv.addEventListener('pointermove',ev=>{const c=toCell(ev);if(c)fwd('pointermove',c,ev)});
 cv.addEventListener('pointerleave',ev=>{R3.mouse.x=0;R3.mouse.y=0;canvas.dispatchEvent(new PointerEvent('pointerleave',{bubbles:true}))});
 cv.addEventListener('click',ev=>{const c=toCell(ev);if(c)fwd('click',c,ev)});
 window.__r3d=true;window.__R3=R3;
}
function r3Tree3D(T,g,cone,x,z,sc,rot){const G=new T.Group(),m=(geo,c,px,py,pz,sx,sy,sz,ry)=>{const q=new T.Mesh(geo,r3mat(c));q.position.set(px,py,pz);q.scale.set(sx||1,sy||1,sz||1);if(ry)q.rotation.y=ry;q.castShadow=true;q.receiveShadow=true;G.add(q);return q};
  // sombra al pie (verde oscuro con borde turquesa)
  const sh=new T.Mesh(new T.CircleGeometry(.5,18),new T.MeshBasicMaterial({color:0x2a6a1f,transparent:true,opacity:.75,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.012;sh.scale.set(1,.8,1);G.add(sh);
  const rim=new T.Mesh(new T.RingGeometry(.5,.58,18),new T.MeshBasicMaterial({color:0x1fa07a,transparent:true,opacity:.65,depthWrite:false}));rim.rotation.x=-Math.PI/2;rim.position.y=.011;rim.scale.set(1,.8,1);G.add(rim);
  if(cone){m(new T.CylinderGeometry(.09,.12,.3,6),'#6a5a5c',0,.15,0);
   [[.36,.46,.62,'#4aa83e'],[.62,.36,.56,'#62c050'],[.88,.27,.5,'#98e070'],[1.1,.17,.42,'#c8fca0']].forEach(([y,r,h,c],i)=>m(new T.ConeGeometry(r,h,8),c,0,y+h/2-.1,0,1,1,1,i*.4))}
  else{m(new T.CylinderGeometry(.1,.16,.34,6),'#7a5a30',0,.17,0);
   m(new T.IcosahedronGeometry(.52,1),'#5a7f1f',0,.5,0,1.05,.72,1.05,rot);m(new T.IcosahedronGeometry(.42,1),'#6c9626',0,.82,0,1,.74,1,rot+.5);m(new T.IcosahedronGeometry(.3,1),'#82ad32',0,1.1,0,1,.78,1,rot+1);m(new T.IcosahedronGeometry(.16,1),'#96c240',-.03,1.26,-.02,1,.7,1,rot)}
  G.scale.setScalar(sc);G.position.set(x,0,z);g.add(G);return G}
function r3Grass(T,g,x,z,sd,anim){const G=new T.Group();
 if(!r3Grass.geo){const pr=[[0,0],[.08,.04],[.15,.22],[.17,.5],[.14,.74],[.08,.92],[0,1]].map(([r,y])=>new T.Vector2(r,y)),geo=new T.LatheGeometry(pr,10),pos=geo.attributes.position,col=new Float32Array(pos.count*3),B=[['#2a5a10',0],['#3a9a30',.18],['#40b088',.62],['#a0e0c0',.86]].map(([c,t])=>[new T.Color(c),t]);
  for(let k=0;k<pos.count;k++){const t=pos.getY(k);let c=B[0][0];for(const [cc,tt] of B)if(t>=tt)c=cc;col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b}
  geo.setAttribute('color',new T.BufferAttribute(col,3));geo.scale(1,1,.3);r3Grass.geo=geo;r3Grass.mat=new T.MeshBasicMaterial({vertexColors:true,toneMapped:false})}
 const om=r3Grass.om||(r3Grass.om=new T.MeshBasicMaterial({color:0x1d4a0c,side:T.BackSide,toneMapped:false})),add=(yaw,lean,len,wd,ry)=>{const m=new T.Mesh(r3Grass.geo,r3Grass.mat),o=new T.Mesh(r3Grass.geo,om);for(const q of [m,o]){q.rotation.order='YXZ';q.rotation.y=yaw;q.rotation.x=lean;q.position.set(Math.sin(yaw)*ry,0,Math.cos(yaw)*ry)}m.scale.set(wd,len,1);o.scale.set(wd*1.28,len*1.05,1.9);G.add(o,m)};
 for(let k=0;k<7;k++)add(k*.897+sd*.37,.75,.9,.85,.05);
 for(let k=0;k<3;k++)add(k*2.094+.5+sd*.3,.34,1.0,.8,.02);
 add(0,.06,.8,.95,0);
 const base=new T.Mesh(new T.CircleGeometry(.36,12),new T.MeshBasicMaterial({color:0x1b4f27,transparent:true,opacity:.55,depthWrite:false}));base.rotation.x=-Math.PI/2;base.position.y=.015;G.add(base);
 G.scale.setScalar(.72);G.position.set(x,0,z);G.userData.ph=sd;g.add(G);if(anim)anim.push(G);return G}
function r3Bush3D(T,g,x,z,sc,sd){const G=new T.Group(),m=(r,c,px,py,pz,sy)=>{const q=new T.Mesh(new T.IcosahedronGeometry(r,1),r3mat(c));q.position.set(px,py,pz);q.scale.set(1.15,sy||.8,1);q.castShadow=true;q.receiveShadow=true;G.add(q);return q};
 m(.5,'#3f8f3a',0,.38,0);m(.38,'#4fa845',-.42,.3,.08);m(.36,'#4fa845',.44,.28,-.04);m(.3,'#62c058',.05,.62,.04,.7);
 const sh=new T.Mesh(new T.CircleGeometry(.75,16),new T.MeshBasicMaterial({color:0x1b4f27,transparent:true,opacity:.45,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.012;sh.scale.set(1,.7,1);G.add(sh);
 G.rotation.y=sd;G.scale.setScalar(sc);G.position.set(x,0,z);g.add(G);return G}
function r3mat(color,opts){const k=color+JSON.stringify(opts||{});let m=R3.mats.get(k);if(!m){m=new R3.T.MeshStandardMaterial(Object.assign({color,roughness:.88,metalness:0,flatShading:true},opts||{}));R3.mats.set(k,m)}return m}
function r3build(){
 const T=R3.T,g=R3.stageGroup,th=stageThemeN(stageId);R3.night=!!th.night;
 while(g.children.length){const c=g.children.pop();c.traverse(o=>{if(o.geometry&&!o.userData.shared)o.geometry.dispose()})}
 R3.anim={water:[],grass:[],motes:null};R3.mats.forEach(m=>m.dispose());R3.mats.clear();
 const rnd=(x,y,k=0)=>{const s=Math.sin(x*127.1+y*311.7+k*74.7)*43758.5453;return s-Math.floor(s)};
 const add=(mesh,x,y,z,cast=true,recv=true)=>{mesh.position.set(x,y,z);mesh.castShadow=cast;mesh.receiveShadow=recv;g.add(mesh);return mesh};
 const box=(w,h,d,c,o)=>new T.Mesh(new T.BoxGeometry(w,h,d),r3mat(c,o));
 const cone=(r,h,s,c)=>new T.Mesh(new T.ConeGeometry(r,h,s),r3mat(c));
 const cyl=(r1,r2,h,s,c)=>new T.Mesh(new T.CylinderGeometry(r1,r2,h,s),r3mat(c));
 // base tipo maqueta
 {const tc=document.createElement('canvas');tc.width=tc.height=32;const q=tc.getContext('2d');const ec=th.kind==='out'?th.earth:shade(th.earth,1.7);q.fillStyle=ec;q.fillRect(0,0,32,32);q.fillStyle=shade(ec,.82);for(let r=0;r<4;r++){q.fillRect(0,r*8+7,32,1);for(let c=0;c<2;c++)q.fillRect(((r%2)*8+c*16)%32,r*8,1,7)}q.fillStyle=shade(ec,1.18);for(let r=0;r<4;r++)q.fillRect(1+(r%2)*8,r*8+1,5,1);
  const bt=new T.CanvasTexture(tc);bt.colorSpace=T.SRGBColorSpace;bt.wrapS=bt.wrapT=T.RepeatWrapping;bt.repeat.set((W+.7)/1.5,1.1);bt.magFilter=T.NearestFilter;bt.minFilter=T.NearestFilter;
  if(true){const bm=new T.Mesh(new T.BoxGeometry(W+.7,1.6,H+.7),new T.MeshStandardMaterial({map:bt,roughness:1}));add(bm,W/2,-1.01,H/2,false,true)}
  else{const ft=new T.CanvasTexture(pxaGround(th,()=>'.',4,4,()=>'grass',false));ft.colorSpace=T.SRGBColorSpace;ft.wrapS=ft.wrapT=T.RepeatWrapping;ft.repeat.set(30,30);ft.magFilter=T.NearestFilter;ft.minFilter=T.NearestFilter;ft.generateMipmaps=false;
   const fp=new T.Mesh(new T.PlaneGeometry(120,120),new T.MeshStandardMaterial({map:ft,roughness:1}));fp.rotation.x=-Math.PI/2;fp.position.set(W/2,-.01,H/2);fp.receiveShadow=true;g.add(fp)}}
 if(th.kind!=='lab')for(const [bw,bd,bx,bz] of [[W+.74,.37,W/2,-.185],[W+.74,.37,W/2,H+.185],[.37,H,-.185,H/2],[.37,H,W+.185,H/2]])add(box(bw,.12,bd,th.lip),bx,-.06,bz,false,true);
 const wallMode=ch=>ch==='W';
 const EH=(stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain')?.24:stageId==='mtmoonc'?.46:stageId==='ceruleanrival'?.5:.4,E=new Map(),ledgeRuns=[];R3.eh=EH;
 const XS=['route22','route3','route3b','route4','route2in','ceruleanrival'].includes(stageId),
  V3={},
  fch=(id,x,y)=>{const v=V3[id],c=v&&v[y]?(v[y][x]||'.'):frlgChar(id,x,y);return XS&&c==='r'?'l':c};
 if(typeof frlgChar==='function')for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(fch(stageId,x,y)!=='l'||(x>0&&fch(stageId,x-1,y)==='l'))continue;let n=1;while(x+n<W&&fch(stageId,x+n,y)==='l')n++;const yT=XS?y:Math.max(1,y-3);ledgeRuns.push({x,n,y,yT});for(let xx=x;xx<x+n;xx++)for(let yy=yT;yy<=y;yy++)E.set(xx+','+yy,1)}
 if(stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'){for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(fch(stageId,x,y)==='D')E.set(x+','+y,1)}
 if(stageId==='ceruleanrival'){for(let y=0;y<=2;y++)for(let x=5;x<=7;x++)E.set(x+','+y,1)}
 if(stageId==='mtmoonc'){for(let y=1;y<=4;y++)for(let x=3;x<=10;x++)E.set(x+','+y,1);for(const k of ['10,5','10,6','10,7','5,0','6,0','7,0'])E.set(k,1)}
 R3.elev=E;
 const chOf=(x,y)=>(stageId==='pallet'&&y===H-1&&(x===5||x===6))?'MAT':(fch(stageId,x,y)||(map[y][x]==='X'?'t':'.'));
 {const tpf=ch=>ch==='NONE'||(ch==='~'&&stageId!=='mtmoonj'&&stageId!=='mtmoonc')||ch==='W'||ch==='l'?'none':ch==='MAT'?'mat':ch==='D'?'deck':ch==='p'?'path':ch==='T'?'tall':th.kind==='out'?'grass':th.kind==='lab'?'plank':'stone';
  const mkG=(rows,y0)=>{const gt=pxaGround(th,rows,W,H,tpf);const tx=new T.CanvasTexture(gt);tx.colorSpace=T.SRGBColorSpace;tx.magFilter=T.NearestFilter;tx.minFilter=T.NearestFilter;tx.generateMipmaps=false;
   const gp=new T.Mesh(new T.PlaneGeometry(W,H),new T.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.5,toneMapped:false}));gp.rotation.x=-Math.PI/2;gp.position.set(W/2,y0,H/2);gp.receiveShadow=true;gp.userData.noElev=true;g.add(gp)};
  mkG((x,y)=>E.has(x+','+y)?'NONE':chOf(x,y),.004);if(E.size)mkG((x,y)=>E.has(x+','+y)?chOf(x,y):'NONE',EH+.004)}
 const bb=(cv,wu,hu,x,z,y)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;
  const sp=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));sp.center.set(.5,0);sp.scale.set(wu,hu,1);sp.position.set(x,y||0,z);sp.layers.set(1);g.add(sp);return sp};
 const bbd=(cv,wu,hu,x,z,ry)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false; // objeto estático (dos planos cruzados): no gira con la cámara y los árboles/rocas lo tapan
  if(!bbd.geo){bbd.geo=new T.PlaneGeometry(1,1);bbd.geo.translate(0,.5,0);bbd.geo.userData={shared:true}}
  const mat=new T.MeshBasicMaterial({map:t,transparent:true,alphaTest:.5,side:T.DoubleSide,toneMapped:false}),G=new T.Group();
  for(const a of [0,Math.PI/2]){const m=new T.Mesh(bbd.geo,mat);m.rotation.y=(ry||0)+a;m.scale.set(wu,hu,1);m.raycast=()=>{};m.userData.shared=true;G.add(m)}
  G.position.set(x,.02,z);g.add(G);return G};
 const blob=(x,z,r)=>{const m=new T.Mesh(new T.CircleGeometry(r,14),new T.MeshBasicMaterial({color:0x0b1a10,transparent:true,opacity:.28,depthWrite:false}));m.rotation.x=-Math.PI/2;m.scale.set(1,.7,1);m.position.set(x,.012,z);g.add(m)};
 const fbox=(cv,w,h,d,x,zf,y0,sc,bh,sl,bc)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;
  const hh=bh||h*.97;add(box(w*.97,hh,d,sc),x,hh/2,zf-d/2-.01);
  const pl=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,transparent:true,alphaTest:.5,toneMapped:false}));pl.position.set(x,h/2,zf);g.add(pl);if(sl){const mt=pl.material;for(let i=1;i<sl;i++){const q=new T.Mesh(pl.geometry,mt);q.position.set(x,h/2,zf-d*i/sl);g.add(q)}}const pb=new T.Mesh(new T.PlaneGeometry(w*.97,hh),new T.MeshBasicMaterial({color:bc||'#e8ebef',toneMapped:false}));pb.rotation.y=Math.PI;pb.position.set(x,hh/2,zf-d-.022);g.add(pb)};
 const tree3d=(cone,x,z,sc,rot)=>r3Tree3D(T,g,cone,x,z,sc,rot);
 const pine=false;
 const _gadd=g.add;if(E.size)g.add=function(...o){for(const q of o){if(q.userData&&q.userData.noElev)continue;const k=Math.floor(q.position.x)+','+Math.floor(q.position.z);if(E.has(k))q.position.y+=EH}return _gadd.apply(this,o)};

 if(th.kind==='gym'){const ptx=new T.CanvasTexture(pxaPlank());ptx.colorSpace=T.SRGBColorSpace;ptx.magFilter=ptx.minFilter=T.NearestFilter;ptx.generateMipmaps=false;ptx.wrapS=ptx.wrapT=T.RepeatWrapping;
  for(const [px,py,pw,ph] of [[1,1,2,1],[1,2,1,1],[9,1,2,1],[10,2,1,1],[3,7,7,1],[6,8,1,1],[4,9,5,1]]){const t2=ptx.clone();t2.needsUpdate=true;t2.repeat.set(pw,ph);let x0=px+.01,x1=px+pw-.01;if(px===1)x0=.7;if(px+pw===11)x1=11.3;t2.repeat.x=(x1-x0);const m=new T.Mesh(new T.BoxGeometry(x1-x0,.04,ph*.98),new T.MeshStandardMaterial({map:t2,roughness:1}));add(m,(x0+x1)/2,.02,py+ph/2,false,true)}}
 if(th.kind==='gym'){const wtx=new T.CanvasTexture(pxaWindow());wtx.colorSpace=T.SRGBColorSpace;wtx.magFilter=wtx.minFilter=T.NearestFilter;wtx.generateMipmaps=false;
  for(const wx of [2.5,4.5,7.5,9.5]){const wm=new T.Mesh(new T.PlaneGeometry(.62,.72),new T.MeshBasicMaterial({map:wtx,toneMapped:false}));wm.position.set(wx,1.0,1.012);add(wm,wx,1.0,1.012,false,false)}}
 if(th.kind==='gym'){const stx=new T.CanvasTexture(pxaSlab());stx.colorSpace=T.SRGBColorSpace;stx.magFilter=stx.minFilter=T.NearestFilter;stx.generateMipmaps=false;stx.wrapS=stx.wrapT=T.RepeatWrapping;
   for(const [px,py,pw,ph] of [[6,2,1,1],[5,3,3,1],[4,4,5,1],[6,5,1,2]]){const t2=stx.clone();t2.needsUpdate=true;t2.repeat.set(pw,ph);add(new T.Mesh(new T.BoxGeometry(pw*.98,.04,ph*.98),new T.MeshStandardMaterial({map:t2,roughness:1})),px+pw/2,.02,py+ph/2,false,true)}
}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const ch=fch(stageId,x,y)||(map[y][x]==='X'?'t':'.'),cx=x+.5,cz=y+.5,r=rnd(x,y);
  const chk=(x+y)%2?th.a:th.b;
  let tile=chk;
  if(ch==='p')tile=th.path;else if(ch==='T')tile=th.tall;
  if(stageId==='mtmoon'&&x===7&&y===5){ // cráter lunar del suelo (anillo claro, pared interior en sombra)
   const Wd=39,Hd=34,cv=document.createElement('canvas');cv.width=Wd;cv.height=Hd;const q=cv.getContext('2d');
   const hs=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v)};
   const GR='#948a76',LT='#a8a389',MD='#9e9981',DK='#867c67',MID='#8f866f';
   for(let yy=0;yy<Hd;yy++)for(let xx=0;xx<Wd;xx++){
    const dx=(xx+.5-19.5)/17,dy=(yy+.5-17)/15,r=Math.sqrt(dx*dx+dy*dy)+(hs(xx>>1,yy>>1)-.5)*.1;let col=null;
    if(r>1)continue;
    if(r>.86){const lit=(dx<-.15&&dy<.25)||(dy<-.55)||(dx>.55&&dy>-.5&&dy<.6);col=lit?(hs(xx,yy)<.55?LT:MD):(r>.93?MID:null)}
    else if(r>.6){const dark=dy<-.25||dx<-.4||dy>.45;col=dark?DK:(dx>.4?MID:GR)}
    else col=GR;
    if(col){q.fillStyle=col;q.fillRect(xx,yy,1,1)}}
   q.fillStyle=LT;q.fillRect(21,7,2,1);q.fillRect(24,10,1,3);q.fillRect(23,13,1,1);q.fillRect(23,12,2,1);q.fillRect(14,9,3,1);q.fillRect(17,22,3,1);q.fillRect(15,26,5,2);q.fillRect(22,26,4,2);q.fillRect(8,26,3,2);q.fillRect(28,24,3,2);
   q.fillStyle=DK;q.fillRect(19,10,3,2);q.fillRect(20,19,3,2);q.fillRect(13,17,4,1);
   const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.magFilter=tx.minFilter=T.NearestFilter;tx.generateMipmaps=false;
   const m=new T.Mesh(new T.PlaneGeometry(1.8,1.8*Hd/Wd*1.1),new T.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(8,.02,5.55);m.renderOrder=1;g.add(m)}
  if(ch==='~'&&(stageId==='mtmoonj'||stageId==='mtmoonc')){ // charco: semicírculo apoyado contra la meseta
   if(fch(stageId,x-1,y)==='~')continue;const PX=x+1,PZ=y;
   const mkHalf=(rad,col,yy,op)=>{const gm=new T.CircleGeometry(rad,40,Math.PI,Math.PI);const m=new T.Mesh(gm,new T.MeshStandardMaterial({color:col,roughness:.5,transparent:op<1,opacity:op}));m.rotation.x=-Math.PI/2;m.scale.set(1,.95,1);add(m,PX,yy,PZ+.02,false,true);return m};
   mkHalf(1.07,'#5d5446',.012,1);
   const wtx=new T.CanvasTexture(pxaWaterTex(1));wtx.colorSpace=T.SRGBColorSpace;wtx.magFilter=wtx.minFilter=T.NearestFilter;wtx.generateMipmaps=false;wtx.wrapS=wtx.wrapT=T.RepeatWrapping;
   const gm=new T.CircleGeometry(1,40,Math.PI,Math.PI),uvs=gm.attributes.uv,ps=gm.attributes.position;for(let k=0;k<uvs.count;k++)uvs.setXY(k,ps.getX(k)*1.0,ps.getY(k)*.5);
   const wm=new T.MeshStandardMaterial({map:wtx,color:th.water,roughness:.15,metalness:.15,transparent:true,opacity:.92,emissive:th.water,emissiveIntensity:.18});
   const w=new T.Mesh(gm,wm);w.rotation.x=-Math.PI/2;w.scale.set(1,.95,1);add(w,PX,.03,PZ+.02,false,true);R3.anim.water.push({m:wm,ph:1.3});
   { // cascada que sale de la roca y cae al charco
    const cv=document.createElement('canvas');cv.width=8;cv.height=32;const q=cv.getContext('2d');q.fillStyle='#3f93dc';q.fillRect(0,0,8,32);
    for(let yy=0;yy<32;yy++){const h2=Math.sin(yy*12.9898)*43758.5453,f=h2-Math.floor(h2);q.fillStyle='#8fd0ff';if(f<.45)q.fillRect(1+((yy*3)%4),yy,2,1);q.fillStyle='#2b72bd';if(f>.7)q.fillRect(5,yy,1,1)}
    q.fillStyle='#2b72bd';q.fillRect(0,0,1,32);q.fillRect(7,0,1,32);
    const ft=new T.CanvasTexture(cv);ft.colorSpace=T.SRGBColorSpace;ft.magFilter=ft.minFilter=T.NearestFilter;ft.generateMipmaps=false;ft.wrapS=ft.wrapT=T.RepeatWrapping;ft.repeat.set(1,1.5);
    const hhw=((y-1)<=1?1.2:(y-1)<=3?.75:.5),wh=Math.max(.3,Math.min(.86,hhw-.3));
    const fm=new T.Mesh(new T.PlaneGeometry(.26,wh),new T.MeshBasicMaterial({map:ft,side:T.DoubleSide,toneMapped:false}));add(fm,PX,.07+wh/2,PZ+.075,false,false);R3.anim.water.push({scr:ft});
    const foam=new T.Mesh(new T.CircleGeometry(.3,16),new T.MeshBasicMaterial({color:0xcfeaff,transparent:true,opacity:.55,depthWrite:false}));foam.rotation.x=-Math.PI/2;foam.scale.set(1,.45,1);foam.position.set(PX,.05,PZ+.1);g.add(foam);R3.anim.water.push({foam:foam})}
   for(let i=0;i<3;i++){const rg=new T.Mesh(new T.RingGeometry(.74,1,28),new T.MeshBasicMaterial({color:0xf4fbff,transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}));rg.rotation.x=-Math.PI/2;rg.position.set(PX,.045,PZ+.1);g.add(rg);R3.anim.water.push({ring:rg,ph:i/3})}
   continue}
  if(ch==='~'||(ch==='W'&&!wallMode('W'))){
   add(box(1,.1,1,shade(th.water,.45)),cx,-.15,cz,false,true);
   const wtx=new T.CanvasTexture(pxaWaterTex((stageId==='cerulean'||stageId==='ceruleanguard')?9:(stageId==='ceruleanrival'||stageId==='vermilionrival'||stageId==='route6'||stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'||stageId==='route25'||stageId==='route25b'||stageId==='route25train')?1:(x+y)%3));wtx.colorSpace=T.SRGBColorSpace;wtx.magFilter=wtx.minFilter=T.NearestFilter;wtx.generateMipmaps=false;const wm=new T.MeshStandardMaterial({map:wtx,color:th.water,roughness:.15,metalness:.15,transparent:true,opacity:.92,flatShading:false,emissive:th.water,emissiveIntensity:.18});
   const wsz=(stageId==='cerulean'||stageId==='ceruleanguard'||stageId==='ceruleanrival'||stageId==='vermilionrival'||stageId==='route6'||stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'||stageId==='route25'||stageId==='route25b'||stageId==='route25train')?1.006:.98,w=new T.Mesh(new T.PlaneGeometry(wsz,wsz),wm);w.rotation.x=-Math.PI/2;add(w,cx,-.07,cz,false,true);if(stageId!=='cerulean'&&stageId!=='ceruleanguard')R3.anim.water.push({m:wm,ph:(stageId==='cerulean'||stageId==='ceruleanguard'||stageId==='ceruleanrival'||stageId==='vermilionrival'||stageId==='route6'||stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'||stageId==='route25'||stageId==='route25b'||stageId==='route25train')?0:x*.7+y*.5});
   if(stageId!=='cerulean'&&stageId!=='ceruleanguard')for(let i=0;i<2;i++){const rp=new T.Mesh(new T.PlaneGeometry(.5,.05),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,depthWrite:false}));rp.rotation.x=-Math.PI/2;rp.position.set(cx,-.055,cz);rp.userData={ox:cx,oz:cz,ph:rnd(x,y,i)*6,i};g.add(rp);R3.anim.water.push({rip:rp})}
   continue;
  }
  if(ch==='l'){const run=ledgeRuns.find(q=>q.y===y&&q.x===x);if(!run)continue;const n=run.n,yT=run.yT;
   const lt2=new T.CanvasTexture(pxaLedge());lt2.colorSpace=T.SRGBColorSpace;lt2.magFilter=lt2.minFilter=T.NearestFilter;lt2.generateMipmaps=false;lt2.wrapS=lt2.wrapT=T.RepeatWrapping;
   const Hh=EH,sl=.4,xa=x+.06,xb=x+n-.06,za=yT,zc=y+.92,zbk=yT-.6,zf=y+1,
    mk=(pts,uvs,mat)=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pts.flat(),3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs.flat(),2));geo.setIndex([0,1,2,0,2,3]);const m=new T.Mesh(geo,mat);m.userData.noElev=true;_gadd.call(g,m);return m},
    base=new T.Color(th.a),mTop=new T.MeshBasicMaterial({color:base.clone().offsetHSL(0,-.03,.05),side:T.DoubleSide,toneMapped:false}),mBack=new T.MeshBasicMaterial({color:base.clone().offsetHSL(0,-.02,-.02),side:T.DoubleSide,toneMapped:false}),mEnd=new T.MeshBasicMaterial({color:base.clone().offsetHSL(0,-.03,-.06),side:T.DoubleSide,toneMapped:false}),mFront=new T.MeshBasicMaterial({map:lt2,side:T.DoubleSide,toneMapped:false}),
    uvq=[[0,0],[1,0],[1,1],[0,1]],W2=xb-xa;
   mk([[xa,Hh,za],[xb,Hh,za],[xb,Hh,zc],[xa,Hh,zc]],uvq,mTop);
   mk([[xa,Hh,zc],[xb,Hh,zc],[xb+sl,0,zf],[xa-sl,0,zf]],[[0,Hh*2.2],[W2,Hh*2.2],[W2+sl,0],[-sl,0]],mFront);
   mk([[xa,Hh,za],[xb,Hh,za],[xb+sl,0,zbk],[xa-sl,0,zbk]],uvq,mBack);
   mk([[xa,Hh,za],[xa,Hh,zc],[xa-sl,0,zf],[xa-sl,0,zbk]],uvq,mEnd);
   mk([[xb,Hh,zc],[xb,Hh,za],[xb+sl,0,zbk],[xb+sl,0,zf]],uvq,mEnd);
   // marcas de casilla (decal) sobre la meseta
   {const gw=n,gh=y+1-yT,pg=new T.PlaneGeometry(gw,gh),uv=pg.attributes.uv;for(let k=0;k<uv.count;k++){const u0=uv.getX(k),v0=uv.getY(k);uv.setXY(k,(x+u0*gw)/W,1-(y+1-v0*gh)/H)}
    const dm=new T.Mesh(pg,new T.MeshBasicMaterial({map:R3.decalTex,transparent:true,depthWrite:false,toneMapped:false}));dm.rotation.x=-Math.PI/2;dm.position.set(x+gw/2,EH+.05,yT+gh/2);dm.renderOrder=5;dm.userData.noElev=true;_gadd.call(g,dm)}
   continue}
  add(box(1,.12,1,tile),cx,-.06,cz,false,true);
  if(th.kind==='lab'&&'BCMPk'.includes(ch)){
   const sd=x*7+y*3;
   if(ch==='B')fbox(pxaShelf(sd),1.0,1.33,.55,cx,cz+.42,0,'#4a4f5c');
   else if(ch==='C'){if(y===1)fbox(pxaCabinet(),1.0,2.13,.55,cx,cz+.42,0,'#dfe4ea');else fbox(pxaDesk(),1.0,1.2,.55,cx,cz+.42,0,'#ead29a',0,0,'#ead29a')}
   else if(ch==='M'){if(x===1&&y===1){const mx=2.0,mz=2.15;
   add(new T.Mesh(new T.CylinderGeometry(.5,.58,.5,8),r3mat('#eceae2')),mx,.45,mz);
   for(let k=0;k<3;k++){const a=k*2.094+.5,lg=box(.2,.16,.7,'#b6bfca');lg.rotation.y=-a;add(lg,mx+Math.cos(a)*.62,.08,mz+Math.sin(a)*.62,true,true)}
   for(let k=0;k<8;k++){const a=k*.7854+.39;add(box(.09,.95,.09,'#8fd0f0'),mx+Math.cos(a)*.45,1.18,mz+Math.sin(a)*.45,false,false)}
   for(const [bx,bz,by] of [[-.15,.1,.85],[.18,-.05,.85],[0,-.2,1.15],[.05,.18,1.2]]){const pb=new T.Mesh(new T.SphereGeometry(.15,12,10),r3mat('#d8453a'));add(pb,mx+bx,by,mz+bz,false,false);const bn=new T.Mesh(new T.SphereGeometry(.152,12,2,0,6.283,1.45,.2),r3mat('#ffffff'));add(bn,mx+bx,by,mz+bz,false,false)}
   add(new T.Mesh(new T.CylinderGeometry(.58,.5,.3,8),r3mat('#eceae2')),mx,1.8,mz);
   add(new T.Mesh(new T.CylinderGeometry(.46,.46,.12,16),r3mat('#d8453a')),mx,2.0,mz);add(new T.Mesh(new T.CylinderGeometry(.22,.22,.05,12),r3mat('#ff9a8e')),mx-.1,2.07,mz)}}
   else if(ch==='k'){if(x===6&&y===1){const tx=7.5,tz=2.15,top=box(3.0,.14,1.25,'#5cb86a');add(top,tx,.98,tz);add(box(3.0,.05,1.25,'#8fdc9a'),tx,1.07,tz,false,false);
     for(const lx of [-1.35,1.35])for(const lz of [-.5,.5])add(box(.14,.98,.14,'#f6f7f9'),tx+lx,.49,tz+lz);
     add(box(2.7,.08,.9,'#dfe4ea'),tx,.3,tz,false,true);
     for(const bx of [0]){const fl=new T.Mesh(new T.SphereGeometry(.2,12,10),r3mat('#f6f7f9'));add(fl,tx+bx,1.28,tz,true,true);add(new T.Mesh(new T.SphereGeometry(.2,12,6,0,6.283,0,1.2),r3mat('#d8453a')),tx+bx,1.28,tz,false,false)}}}
   else if(ch==='P'){const px=cx,pz=cz+.1;add(new T.Mesh(new T.CylinderGeometry(.28,.2,.42,6),r3mat('#a99f93')),px,.21,pz);add(new T.Mesh(new T.CylinderGeometry(.3,.28,.06,6),r3mat('#8d8478')),px,.44,pz);
    [[.34,.3,'#3d9a48'],[.62,.24,'#4cb05a'],[.86,.17,'#6cc873']].forEach(([yy,rr,cc],i)=>{const o=new T.Mesh(new T.OctahedronGeometry(rr+.08),r3mat(cc));o.scale.set(1.2,.8,1.2);o.rotation.y=i*.7;add(o,px,.38+yy,pz)})}
   continue}
  if(ch==='W'&&(th.kind==='gym'||th.kind==='pool')){
   const topRow=th.kind==='pool'?y<=1:y===0,hh=topRow?1.5:.8,tx=new T.CanvasTexture(th.kind==='pool'?pxaPoolWall():(topRow?pxaGymGreen():pxaWall('#8d93a0',x+y)));tx.colorSpace=T.SRGBColorSpace;tx.magFilter=tx.minFilter=T.NearestFilter;tx.generateMipmaps=false;
   let bw=1,bd=1,ox=0,oz=0;
   if(th.kind==='gym'&&!topRow){const op=(a,b)=>{const c=fch(stageId,a,b);return c!==undefined&&c!==null&&c!=='W'&&a>=0&&b>=0&&a<W&&b<H};
    const ol=op(x-1,y),or_=op(x+1,y),ou=op(x,y-1),od=op(x,y+1),t=.7;
    if(ol!==or_){bw=t;ox=ol?(1-t)/2:-(1-t)/2}else if(ol&&or_){bw=t}
    if(ou!==od){bd=t;oz=ou?(1-t)/2:-(1-t)/2}else if(ou&&od){bd=t}}
   const m=new T.Mesh(new T.BoxGeometry(bw,hh,bd),new T.MeshStandardMaterial({map:tx,roughness:1}));add(m,cx+ox,hh/2-.05,cz+oz,true,true);continue}
  if(ch==='W'&&stageId==='route2in'){ // puerta metálica de la entrada al bosque
   add(box(1,1.5,1,'#98a3b4'),cx,.7,cz);add(box(1.04,.14,1.04,'#d9e0ea'),cx,1.5,cz);add(box(1.02,.06,1.02,'#6b778a'),cx,1.1,cz);add(box(.82,.1,.04,'#bfe6ff'),cx,.78,cz+.51);add(box(.82,.1,.04,'#bfe6ff'),cx,.78,cz-.51);continue}
  if(ch==='W'&&stageId==='forestexit'){ // caseta de la salida del bosque: tejado de chapa con 4 nervios, fachada de ladrillo, ventana y pilar
   if(x!==0||y!==0)continue;
   const mx=cx+.5,mz=cz+2.5,L=5.9,WD=1.9,WH=1.25;
   add(box(WD,WH,L,'#c9a46a'),mx,WH/2-.05,mz);
   for(let k=0;k<6;k++)add(box(WD+.02,.025,L+.02,'#a98a56'),mx,.12+k*.19,mz);
   add(box(WD+.3,.12,L+.3,'#8b92a8'),mx,WH+.05,mz);
   add(box(WD+.34,.07,L+.34,'#454b5e'),mx,WH-.03,mz);
   for(let k=-1.5;k<=1.5;k+=1)add(box(.045,.04,L+.3,'#5f6578'),mx+k*(WD+.3)/4,WH+.13,mz);
   for(const sx of [-1,1])add(box(.045,.04,L+.3,'#5f6578'),mx+sx*(WD+.3)/2,WH+.13,mz);
   const fz=mz+L/2+.02;
   add(box(.62,.4,.04,'#e9e4d6'),mx-.42,.6,fz+.01);
   for(let k=0;k<2;k++)add(box(.26,.32,.045,'#4a8fd8',{emissive:'#2a6fb8',emissiveIntensity:.4}),mx-.55+k*.27,.6,fz+.02);
   add(box(.22,1.2,.06,'#d7dbe3'),mx+.7,.55,fz+.02);
   for(let k=0;k<10;k++)add(box(.24,.025,.07,'#8c93a3'),mx+.7,.08+k*.115,fz+.03);
   continue}
  if(ch==='W'&&(stageId==='route2'||stageId==='route22'||stageId==='route25train'||stageId==='route25'||stageId==='route25b'||stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'||stageId==='ceruleanrival'||stageId==='route3'||stageId==='route3b'||stageId==='route4'||stageId==='mtmoon'||stageId==='mtmoonj'||stageId==='mtmoonb'||stageId==='mtmoonc')){ // acantilado de roca con textura (tejas de piedra)
   if(!R3.rockM){const im=new Image(),tx=new T.Texture(im);tx.colorSpace=T.SRGBColorSpace;tx.wrapS=tx.wrapT=T.RepeatWrapping;tx.anisotropy=4;im.onload=()=>{tx.needsUpdate=true};im.src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUEBAQEAwUEBAQGBQUGCA0ICAcHCBALDAkNExAUExIQEhIUFx0ZFBYcFhISGiMaHB4fISEhFBkkJyQgJh0gISD/2wBDAQUGBggHCA8ICA8gFRIVICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCADAAMADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDDDw2WmQ6bbjFtZxiJT3YjqT+NcteXbTXRBOQa0Zb43ulPcCQvKVG9vU46/iOa5k3CLK248YrwYxPoWy08MN1fWNs0Kyq1zGHVhkMN3I/LNPnuTCGheOS8iQbY2L4kQD+Ek8MvoTyKz49btbJpWHzzsCisD/qwep+p6fTPrVVdTtZCd0w9s8Vrysz5l3KWrXodBG0EsS7uN+CP0rMtn2alC2eHyhq3qdxDJIEjII557VlHMMkcgJ2owOPTmumK0OaT1Pa1u1vdOgmVhueJc+xwAf1FZBVxcbnJx3zWbot/sRrZzhc7kH8x/WtSaTJ+ZSoPPIrhtZ2O1O6uVLmbbIJEOCmSPY4xmsWdvMBHXFal0CxYqOvGaylgkJ3DBU8bh0rSJEim1x9ktHlHDZ2pn1rMuLySdPvEE0X84nuAkZzFHwp9fU1DAv74E8gcmumKVrs5nK+h6r4K8NweHdAGr3KJJqF5GCC3IjQ8hR9RyfyqGW18PXnia9urnRLeaF7dFkP3QJNxII6YJUc/QetWJNXjOiaUWuESOS1VFBOMsAM1koB5UoU5LOXJHfgD+lcV5NuTOtJJJI17a68G6fzbeH4Ek9dgc/m2a1YfEN/fOI9LsI0QfxSHgflXJw6U9xLucjGelb0c8WgWOC+6dssqDufU+gqZJerKRk6zY3Kaz5t5qCT3EnzOqA/J7fSpRcxRqFU/N9azHeSWV5pWLvISWb1qJmijGTnjv3q7dCTTltbS/upPNT5/IB3Lwfvn/wCtXC67o8VjL5kbrktnZ/erpzqq6exvXUyKyeVsBwTzkY+h/Q1y8g1DxFqEjoNuThmIwqeiitqaad+hlUs9Op6QL+21KysbqCT9wyD5R0VsYwfcdKNRsIp4leM/OOR9a4fRrmTSLhtOuZg1tOflbHCv/TP+FdQ+uWtvYSTzy4MYI292PoBWUoNPQ0jJNamPr11Hp8Oc7riQYRcfmfwrjYoJZpoLSFS80zBQo6nJqXUdSfUdQe7uMJnhUB+6PSk0nV5tK1y31KNmQxkjcByARgkZ+tdcIuMfM5ZSUpeRe0vXZoNNe2aQF1wqg/xL/wDWqvNcPLzI4APYHitDwl4Pn8T3TyO5gsYWw8oGSx/ur7/yr0VPh14YiAQ200hUcs05yT+FZzqU4S8y4wnJHkJliycsPwpokUk4ycdcDpXti+DfC9phl0mAEDOZSSf1NQ3Nraw25S0WGEZ4CAAfkKn6xF7Ir2L6s8XZg33eagd+NueD2r0W40kypIwtlWU/dfgDr3xSDw/oyjzZ4fMkPLHccVoqyIdFnJRah5qLFkJgAHnlvxp++RGJWV1P+yxFbdzo+myD5bZUHbYSCKxLrTJbXm1m3of4WoUovYHGS3LFpqF1FcAPJ9ohALPFIxwwAzjI5APsak1TXDfWwjj3IXGGQDARfQe1ZMU+yYrKNhKlTn3pCo25FVyq9xcztYaMYPrUtjaXd/fLa2URll+8RnAAHqe1WtH0XUdduxa6dbtIc/O5GEQepPavRNL0m28KRzW94f3zvnzscuMfdH0/rUzqKOnUcIOWvQ83uLe+t3htdSSSJYCVXPKrk5611GllYkj824CwZAJY8D8am1AC5uJJ4pA+8klSwJA/rXGyPNbSStExa338x54HuKlfvEV8DuemzarbWke2zXzpP+ejfdHv71y9zqoknZyTNIerdq51bqecR2ts0s3mthYV5JPpitiz8LeILtm82OPT4wfvTHLH6AVKpxj8TK53LZA+qzKMiFR/vGqk2tyZyUiQ+vJrqLPwDak+ZfXdzen+6vyL+mSaqeI/DWi6dapFBaslxNIqLmQttyfrx9KFKnewNTtc5yK21HWnMwVkgGAZ3GBj0Ud/wrtIdNj0eCPzo2tgmGjiP3ifVvQn860pha6fAkWMG3AWNAemOlc1dXFxfXDSyOx3Mepzn3qHJz8kUo8vqZWpWYVdjZaOXJRu/wD+sUeHfDeqeKp3We78iwt22yTlQST/AHV9Tj16UavOYyseSRCpYj3OOP0Fd7YqfD/gu0sCnl3c6GWYnqGblvx6D8KuU3GOm5CgpS1GjR/B2iqIbbTobqdRzLKPMOfx4z9AK5LxxcLqENpFHAkSwhim0Aenp06VqwwTSyBVO6aTLc9FHcn2rnfEZbfGiHcIsgt61FP402y525Wkj2HR9PtdB0W109CkaxJl2PUk/eNU5tVvZ5GVJjHGCcKvGBTtYlYTeXyGHH4VhX119nhAGNxrmSvqzfbRE906hcs29xzzzWaLh5XCR4BJ6CqP215WP5Vv6XYfJ9okGXPCj/PetGrLUncqS2/lx7nc5HJyapMhcYGcVLrFys2ofZYHzHCdrMOjP3/AdPwqS1UsoGSRjH40+lxGc9odu7pVKez8wEGNs/3hxXRSx4XB6+nrVN3A+Uj/AOtTUhNHI3WnbYWeQh0HtgisGQGNzGjMF7ZrtNXXGmyOo7gn6Zrk70DyA2ACD1rqpyuc1RWPbfCMkFj4T063hRYy8IkcgYLMwySaydfmubvU2DSsI0A2KpwFBrB8P6/5uj28bN+8hUREew6fpWhJO7MXY7mbiuNxak2zqTTirFX+z7a4i2XEatzwSMH865rV7BdOu/LTLQuuQD+orvI7ZDaq8n326H0rL1XTo7y3MZ5dMlGHUGtITsyZRujmPCF1baZ4kYSwJL58RSIvwVPoD2PUV67ZPbf2fvCI7Y3FiBnkf5FeETRS+b8h2SxNkE+tbVnr90ZvMhmaGZOGizx/9etKtPn1RlTmo6M9OutWEStiNB6cVyHiK+F3YlXYBo2DKRxg+1V59fiuowuySNwPmUDcCfas5Q15cBnBWJOcHjcayhDl1ZrKV9EX5Z3kjV5iSxUFt3qetQCYwozy/LGvQ0XN5b26l7k7QeigZJrHutSiu3jjUMkKnJ3dzWkYtkSkkaeg2Y1fxVaxznMSFrubPQqvQH8cV0mq6kLu7nu5D+5j4Ue3b865LQNUsrHWr1LqURrPa+UkhHAO4HHHT61c1i+t0igEEqvGSCWU5zziiUW5IUZJRbOtsrKWy0SS9vFK3V0u8g/wIPur/WuEvo5Lq7FtEMu52gda7HxP4miukeG3UKgwSe5rO+H9kNT1q41OYZitcKoPdzz+lRFuKc2VKzaijpbq936tiQ/M2evv1rB1Zybgt2AwKZrOo/aLtLqD5BtySOMHvWNJeSyReWzZGc5pRj1KlIlikw5J7CvSIyRaxvAccBlI/PNeWxSFWy3rXT6V4mt9NsxBqbMkEf8Aq5VUtgf3WA/Q0Ti3sEZJbmY/7u4ljbIKMQc9atWt+sMRBBPOQa5LXvEEur6pJPbL9ltx8qheGYerH1/lWWPtxXcn2k553DdWypXWpl7VJ6HpL6lb+WZZpRGFHVjgVj3XiHSrZGkSQ3Mp/gj/AMTXEmLUJmEbpM5HOGycU99MvI4jI8YAUZxuyapUYrdkurJ7I1brWZtQTAQQxZ5UHOayrqbMRQ9TVmz0m8udMkvhJHBbqSql85kI64GO3qazJEYck7hWsVFaIyk5PVncaRaWtr4Qtr8WySTzTurSNnIC9ACDxWja3PmqeSwXnOMlf97H8+lQWMbv8PbEAcCVnPvliM/pVNEkSRWjYpIvQjiuV6t3OmOiR1UE5KKpO9McMDkUSyxQ5llOxB/Gen/66w4C5c/M1u/qhwD/AEonSSVh9ouHmA6K3QVny6mlzFurY3EzXCJsjdjtz39Ky7i3DsMZimToRXW4VoirxsYScFgDgH6+tZWrW2yFJkIbBxuHcehreM9bGMo6XMJLiWORY5hh+zDvV2XU77Pl+cQFABOBkn61SkHmLgnHcEdqqyvKuULfiOtbWTMbtFmRwxLyOWPqxzRa299qdyYNOtJJ2Aydq5//AFV0Hgnwf/wkNw13elk06BsNg4Mrf3R6D1Neiww6Voep3sFpaxWYdonQAYDjYVOOvcGsp1VF8q1ZpCm5avY80t/h94jmJkeKCE9f3kwz+makn8Ca1DCxe6tCPZmP9K9ObUoncKJlGepCnArP1PzDbFreeKc4zsUkN+RAz+FY+3m2a+xgeTala6jY7Y7qYOh43ISRXqvwvjij8JM4Ub3uHLe4GMVxF80N1A0cmTn+dWvBXid9Ltp9IboHMqPjPsRj8q0qXnTsRC0Zl3VhYIYoLRzISvzc55rnpvMicgDp2NU7O+aCX7FfjY68K56Ef571suolhCtyQPlJ/lTty6BfmKiSBhnI+lH2e51a7h0e0I8yU5dm+7Go6k+w60y5VbOLzJWAYjKR9z7n2rrdH01tM0FblSWu70B5pMZIB5Cj27n3+lKTUVcEruxjyabpml3DC0VnKfL5khyzepx0FRy3LzKAzsw9CTWjPaFn+fkHvWVcIYI5HCHapwTUp33LatsM8xY2LNgAdc1HqtxGNOJjUbpPlXHqazJZnlYZdQp980zzYorq38wM8UZ3kL/E3b+lbKOtzJy0sbtyRbadb2K52QxhSCep6k/iSa5m8h2OwX7rjcv0qxNqclwPuDn3qrJJJK26V9zHA+gHQVUItbkTknsdloNyJfCEMOeY2ZCPcNn+tW2t99sssa5HtXL+Hrvy0urfqNwkH8jXeWMaG3WNXDKQCMdxXPUXLJnRTd4oz4LqNI9jRgkdzVjTLJtXvzuUi3TlyOPwq2dISd8LlQTya0kuLHR7IQI4AXn1LH1rJvsaJdzUCQwwCKNVjjjH3VGABXIazceH51mgeMGRh9+IdG7GqepazeaiWiDNDbH+BeC3+8e/06VgXTLbRPIwyFGfrThAmUzHP3iO4OKq3EbSzRrENzudoA7ntUYlkJLsxyxya6fwLpMmseLbaRoy1tZnz5W7Aj7o/E4/I13N8qcmci952PXdMtbXw14Zt7WQhEtYh5jAZy3Vj+JJrze71RrvWJrxSyo42gMckKOn612vjfUY7bS1sVINxdHIH91B1Y/U8D8a83YFcH1rhpK95Pqdc3bRGzHfSlAd26rcV4ZQVY1iQM+0scBR3qeN8S7hxVNAmZGvkw6g3l8CQbj9awo5mt9QinXgqwP1Heuuv7eG6uY3kPCZyR3qnf6bbXNv5caCJ0GVcdj71vCaSszCUG3dEN9pV3ckCbyIHQngsSw9jWatxd6U4jmTzIu3PH4GvUdUtbfVbYkhRcL92XHP0PqK4i9t2hLQXUXynjkZDfjUwqX0ZU4W1RlXl1aXNussTjceCp4IrsovGLx2kcNzYpKVUAFG2gjHpXAXGn7Dm3fIP8J7VEt9NEPKkG7bxzwRWjpqSM1NxZ1974nnuAUtrSO3H94nca5+e4mm/wCPid5MHOCeB+FPsdO1vVpVj0/SZ5i3IbaQv1yeK7DTPhdql1tk1q8WBD/yxt/mY/U9B+tTeFPdle/PY4NZ0J27gD2FLJ8yDnkd69L1Lw/oGk2jWFvbRSTdyTvb/gTdvwrn4/DVrcNxZOB/suR/WhVovUHSkcUjbnCRKXdjgKoySa3Lfwnr13GH8qODd0SRsGvRtM8MWlhCHhijhLdwuWP4mp7uSOzCLDnzSc5bnArOVf8AlLjR/mPKpNF1jR5/Nlt9yrwSh3Aj8KsQ3s7kC2nkjz2BxiuyvknuoyUYK3864qTfbap+8TYyna3Hr3q4z59yZR5Njq9HuL6YC1e5dsDcCT371qy6U8h3bzn6Vj6WwS7UhgMoeK3Ptrbyitgdz2z6Vzy30N47GLc23kOVc81ga0D9gk2jg4B+ma7xJY2J3KGJ67hmuV8UwJDaSyRqAknygKMAHNXTfvIma91nFxRyTSpBCpaWVgiKO5PAr3fSdNtvB/hCVFAZ4Y2lnkx/rHx/LOAK8o8E28cni60nm+5b7pufUDj9cV1/jXXXu5U0q1kXyMCSXb3PYf1qq15SUFsZ0rRi5HLXN/c39/JeXkpknlOSx7ew9BSrm4njhizvkYKPqaznYh/pWpo/yyzXRPzRrsj9mbgn8Fz+Jq2rISd2WiqoPLTOxenvTtgI3d6aUIPtV2wsf7QvY7R2ZYmyZWHURgZb9OPqayuaWF07Sb3VY2mtogIAcefKdqE+g7sfoDRdeGtdtmUWsUOoKwH+qbYwPptbr9RXWXN23yxQny4o1CIq8BFHAA+lVo750fli31NZ876F8qKAcowORj0rH1XX9NhUx7vOlH8C84Puelc5qOv3l2THaloIcYz/ABN/hWMsRzk84rojS6yMZVekS3HISxdsLk5x6V0vgvwsfE2t/bbuInTbMgyHtMw5Cf4+1c9pem3Wt6vFpdmhMkn327IvcmvonR9LttF0aHTrVAkUIxn+8e5P1pV6nIrLdhShzu72JVWRMDaQOiqOg9PoKxNa1AwxtCjgFgQxB6VZ1G7+bAY57c1x2oySO7YJcn1rhhG51tmTPIXuCx79K0LVugB61kxhrhTKOm7C+/vWjEphYFiMV0MzR1lrOPs6oTyvH1rC1HaNRkwwIwP5UhvCkfyfN7Dg1g3OoMkjlmyTURjqNsu3E+xSVxkVx+uTNcSLcnqBsY+voau3GpPIu1eM9TWdKwmheMjhhiumEbO5hOV1YsWl8ZIYyjkSrjPPI966Ky1C1uYxDKBBMo9flb6f4V5/E0sMocD5kPI9fUVupLBJb7yw2sOmaqcETCbOpkurS3B33kan03Vz/iDUrW5sUghlErbwSQDgAf1rE2Dbn2qvLIgb7wPtTjTSdwlUbVjofCTxLe3Du4BVFUA+hPP8qqPciS4uZ2GTI5P5msixvPsl1vD7VYbWNSSXA3MIxxnjmqcPebIU/dSLjbDzmtHSB8t0vJC7G/PI/oK59ZpR1wRV/TbmSO5dnceW2FYY4olHQIyVzqEUEgEcVYtnaGUvHxxjPtVJJAcEEFexBzVuOVQM7q5WdRpLMWXk0GUMQMfjWcLpUTJ/Wqc2s2Ua7zcqCOynJP5UlFvYG0jltP07UtWl8vTNOuLwjgmJCVX6noPxruNO+F2oNbm61y/SwhUbmigIeT6Fvuj8M131n4ktvLWG304QQr8qKGCgD6AcUuuX1sfDt9PfTCGHyWG/+7kcY980SrzbslYmNGKV3qeVaDOvhnxXPbWrtNBcjajsQGODnGa79/HFnaE291BMEK7lcYJPHSvFZ9SdkRw+JEIZWHXNasmsR6l5RLBXVcFPfqetbTo8zuzOFRJWR3kvjPT5pTuhuACMZAGfyqhc6tHqCfY7BHRJDmWSTG4gdhjoP51ya8vzmtCzeRFkkiYLg7eR19f51Ps0tilNvc6CCEIFUA7VFWNpeTbis7T9SR5PLnAT37E1t2oR5mB4GeKyd1uarUrTW/mcruXHesfUNPtAuPOlMvcAiul1G5+z6fKyfK5+VSOuTXKjOCzHJpxvuKRR/sy3Iy1xMv4A1XuNPMabrWXzx3VsBh9PWtCSQ5GRwTVW4mEMbSsQFXkD6VsmzJpHOk5kZ/XtUGGjm+ViMVKpJGT1PJrovCXhiXxTrXlktHZQANPKByB2Ue5/+vXQ5KKuznScnZHQeA/Bun+INPl1XV3kliSYxJArbVOACSSOT1xgeleiQaJoumqYNP0u2gXoSIwSfqTya0ljs9K09LO0iSCGJdqovRR/jWBc6ysbHywc9yec15cpyqO/Q9CMFFEOpaVp8oYmytsnqfKX/CuO1bwppjwvOkX2fYMlof8ADoa6l/EL4ILLg+oFMbVnureWAlMSKV4q4uURNRZxUHw/mWFTd69ZQynrFgsy+xxxmq+oeEL3TbF7u0uU1CJfmkESncAO49a6C3voyDbTRkXEY+8TxIOnHoaPt/lNujZo29QcVt7Sd9TL2cbaHn9veZ+aCUofbira6pdRKRlX9Nw6flVvWNIiu5HvLHbDOTlkAwr/AE9DXLvcTRkxSqQ68HNdMUp6owbcdGXJrm4uWPnTsw/u9B+VQZjXniuu0L4aeINbtor25mi061lAdTJlnZTyCFH9SK6m08MeAtAdRdNJrV0pG7JDID/ughfwJNRKrCOi19BqnKWrKMd+8bAgYA7VzXjbxPLqYh0lMLDbnfJj+J8YH5D9TVSbxDerAx8mENjg88GsnStF1bxFqn2XTrdriZjudzwqA/xMew/yKUKai+aXQdSpzLliO8P+H9Q8SaotjYpgDmSVh8sS+p/oO9ely/Drw/bA24Se4dVAMvmEHOPQcfzrqLLTNP8AB+grpdgd05G6aU/edyPvH+g7CsRprgzFhkk981jOtKb912RrClGK97VnA63oWpeHZDPAz3Nj0JYZMfsf8aq6dq0LxSRysI2LFgD05r0O6uja5uZAWgfCzIefxFc3rXgmG53XekskEh+bySfkceoPb+X0rSNRNWn95EoNO8TMLblznI61PDrOoWZCwSgqv8LqGxWZFofiGFSyWUu1eu0grULTXFvMIry3eFiM/MMZq+VPzJ5mt9DobnxFLdoq3EAUrz8h4P4VUbVUHSI1mb1cbgcj1qMk0ciHzst3GqnaSsRz2zWPNNLcSAzOW9uwq26FlOaqxwyz3SW9uhkmkbaqitIpIyk2y9pWl3et6lFplgm6SQ5Zj0Re5PsK9usYdN8HaLHp9swZxy7Y+aV+5P8AnisDw5plt4Z0uRyxa4KhriYDknsg/p+JrPv9Re5meaQ4Y8Bc8AelcdSXtHZbHVTjyK73NK716ednllfCjnA7VzraxcXKszxrGp+6B1x2JqpcXQ8ho2YZcqv4Z5/pURR3kEaKXcn7qjJNOMUhuTJRcktyOab9tKHKsQw7g1di0u9VQ08JtkP8cgwQP93qap3hhT91EPlHc8lvc/4U1a4tQe4M0iSliki9GFNknYt8wAPt0NUWcICS3yioxNvG5TkVfKRzFzzQPmLAAckk4ArBVYLrxLZvIoaGS6jVhjOVLDNTX82UEYbknJFZ4k8m4t5mOAkqsfwNawjbUylK+h6/4r1C7undYbuVbduPKU4Uj3A6/jXKWgUgS8sM8Hsf/rVBrmvNLZfZrU7WwQ03qD6f41i2muXkduke6OQKABvXkflWEKb5TeVRcw/wj4bl8V6nJavfraW0CCSZyMkjOAAOmfc9PfpXueiaXpGgWH9naLEEUnLyMclz03E9/wAOK8g+G5EfiS/hz8rWp49fnWvRr/UDbbXRsbemKjEOTly9AopKPN1HXYZpZDKSX3HOazH8iPJdwg9Sazb3Wr6WUus0fP8ADsrJmlurxsXMoCdwgxmoUe5o2WtX1K0aFoIXMpPcDr9PWpLe6ljtYQZWDRoAD6cVRWOKIbo4wD/e701pBjk1dlawjQl1WcjbvG3uNuM1lauUu9NlS4CHaC0bd1btj/Cms/PXNXdLiDah9pb/AJYLhPZj3/AA/nTXu6kvXQo6b4GknsYrjUdTFi8q7hFs3MB2zzxTbzwU9pG0kGtxuo55QiulkuNvI496gM3mpgtuGeVI4p+0ne9xezieZTSXEMzwSPhkODgV3Xg/w7JbD+1LxSs8g/dq3GxMfePpn+Vc/rNrFBq0V6U3xxyKZF9VzXU3/iSGfT3htkfFztzM2B8ndce5xz7VrUk3FKPUzhFKTb6Gjq2qwSxR2tpN5sSEsz4IDue/PYDgfjXOz3O5GXv61VMg2ZJ61BLPHGuSf/r1nGFjRyL1hpc+uXZtIpBDFGvmTzEZ8tM44Hck8AV1G6PT4hDZq0MY44b5j7se5rlPDusy6dcalKkKv5sUafMemCTWlLrtvc8yQMjHqQcg0pqTdugRatcdeXjtkg/U+tZEh5yTz71cMsc6sY2yBxzWXcKST14PSqihSZWuG82Xarfu1/8AHj61Vd/KLGI4YD0yKluHIUKvBP8AKqjDbGxJ6DJJrdIxbGH7xLHPck01ILnU7xLSxtpLmVvupGpYt+FV2lMjc8LmvcdDt9P8G+DUlcrNM4DyvGOZXb7qg+mP5E0qk/ZrzCEOd+RyGm/DC9lhEut6iLVcf6iD52H1boP1rI8RaBo1jYMNLeV50+be8m7cO/AGK1tS8RahqVwzO5ihPAhQkAD39ayNQchIpQflYFTWUZTbvJmrjC1kjO0G8OneJLS5DbVcmJj7Ef44rsb3VjNMqONgHyivPLgFU3DgqQwrfe8juIIphyrrk+x7irqQu0yISsmjaZlKkscfWqslyq/KhyfUHgVmtOm37+cdiaiM5KkqRn8qhQLczRgkEdzIHfassZySe4O7+hqu2qWO8r5rHHGQvBrLnuHZNpFUsqv8OPWtFBPczc7bHRpqNkwJ3sMeqmp7bVog+1HMef7w61zke5wCkUjA/wB1SaeW8r78UiE/3lIocENTZ1cl05OWPJqt9scNkcfjWNDf/IEEpwOx6VaW4Rhkqf8AgNRyWL57k2oFbiAyjkAYbI7VjWDyb2s2OcHj6GrtzfbY2ijQjcMFj+tY8k7QTJPH98cc9xWkY6WMpPW5amkdZnVHIUMQKYjM7NuOa2LLwj4mv7NLu30l/KkGVLOqlh64NQ33hrxHpttJc3Gj3EcaLlpCuVUepIp80dri5Zb2IrB83csAxgxbj9c8fzqx5RHIarOgfD3Xtatk1JLqG2t5M/vC5Le/A/kSK6F/h5BDEFh8QTyXC9f3YK/lms5Tgna5cYya2OT82SJ9yMQRx9aZJcyPxwPoKuahpOpac7CaMTxr/wAtIeePdeorMWSOU/IwJ7juKpWeqB3WhFKCsm52zu6GmrbzX9xBp1ou6e5cRqPr3+lLfSrHGmTnrxXe/D/Qn02GXxNrCeVvTbAjDDBT3+p6D2yacpckeYmMeaXKTz+CNA0Lw7M91G9/eNGQsr5xv/2QOg575qpbXb3vgmO1kctJp8whP+0mPkP5HFT67qtzdXBLSkseMLwFHoB2FZmjEJc31q2Ns1vu2n1BBB/ImuZXavI6LJOyKckYHvUN7g6XKrdiCPbmtGSIjPH0qndorWsol4Xb19D2q09SWjnZI5LqaK0tYmlmnYKiLyWJ6AV29n8Mb8RhLjXFhyMukURbae4zn9atfDXRFUT+J7xAFGYrYsPu/wB5/wCg/Gun1DUF3MdxCD7qE9vf3pVKslLliFOmmuaRwOt+C9N0rTZH/tqe5vmKxwQhAod2YDHf1rbPw48OxWqhvEkguFUB2WVSC2OcLjpn3qhe3gl8QaRNPIscEd0uS/3V64J9s1ZujdwzPHKCro2CD60nKdlqNQjd6HH69pdvpV+beyvpbyLaD5jptyfb1rofAPhjTdcM15qbCby3CRW3mAb+MksOpHI/WszX2aSCNmXBDYHvms3Rbjybh0LYZGEimtnzSp6PUy0Uz3Z7W3XbFbJBCiqFCIMLx3GBiqr2iF9rhJB7rwKjmnKAEt1ArNe9CvjzDnvXnpM7Lk154d0u9Ui4023dT3UBWH0Iwa4TUfC0P2kR+G7qe4kDESJMMRx46/vDgZz2GTXVz6rJDGzRBpZCNqKD1Y8AfnXOX93NarBbRXDO9qGBlBxudmLOQPTcSB7AVvTcl1MpqL3Ob1TRta0xBLfWeIz1kjYOo+pHSsm3jNxcbiuVTnFej2PiF5rV4LuNXJUjOOG9iK5q/trON3ubGNbZjy0Wflb6en8q6I1Hs0YSgt0zso/FEl1pVqY5yPLiCSBTj58c8Cs2bWJpX2SNJIjDawYkgj0xXnovUJOyR0LHkDI/lV2HVWgT91cBj/dbml7G2xSrX3OitNUbSJRBEWNhcvsMeeYmPdfb2qee8njaQs7HacDc3FcdPqUkrxrK42q27aq4xx1qUXLXDEqk0xJ/hQtzVOn1YlU6HRt4gkYFJ7lZB2AGSPxrFungvEd5ERZcZDgYb/69U5HlWf7OLOfz/wDnmYyD+VbMPhLUrmxe5u50txtysEfzO3sewotGGuwrylpuaXgfw5Z3ds/ibXZA1tAxEMTnIYr1YjuAeAO5rTv/ABFLqt8XfMVpGSYYvT3Pqf8AIrjlvb7RrT+znzLaly4HRlbvkelRvq4eINH5cXqw6/gD0qXBylzMcZqKsa+p30ccnyDdK33U64+tWrSxex1WH7RIWungkkkH93IGBU/hLw+7BvEerIywxfNbxuOZWPQn+n59qtXTSN4gS5uMAyo6ZA7noP0FQ2l7qLSb95lefqfSsHV7rGy1XjOHb+gran3GTae/SuOvZ/P1GeQHKByqn2HH9KumrsVR2R//2Q==';
    R3.rockM=new T.MeshStandardMaterial({map:tx,roughness:1,vertexColors:true,emissive:0xffffff,emissiveMap:tx,emissiveIntensity:.34})}
   if(stageId==='route2'){ // Cueva de Diglett: montículo de dos pisos de bloques de piedra, sin juntas entre casillas (UV continuas en el mundo)
    if(x!==9||y!==8)continue;
    const rbk=(w,h,d,px,by,pz)=>{ // bloque con esquinas y aristas redondeadas, UV continuas en el mundo
     const bv=.09,rr=Math.min(.24,w*.4,d*.4),hx=w/2-bv,hz=d/2-bv,sh=new T.Shape(),r0=Math.max(.02,rr-bv);
     sh.moveTo(-hx+r0,-hz);sh.lineTo(hx-r0,-hz);sh.absarc(hx-r0,-hz+r0,r0,-Math.PI/2,0,false);sh.lineTo(hx,hz-r0);sh.absarc(hx-r0,hz-r0,r0,0,Math.PI/2,false);sh.lineTo(-hx+r0,hz);sh.absarc(-hx+r0,hz-r0,r0,Math.PI/2,Math.PI,false);sh.lineTo(-hx,-hz+r0);sh.absarc(-hx+r0,-hz+r0,r0,Math.PI,Math.PI*1.5,false);
     const bg=new T.ExtrudeGeometry(sh,{depth:Math.max(.05,h-2*bv),bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:3,curveSegments:6});
     bg.rotateX(-Math.PI/2);bg.computeBoundingBox();bg.translate(0,-bg.boundingBox.min.y,0);bg.computeVertexNormals();
     const bp=bg.attributes.position,bn=bg.attributes.normal,bu=bg.attributes.uv,K=.34,col=new Float32Array(bp.count*3).fill(1);
     for(let k=0;k<bp.count;k++){const qx=bp.getX(k)+px,qy=bp.getY(k)+by,qz=bp.getZ(k)+pz;if(Math.abs(bn.getY(k))>.5)bu.setXY(k,qx*K,qz*K);else if(Math.abs(bn.getX(k))>Math.abs(bn.getZ(k)))bu.setXY(k,qz*K,qy*K);else bu.setXY(k,qx*K,qy*K)}
     bg.setAttribute('color',new T.BufferAttribute(col,3));const m=new T.Mesh(bg,R3.rockM);add(m,px,by,pz)};
    // piso 1: huella completa (9..12 × 7..10, sin la casilla 9,7); piso 2: más compacto, retranqueado en los bordes
    rbk(3,.8,2.02,10.5,0,9);rbk(2,.8,1.02,11,0,7.5);
    rbk(2.3,.7,1.62,10.5,.74,8.95);rbk(1.3,.7,.8,11.0,.74,7.9);
    continue}
   const hh=stageId==='route2'?(x<=10?1.3:.7):stageId==='mtmoonc'?(y<=0?1.0:.62):y<=1?1.2:y<=3?.75:.5; // Ruta 2: más altas y con un segundo nivel más bajo a la derecha
   const bg=(()=>{const bv=.07,r0=.13,h=.5-bv,sh=new T.Shape();sh.moveTo(-h+r0,-h);sh.lineTo(h-r0,-h);sh.absarc(h-r0,-h+r0,r0,-Math.PI/2,0,false);sh.lineTo(h,h-r0);sh.absarc(h-r0,h-r0,r0,0,Math.PI/2,false);sh.lineTo(-h+r0,h);sh.absarc(-h+r0,h-r0,r0,Math.PI/2,Math.PI,false);sh.lineTo(-h,-h+r0);sh.absarc(-h+r0,-h+r0,r0,Math.PI,Math.PI*1.5,false);
 const g=new T.ExtrudeGeometry(sh,{depth:hh-2*bv,bevelEnabled:true,bevelThickness:bv,bevelSize:bv,bevelSegments:3,curveSegments:4});g.rotateX(-Math.PI/2);g.translate(0,-hh/2+bv,0);g.computeVertexNormals();return g})(),bp=bg.attributes.position,bn=bg.attributes.normal,bu=bg.attributes.uv,K=.34;for(let k=0;k<bp.count;k++){const px=bp.getX(k)+cx,py=bp.getY(k)+hh/2,pz=bp.getZ(k)+cz;if(Math.abs(bn.getY(k))>.5)bu.setXY(k,px*K,pz*K);else if(Math.abs(bn.getX(k))>.5)bu.setXY(k,pz*K,py*K);else bu.setXY(k,px*K,py*K)}{const hs2=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v)},col=new Float32Array(bp.count*3);for(let k=0;k<bp.count;k++){const ny=bn.getY(k),ring=Math.abs(bp.getX(k))>.36||Math.abs(bp.getZ(k))>.36;let c=ny>.98?1:ny>.15?.5:.85;if(ny>.98&&ring)c=.8;col[k*3]=c;col[k*3+1]=c*.96;col[k*3+2]=c*.98;
 if(ring&&ny>-.5){const q=Math.round(bp.getX(k)*40)+'_'+Math.round(bp.getZ(k)*40);bp.setX(k,bp.getX(k)+(hs2(cx*9+Math.round(bp.getX(k)*40),cz*7+Math.round(bp.getZ(k)*40))-.5)*.1);bp.setZ(k,bp.getZ(k)+(hs2(cz*5+Math.round(bp.getZ(k)*40),cx*3+Math.round(bp.getX(k)*40))-.5)*.1)}}
 bg.setAttribute('color',new T.BufferAttribute(col,3));bg.computeVertexNormals()}
   const bm=new T.Mesh(bg,R3.rockM);add(bm,cx,hh/2-.05,cz);
   if(!R3.rockSp){R3.rockSp=[0,1,2,3].map(sd=>{const Wd=28,Ht=20,c=document.createElement('canvas');c.width=Wd;c.height=Ht;const g2=c.getContext('2d');
     const hs=(a,b)=>{const v=Math.sin(a*127.1+b*311.7+sd*17.3)*43758.5453;return v-Math.floor(v)};
     const bl=[[8+sd%2*2,12,8,7],[17,11,9,8],[13,9,7,7+(sd>>1)]];
     const inside=(xx,yy)=>bl.some(([cx2,cy2,rx,ry])=>((xx-cx2)/rx)**2+((yy-cy2)/ry)**2<=1);
     for(let yy=0;yy<Ht;yy++)for(let xx=0;xx<Wd;xx++){if(!inside(xx,yy))continue;
      const edge=!inside(xx-1,yy)||!inside(xx+1,yy)||!inside(xx,yy-1)||!inside(xx,yy+1);
      const up=!inside(xx,yy-2),lit=!inside(xx-2,yy-1)||up;let col;
      if(edge&&(!inside(xx,yy+1)||!inside(xx+1,yy)))col='#4a3238';
      else if(up||yy<8+hs(xx>>2,0)*4)col=hs(xx>>1,yy>>1)<.55?'#c4a98d':'#b09478';
      else if(xx<12+hs(0,yy>>2)*3)col=hs(xx>>2,yy>>2)<.25?'#6b4a52':'#8f6a6c';
      else col=hs(xx>>2,yy>>1)<.3?'#4e353e':'#6b4a52';
      g2.fillStyle=col;g2.fillRect(xx,yy,1,1)}
     return c})}
   const nb=(dx,dy)=>fch(stageId,x+dx,y+dy)==='W';const edge=!nb(0,1)||!nb(1,0)||!nb(-1,0);
   const nr=0;
   for(let q=0;q<nr;q++){const sc=1.25+rnd(x,y,q+3)*.45,ox=(q?.28:-.28)+(rnd(x,y,q+9)-.5)*.3,oz=(q?-.22:.22)+(rnd(x,y,q+15)-.5)*.3;
    bb(R3.rockSp[(x*3+y*5+q)%4],sc*1.25,sc*.9,cx+ox,cz+oz,hh-.1)}
   continue}
  if(ch==='W'){ // muro / acantilado
   const h=.7+r*.5,m=box(.98,h,.98,th.wall);add(m,cx,h/2-.05,cz);
   if(r>.45){const c=box(.6,.18+r*.2,.6,th.wall);c.rotation.y=r*3;add(c,cx+(r-.6)*.3,h+.04,cz+(.5-r)*.3)}
   continue}
  if(ch==='t'&&(stageId==='ceruleanrival'||stageId==='route25'||stageId==='route25b')){const bm=new T.MeshStandardMaterial({color:['#5fbb4f','#58b04a','#66c456'][(r*3|0)%3],roughness:.9,flatShading:true}),b1=new T.Mesh(new T.IcosahedronGeometry(.43,1),bm);b1.scale.set(1,.86,1);add(b1,cx,.36,cz,true,true);
   const b2=new T.Mesh(new T.IcosahedronGeometry(.18,1),new T.MeshStandardMaterial({color:'#86d870',roughness:.9,flatShading:true}));b2.scale.set(1.2,.6,.9);add(b2,cx-.12,.6,cz-.1,false,false);continue}
  if(ch==='t'){
   const col=th.tree[(r*3|0)%3],sd=(x*7+y*3)|0,s1=.92+r*.2;
   tree3d(pine,cx,cz,.95*s1+.1,r*6);continue}
  if(ch==='T'){r3Grass(T,g,cx,cz,rnd(x,y)*6,R3.anim.grass);continue}
  if(ch==='o'){const a0=rnd(x,y,3)*6.283,cl=['#ff7fa8','#ffffff','#9ad0ff','#ffd447'],c0=Math.floor(rnd(x,y,5)*4);for(let i=0;i<3;i++){const an=a0+i*2.094,rr=.27+(rnd(x,y,i+7)-.5)*.06;bbd(pxaFlower(cl[(c0+i)%4]),.4,.46,cx+Math.cos(an)*rr,cz+Math.sin(an)*rr,rnd(x,y,i+11)*3.14)}continue} // 3 flores a 120°: no se tapan entre sí desde ningún ángulo de cámara
  if(ch==='p'){continue}
  if(ch==='R'&&stageId==='route3'&&R3.rockM){ // peñasco grande 2x2 con la textura de roca
   if(x!==8||y!==8)continue;
   const rb=(w,h,d,px,py,pz)=>{const bg=new T.BoxGeometry(w,h,d),bp=bg.attributes.position,bn=bg.attributes.normal,bu=bg.attributes.uv,K=.34;for(let k=0;k<bp.count;k++){const qx=bp.getX(k)+px,qy=bp.getY(k)+py,qz=bp.getZ(k)+pz;if(Math.abs(bn.getY(k))>.5)bu.setXY(k,qx*K,qz*K);else if(Math.abs(bn.getX(k))>.5)bu.setXY(k,qz*K,qy*K);else bu.setXY(k,qx*K,qy*K)}const m=new T.Mesh(bg,R3.rockM);add(m,px,py,pz)};
   const bx=cx+.5,bz=cz+.5;
   rb(1.9,.9,1.9,bx,.4,bz);rb(1.55,.35,1.55,bx-.05,.97,bz+.03);rb(1.0,.3,1.0,bx-.1,1.25,bz+.05);rb(.8,.5,.7,bx+.55,.3,bz-.55);
   continue}
  if(ch==='r'||(ch==='k'&&th.kind==='cave')){
   if(th.kind==='cave'&&ch==='k'){bb(pxaStalag(th.wall,x*5+y),.9,1.5,cx,cz+.05);blob(cx,cz+.05,.3);continue}
   if(th.kind==='cave'&&ch==='r'){ // peñasco 3D fijo (no gira con la cámara)
    const lumps=[[-.2,.24,.12,.31,'#a8756a'],[.19,.22,.07,.29,'#8f5f58'],[-.02,.32,-.14,.27,'#bd8a7c']];
    lumps.forEach(([ox,oy,oz,rr,col],q)=>{const geo=new T.IcosahedronGeometry(rr*.78,1),pp=geo.attributes.position;for(let k=0;k<pp.count;k++){const f=1+(Math.sin(pp.getX(k)*41+pp.getY(k)*17+pp.getZ(k)*29+x*3+y*5+q)*.5)*.16;pp.setXYZ(k,pp.getX(k)*f,pp.getY(k)*f*.82,pp.getZ(k)*f)}geo.computeVertexNormals();
     const m=new T.Mesh(geo,new T.MeshStandardMaterial({color:col,roughness:.95,flatShading:true,emissive:col,emissiveIntensity:.16}));
     m.rotation.y=rnd(x,y,q+20)*6;add(m,cx+ox*1.25,oy*.62,cz+oz*1.25,true,true)});
    blob(cx,cz+.04,.4);continue}
   const n=ch==='r'?2:1,rk=th.kind==='gym'?.75:1;for(let i=0;i<n;i++){const ox=(i?.22:-.05)*rk,oz=(i?-.15:.05)*rk;bb(pxaRock(th.kind==='cave'?'#7a7268':'#9aa0a8',x*3+y+i),(1.1-i*.3)*rk,(.8-i*.2)*rk,cx+ox,cz+oz);blob(cx+ox,cz+oz,.34*rk)}
   continue}
  if(ch==='s'){add(cyl(.04,.04,.45,5,'#7a5636'),cx,.22,cz);const b=box(.5,.26,.06,'#d9b87a');add(b,cx,.5,cz);continue}
  if(ch==='v'||ch==='w'){for(const d of [-.25,.25]){const px=ch==='w'?cx+d:cx,pz=ch==='v'?cz+d:cz;add(cyl(.12,.12,.42,8,'#7a4636'),px,.21,pz);add(cyl(.1,.1,.04,8,'#e2bd94'),px,.43,pz)}continue}
  if(ch==='f'&&stageId==='forestexit'){for(const dz of [-.4,.4])add(box(.07,.4,.07,'#e9dcc0'),cx,.2,cz+dz);add(box(.05,.06,.9,'#e9dcc0'),cx,.28,cz);add(box(.05,.06,.9,'#e9dcc0'),cx,.14,cz);continue}
  if(ch==='f'&&(stageId==='ceruleanrival'||stageId==='vermilionrival'||stageId==='route6'||stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain')){const vert=(fch(stageId,x,y-1)==='f'||fch(stageId,x,y+1)==='f')&&fch(stageId,x-1,y)!=='f'&&fch(stageId,x+1,y)!=='f',fc='#e9dcc0';
   if(vert){for(const dz of [-.5,.5])add(box(.09,.42,.09,fc),cx,.21,cz+dz);add(box(.05,.06,1,fc),cx,.3,cz);add(box(.05,.06,1,fc),cx,.15,cz)}
   else{for(const dx of [-.5,.5])add(box(.09,.42,.09,fc),cx+dx,.21,cz);add(box(1,.06,.05,fc),cx,.3,cz);add(box(1,.06,.05,fc),cx,.15,cz)}continue}
  if(ch==='f'){for(const dx of [-.4,.4])add(box(.07,.4,.07,'#e9dcc0'),cx+dx,.2,cz);add(box(.9,.06,.05,'#e9dcc0'),cx,.28,cz);add(box(.9,.06,.05,'#e9dcc0'),cx,.14,cz);continue}
  if(ch==='h'&&stageId==='ceruleanrival'){if(fch(stageId,x-1,y)==='h'||fch(stageId,x,y-1)==='h')continue;let hw=1,hd=1;while(fch(stageId,x+hw,y)==='h')hw++;while(fch(stageId,x,y+hd)==='h')hd++;
   const wallH=.62,w0=hw*.94,d0=hd*.94,hx=x+hw/2,hz=y+hd/2;add(box(w0,wallH,d0,'#efe7d6'),hx,wallH/2,hz,true,true);
   {const rc=document.createElement('canvas');rc.width=32;rc.height=32;const q=rc.getContext('2d');q.fillStyle='#5c98d2';q.fillRect(0,0,32,32);for(let yy=0;yy<32;yy+=4){q.fillStyle='#4b82bb';q.fillRect(0,yy+3,32,1);q.fillStyle='#78b0e4';q.fillRect(0,yy,32,1)}
    const rt=new T.CanvasTexture(rc);rt.colorSpace=T.SRGBColorSpace;rt.magFilter=rt.minFilter=T.NearestFilter;rt.generateMipmaps=false;rt.wrapS=rt.wrapT=T.RepeatWrapping;rt.repeat.set(Math.max(1,hw*1.4),Math.max(1,hd*1.4));
    const sideM=new T.MeshStandardMaterial({color:'#3f6f9f',roughness:.9}),topM=new T.MeshStandardMaterial({map:rt,roughness:.85});
    const rf=new T.Mesh(new T.BoxGeometry(w0+.14,.2,d0+.14),[sideM,sideM,topM,sideM,sideM,sideM]);add(rf,hx,wallH+.1,hz,true,true)}
   add(box(.34,.42,.05,'#7a5238'),hx,.21,y+hd-.02,false,false);for(let k=0;k<hw;k+=2){add(box(.26,.22,.04,'#9cc7e0'),x+.5+k+(hw>1?.5:0),.38,y+hd-.02+(hd>1?0:0),false,false)}
   continue}
  if(ch==='h'){add(box(.82,.55,.82,'#f1e6d0'),cx,.28,cz);const rf=cone(.75,.42,4,'#d4574a');rf.rotation.y=Math.PI/4;add(rf,cx,.76,cz);add(box(.2,.3,.04,'#6b4a35'),cx,.15,cz+.42);continue}
  if(ch==='B'){add(box(.96,.9,.9,'#8a6a47'),cx,.45,cz);for(let i=0;i<3;i++)add(box(.9,.05,.85,'#6b4f33'),cx,.15+i*.28,cz);for(let i=0;i<5;i++)add(box(.12,.2,.08,['#d4574a','#4a7ed4','#e8c24a','#58a85a','#9a6ad4'][i]),cx-.36+i*.18,.34+(i%2)*.28,cz+.4);continue}
  if(ch==='C'){add(box(.9,.5,.85,'#5b6b82'),cx,.25,cz);add(box(.7,.35,.1,'#9ad4ff',{emissive:'#4a9ad4',emissiveIntensity:.6}),cx,.7,cz-.1);continue}
  if(ch==='M'){add(box(.92,.95,.9,'#7d8ca3'),cx,.47,cz);add(box(.5,.3,.05,'#2a3a52'),cx,.6,cz+.46);add(new T.Mesh(new T.SphereGeometry(.07,8,6),r3mat('#ff6a5a',{emissive:'#ff3a2a',emissiveIntensity:.8})),cx+.28,.82,cz+.46);continue}
  if(ch==='P'){add(cyl(.2,.15,.25,8,'#c06a4a'),cx,.12,cz);for(let i=0;i<5;i++){const lf=cone(.1,.45,4,'#4aa851');lf.rotation.z=(i-2)*.25;add(lf,cx+(i-2)*.07,.45,cz)}continue}
  if(ch==='k'){add(box(.95,.1,.9,'#b88a55'),cx,.42,cz);for(const [dx,dz] of [[-.4,-.38],[.4,-.38],[-.4,.38],[.4,.38]])add(box(.07,.4,.07,'#8a6339'),cx+dx,.2,cz+dz);continue}
 }

 const SXS=stageId==='mtmoonc'?{x0:6,n:2,z0:5,top:'#c9a066',front:'#6a3236',side:'#5e3033',line:'#8a5a3a'}:stageId==='ceruleanrival'?{x0:5,n:3,z0:3,top:'#f1dd8e',front:'#b99346',side:'#8b6a32',line:'#d4b868'}:(stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain')?{x0:0,n:0}:null;
 if(SXS){
  const rockOk=stageId==='mtmoonc'?!!R3.rockM:true;
  if(rockOk){const fm=stageId==='mtmoonc'?new T.MeshStandardMaterial({map:R3.rockM.map,roughness:1,emissive:0xffffff,emissiveMap:R3.rockM.map,emissiveIntensity:.34,color:0xb09c92}):new T.MeshStandardMaterial({color:SXS.n?'#b88f45':'#a8843c',roughness:1});
   for(const k of E.keys()){const [ex,ey]=k.split(',').map(Number);for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const nx=ex+dx,ny=ey+dy;if(E.has(nx+','+ny)||(nx>=0&&ny>=0&&nx<W&&ny<H&&fch(stageId,nx,ny)==='W'))continue;
    if(stageId==='ceruleanrival'&&dy===1&&nx>=SXS.x0&&nx<SXS.x0+SXS.n&&ny===SXS.z0)continue;
    const m=new T.Mesh(new T.BoxGeometry(dx?.12:1,EH,dy?.12:1),fm);m.position.set(ex+.5+dx*.5,EH/2,ey+.5+dy*.5);m.userData.noElev=true;_gadd.call(g,m)}}}
  for(const k of E.keys()){const [ex,ey]=k.split(',').map(Number),pg=new T.PlaneGeometry(1,1),uv=pg.attributes.uv;for(let q=0;q<uv.count;q++){const u0=uv.getX(q),v0=uv.getY(q);uv.setXY(q,(ex+u0)/W,1-(ey+1-v0)/H)}
   const dm=new T.Mesh(pg,new T.MeshBasicMaterial({map:R3.decalTex,transparent:true,depthWrite:false,toneMapped:false}));dm.rotation.x=-Math.PI/2;dm.position.set(ex+.5,EH+.05,ey+.5);dm.renderOrder=5;dm.userData.noElev=true;_gadd.call(g,dm)}
  if(SXS.n)for(let c=0;c<SXS.n;c++)for(let i=0;i<4;i++){const ex=SXS.x0+c,hh=EH*(4-i)/5,pg=new T.PlaneGeometry(1,.25),uv=pg.attributes.uv;for(let q=0;q<uv.count;q++){const u0=uv.getX(q),v0=uv.getY(q);uv.setXY(q,(ex+u0)/W,1-(SXS.z0+i*.25+(1-v0)*.25)/H)}
   const dm=new T.Mesh(pg,new T.MeshBasicMaterial({map:R3.decalTex,transparent:true,depthWrite:false,toneMapped:false}));dm.rotation.x=-Math.PI/2;dm.position.set(ex+.5,hh+.03,SXS.z0+.125+i*.25);dm.renderOrder=6;dm.userData.noElev=true;_gadd.call(g,dm)}
  if(SXS.n){const mt=c=>new T.MeshBasicMaterial({color:c,toneMapped:false}),side=mt(SXS.side),top=mt(SXS.top),front=mt(SXS.front),cx0=SXS.x0+SXS.n/2,wd=SXS.n-.06;
   for(let i=0;i<4;i++){const hh=EH*(4-i)/5,m=new T.Mesh(new T.BoxGeometry(wd,hh,.25),[side,side,top,side,front,side]);m.position.set(cx0,hh/2,SXS.z0+.125+i*.25);m.userData.noElev=true;_gadd.call(g,m);
    const ln=new T.Mesh(new T.BoxGeometry(wd,.012,.03),mt(SXS.line));ln.position.set(cx0,hh+.007,SXS.z0+.125+i*.25+.06);ln.userData.noElev=true;_gadd.call(g,ln)}
   for(const sx of [SXS.x0+.03,SXS.x0+SXS.n-.03]){const r=new T.Mesh(new T.BoxGeometry(.06,EH*.5,1.02),side);r.position.set(sx,EH*.28,SXS.z0+.5);r.userData.noElev=true;_gadd.call(g,r)}}
  if(stageId==='nugget'||stageId==='nuggetrocket'||stageId==='nuggettrain'){const rm=new T.MeshStandardMaterial({color:'#d9bb66',roughness:1}),rd=new T.MeshStandardMaterial({color:'#a8843c',roughness:1});
   let dMin=99,dMax=-1;for(let x=0;x<W;x++)if(fch(stageId,x,0)==='D'){dMin=Math.min(dMin,x);dMax=Math.max(dMax,x)}
   for(const rx of [dMin+.04,dMax+1-.04]){for(const yy of [.30,.55]){const rl=new T.Mesh(new T.BoxGeometry(.08,.07,H),rm);rl.position.set(rx,EH+yy,H/2);rl.userData.noElev=true;_gadd.call(g,rl)}
    for(let pz=0;pz<=H;pz++){const po=new T.Mesh(new T.BoxGeometry(.11,.62,.11),rd);po.position.set(rx,EH+.31,Math.min(H-.06,Math.max(.06,pz)));po.userData.noElev=true;_gadd.call(g,po)}}}
  if(stageId==='ceruleanrival'){const rm=new T.MeshStandardMaterial({color:'#e9d48a',roughness:1}),rd=new T.MeshStandardMaterial({color:'#b99346',roughness:1});
   for(const rx of [5.04,7.96]){const rl=new T.Mesh(new T.BoxGeometry(.07,.05,3),rm);rl.position.set(rx,EH+.3,1.5);rl.userData.noElev=true;_gadd.call(g,rl);const rl2=rl.clone();rl2.position.y=EH+.17;_gadd.call(g,rl2);
    for(const pz of [.1,.8,1.5,2.2,2.9]){const po=new T.Mesh(new T.BoxGeometry(.09,.38,.09),rd);po.position.set(rx,EH+.19,pz);po.userData.noElev=true;_gadd.call(g,po)}}}
 }
 g.add=_gadd;
 R3.labWalls=[];
 if(th.kind==='lab'){
  const mk=(w,h,d,x,z,nx,nz,rx,ry)=>{const t=new T.CanvasTexture(pxaLabWall());t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx*.5,1);t.magFilter=T.NearestFilter;t.minFilter=T.NearestMipmapLinearFilter;
   const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({map:t,roughness:1}));m.position.set(x,h/2-.05,z);m.castShadow=false;m.receiveShadow=true;g.add(m);R3.labWalls.push({m,nx,nz})};
  mk(W+.8,1.8,.4,W/2,-.2,0,-1,(W+.8)/2,1.8/2);mk(W+.8,1.8,.4,W/2,H+.2,0,1,(W+.8)/2,1.8/2);
  mk(.4,1.8,H,-.2,H/2,-1,0,.4/2,1.8/2);mk(.4,1.8,H,W+.2,H/2,1,0,.4/2,1.8/2);
  const dec=(cv,wu,hu,x,y)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;const sp=new T.Mesh(new T.PlaneGeometry(wu,hu),new T.MeshBasicMaterial({map:t,transparent:true,alphaTest:.5,toneMapped:false}));sp.position.set(x,y+hu/2,.03);g.add(sp);R3.labWalls.push({m:sp,nx:0,nz:-1})};
  dec(pxaWindow(),1.2,1.04,9.4,.78);dec(pxaPoster(),.75,.95,4.4,.8);dec(pxaPoster(),.75,.95,5.5,.8);
 }
 // motas de polvo/luciérnagas flotantes
 const N=36,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=Math.random()*W;pos[i*3+1]=.4+Math.random()*2.4;pos[i*3+2]=Math.random()*H}
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));
 const motes=new T.Points(pg,new T.PointsMaterial({color:th.kind==='cave'?0x9ec4ff:0xffffff,size:.06,transparent:true,opacity:.55,depthWrite:false}));if(th.kind!=='pool'){g.add(motes);R3.anim.motes=motes}

 if(stageId==='camp'){ // fogata en la arena central (6,4) con brasas y resplandor
  const fx=6.5,fz=4.5,F=new T.Group();F.position.set(fx,0,fz);F.scale.setScalar(1.55);g.add(F);
  const warm=(c,k)=>{const m=new T.MeshBasicMaterial({color:c,toneMapped:false});m.color.multiplyScalar(k);return m};const stoneC=['#d6a878','#c2925f','#e0b88a'];for(let i=0;i<9;i++){const a=i/9*Math.PI*2,s=new T.Mesh(new T.IcosahedronGeometry(.1+.02*(i%3),0),warm(stoneC[i%3],1.6));s.position.set(Math.cos(a)*.34,.07,Math.sin(a)*.34);s.scale.set(1.15,.75,1);s.rotation.y=i;s.castShadow=true;F.add(s)}
  for(let i=0;i<4;i++){const l=new T.Mesh(new T.CylinderGeometry(.045,.05,.5,6),warm(i%2?'#8a5a30':'#6e4524',1.7));l.rotation.z=Math.PI/2;l.rotation.y=i*Math.PI/4+.3;l.position.y=.1+(i%2)*.05;F.add(l)}
  if(campNight()){
  const fm=(c,o)=>{const m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,toneMapped:false,depthWrite:false});m.color.multiplyScalar(2.6);return m};
  const flames=[[.2,.62,'#e8531a',.9,0],[.15,.5,'#ff9a2a',.95,1.7],[.1,.38,'#ffe27a',.95,3.1]].map(([r,h,c,o,ph])=>{const m=new T.Mesh(new T.ConeGeometry(r,h,7),fm(c,o));m.position.y=.12+h/2;m.userData={ph,h};F.add(m);return m});
  const gc=document.createElement('canvas');gc.width=gc.height=64;{const q=gc.getContext('2d'),gr=q.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(255,170,70,.85)');gr.addColorStop(.35,'rgba(255,120,40,.38)');gr.addColorStop(1,'rgba(255,100,30,0)');q.fillStyle=gr;q.fillRect(0,0,64,64)}
  const gt=new T.CanvasTexture(gc);gt.colorSpace=T.SRGBColorSpace;
  const glow=new T.Mesh(new T.PlaneGeometry(5.4,5.4),new T.MeshBasicMaterial({map:gt,transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false,color:new T.Color(2,1.6,1.2)}));glow.rotation.x=-Math.PI/2;glow.position.y=.075;glow.renderOrder=3;F.add(glow);
  const N=16,ep=new Float32Array(N*3),ed=[];for(let i=0;i<N;i++){ed.push({a:Math.random()*6.28,r:Math.random()*.12,sp:.35+Math.random()*.5,ph:Math.random()*5,dr:(Math.random()-.5)*.3})}
  const eg=new T.BufferGeometry();eg.setAttribute('position',new T.BufferAttribute(ep,3));
  const embers=new T.Points(eg,new T.PointsMaterial({color:0xffb347,size:.07,transparent:true,opacity:.9,depthWrite:false,toneMapped:false}));embers.frustumCulled=false;F.add(embers);
  R3.anim.fire={flames,glow,embers,ed,ep}}
  else{const ash=new T.Mesh(new T.CircleGeometry(.24,12),new T.MeshBasicMaterial({color:0x2a2420,transparent:true,opacity:.85}));ash.rotation.x=-Math.PI/2;ash.position.y=.03;F.add(ash);for(const l of F.children)if(l.geometry&&l.geometry.type==='CylinderGeometry')l.material=warm('#3b2c22',1)} // de día la fogata está apagada: cenizas y troncos quemados
 }

 if(stageId==='camp'){ // grieta de luz pálida en (6,1): acceso al mapa «???»
  const px=6.5,pz=1.5,PG=new T.Group();PG.position.set(px,0,pz);g.add(PG);
  const disc=new T.Mesh(new T.CircleGeometry(.4,28),new T.MeshBasicMaterial({color:0x070a1c,toneMapped:false}));disc.rotation.x=-Math.PI/2;disc.position.y=.06;PG.add(disc);
  const rm=new T.MeshBasicMaterial({color:0xdfe9ff,transparent:true,opacity:.98,toneMapped:false,depthWrite:false});rm.color.multiplyScalar(1.8);
  const ring=new T.Mesh(new T.RingGeometry(.4,.52,32),rm);ring.rotation.x=-Math.PI/2;ring.position.y=.075;PG.add(ring);
  const bcv=document.createElement('canvas');bcv.width=4;bcv.height=64;{const q=bcv.getContext('2d'),gr=q.createLinearGradient(0,64,0,0);gr.addColorStop(0,'rgba(230,238,255,0)');gr.addColorStop(.1,'rgba(230,238,255,0)');gr.addColorStop(.3,'rgba(230,238,255,.6)');gr.addColorStop(1,'rgba(200,220,255,0)');q.fillStyle=gr;q.fillRect(0,0,4,64)}
  const bt=new T.CanvasTexture(bcv);bt.colorSpace=T.SRGBColorSpace;
  const bm=new T.MeshBasicMaterial({map:bt,transparent:true,opacity:.6,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false});
  const beam=new T.Mesh(new T.CylinderGeometry(.34,.44,2.6,18,1,true),bm);beam.position.y=1.45;PG.add(beam);
  const qc=document.createElement('canvas');qc.width=qc.height=64;{const q=qc.getContext('2d');q.font='bold 46px sans-serif';q.textAlign='center';q.textBaseline='middle';q.lineWidth=7;q.lineJoin='round';q.strokeStyle='#1b2a5a';q.strokeText('?',32,35);q.fillStyle='#f4f8ff';q.fillText('?',32,35)}
  const qt=new T.CanvasTexture(qc);qt.colorSpace=T.SRGBColorSpace;const qs=new T.Sprite(new T.SpriteMaterial({map:qt,transparent:true,depthWrite:false,depthTest:false,toneMapped:false}));qs.scale.set(.8,.8,1);qs.position.y=2.35;qs.renderOrder=12;qs.raycast=()=>{};PG.add(qs);
  const N=14,pp=new Float32Array(N*3),pd=[];for(let i=0;i<N;i++){pd.push({a:Math.random()*6.28,r:.12+Math.random()*.36,sp:.25+Math.random()*.4,ph:Math.random()*5})}
  const pgm=new T.BufferGeometry();pgm.setAttribute('position',new T.BufferAttribute(pp,3));const pts=new T.Points(pgm,new T.PointsMaterial({color:0xe6efff,size:.07,transparent:true,opacity:.9,depthWrite:false,toneMapped:false}));pts.frustumCulled=false;PG.add(pts);
  R3.anim.portal={ring,beam,qs,pts,pd,pp,glow:ring}}
 // luz y fondo del escenario
 R3.hemi.color.setHex(th.hemi[0]);R3.hemi.groundColor.setHex(th.hemi[1]);R3.hemi.intensity=th.hemiI;R3.sun.color.setHex(th.sun);R3.sun.intensity=th.sunI;
 {{const bgc=pxaBackdrop(th,false,true);R3.wrap.style.background='url('+bgc.toDataURL()+') center/100% 100%';R3.wrap.style.imageRendering='pixelated'}
  // Tierra del mapa lunar: elemento aparte (no se estira con la proporción de la pantalla, así se ve siempre redonda)
  {const old=R3.wrap.querySelector('.lunarEarth');if(old)old.remove();R3.wrap.style.isolation='';
   if(th.lunar){const d=document.createElement('div');d.className='lunarEarth';d.style.cssText='position:absolute;z-index:-1;pointer-events:none;image-rendering:pixelated;aspect-ratio:1;width:min(19%,22vh);left:63%;top:7%;background:url('+pxaEarth().toDataURL()+') center/100% 100% no-repeat';R3.wrap.style.isolation='isolate';R3.wrap.insertBefore(d,R3.wrap.firstChild)}}}
}
function r3unit(u){
 let rec=R3.units.get(u);if(rec)return rec;
 const T=R3.T,cv=document.createElement('canvas');cv.width=168;cv.height=168;
 const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;tex.minFilter=T.NearestFilter;tex.magFilter=T.NearestFilter;tex.generateMipmaps=false;
 const smat=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,depthTest:true,toneMapped:false});
 smat.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('gl_Position = projectionMatrix * mvPosition;','gl_Position = projectionMatrix * mvPosition;{vec4 q=projectionMatrix*(mvPosition+vec4(0.,0.,.75,0.));gl_Position.z=q.z*gl_Position.w/q.w;}')};
 const sp=new T.Sprite(smat);sp.center.set(.5,.12);sp.scale.set(2.4,2.4,1);sp.renderOrder=8;sp.layers.set(1);
 const hcv=document.createElement('canvas');hcv.width=168;hcv.height=168;const htex=new T.CanvasTexture(hcv);htex.colorSpace=T.SRGBColorSpace;htex.minFilter=T.NearestFilter;htex.magFilter=T.NearestFilter;htex.generateMipmaps=false;
 const hs=new T.Sprite(new T.SpriteMaterial({map:htex,transparent:true,depthWrite:false,depthTest:false,toneMapped:false}));hs.center.set(.5,.12);hs.scale.set(2.4,2.4,1);hs.renderOrder=9;hs.layers.set(1);
 const sh=new T.Mesh(new T.CircleGeometry(.34,20),new T.MeshBasicMaterial({color:0x0b1020,transparent:true,opacity:.34,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.set(1,.62,1);sh.renderOrder=3;
 const ring=new T.Mesh(new T.RingGeometry(.4,.47,36),new T.MeshBasicMaterial({color:u.side==='player'?0x6cc4ff:0xff6a6a,transparent:true,opacity:.75,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.renderOrder=4;
 R3.unitGroup.add(sp,hs,sh,ring);
 rec={u,cv,g:cv.getContext('2d'),tex,sp,hs,hg:hcv.getContext('2d'),htex,sh,ring};R3.units.set(u,rec);return rec;
}
function r3elev(px,pz){const E=R3.elev;if(!E||!E.size)return 0;const x0=Math.floor(px),z0=Math.floor(pz),fx=px-x0,fz=pz-z0,e=(a,b)=>E.has(a+','+b)?R3.eh:0;return e(x0,z0)*(1-fx)*(1-fz)+e(x0+1,z0)*fx*(1-fz)+e(x0,z0+1)*(1-fx)*fz+e(x0+1,z0+1)*fx*fz}
function r3paintUnit(rec,u,time,walking,fdx,fdy,selectedNow){
 // reposo: si no cambió nada y pasaron <50 ms, se reutiliza la textura (evita redibujar y subir a la GPU 60 veces por segundo)
 {const sig=[u.hp,u.acted,u.asleep,u.poisoned,u.trapped,u.critUp,u.paralyzed,u.burned,u.x,u.y,u.shiny,R3.yaw.toFixed(3),selectedNow,window.__campOn,rec.grass,rec.gAmt,u._fv,u._fr].join('|');
  if(!walking&&!u.trapped&&!rec.grass&&!u.shiny&&rec._sig===sig&&time-rec._pt<50&&time>=rec._pt)return;rec._sig=sig;rec._pt=time}
 const g=rec.g;g.clearRect(0,0,168,168);g.imageSmoothingEnabled=false;let topY=60;rec.K=1;
 const pr=pmdOk(pkId(u));
 if(walking){if(fdx!==0){u._fr=fdx>0;u._fv=0}else if(fdy!==0)u._fv=fdy>0?1:2}
 const dim=(u.acted&&!(u.asleep>0))||u.hp<=0;
 if(pr){
  const wr=walking?pmdGet(pkId(u),'Walk'):null,po=(selectedNow&&!walking&&!u.acted)?pmdGet(pkId(u),'Pose'):null,sl=(!walking&&u.asleep>0&&u.hp>0)?pmdGet(pkId(u),'Sleep'):null,R=sl&&sl.ready?sl:wr&&wr.ready?wr:(po&&po.ready?po:pr),ib=pr.m.bb;
  const bwN=ib[2]-ib[0],bhN=ib[3]-ib[1],KK=Math.max(1,Math.min(1.9,Math.pow(Math.sqrt(bwN*bhN)/34,.8)));rec.K=KK>1.04?KK:1; // los Pokémon grandes (Onix, etc.) se dibujan más grandes
  const fitK=(()=>{let k=1e9;for(const mm of new Set([pr.m,R.m])){const bl=[mm.bb,...(mm.bbs?Object.values(mm.bbs):[])].filter(b=>b&&b.length>=4);let ex=1,hh=1;for(const b of bl){ex=Math.max(ex,Math.abs(b[0]-mm.fw/2),Math.abs(b[2]-mm.fw/2));hh=Math.max(hh,b[3]-b[1])}k=Math.min(k,78/ex,144/hh)}return k})();const sc=rec.K>1?Math.min(150/bhN,160/bwN,fitK):Math.min(60/(ib[3]-ib[1]),64/(ib[2]-ib[0]),5)*1.75*Math.max(.75,Math.min(1,Math.pow(Math.sqrt(bwN*bhN)/26,.7)))*(u.id===74?.84:1)*Math.min(1,Math.pow(((typeof POKE_H!=='undefined'&&POKE_H[u.id])||16)/16,.28));let fx=u._fx===undefined?(u.side==='player'?1:-1):u._fx,fz=u._fz||0;
  if(walking){if(fdx||fdy){fx=fdx;fz=fdy;u._fx=fx;u._fz=fz}}
  else{let fo=null,bd=1e9;for(const v of units){if(v.hp>0&&v.side!==u.side){const d=Math.abs(v.x-u.x)+Math.abs(v.y-u.y);if(d<bd){bd=d;fo=v}}}
   if(fo&&(fo.x!==u.x||fo.y!==u.y)){fx=fo.x-u.x;fz=fo.y-u.y}}
  // dirección en pantalla según la cámara: derecha y "hacia la cámara"
  const cyw=Math.cos(R3.yaw),syw=Math.sin(R3.yaw),fl=Math.hypot(fx,fz)||1,sxs=(fx*cyw-fz*syw)/fl,sys=(fx*syw+fz*cyw)/fl;
  let row,faceR=sxs>=0;
  if(Math.abs(sys)<.38)row=2;else if(Math.abs(sxs)<.38){row=sys>0?0:4;faceR=true}else row=sys>0?1:3;
  if(R===po&&(u.id===17||u.id===18||u.id===32||u.id===33||u.id===56)){row=(u.id===32||u.id===33)?'0':0;faceR=true} // pose de revoloteo: siempre de frente a la cámara
  const isPose=R===po,ms=walking?time:R===sl?time*.5:isPose?time*.55:dim?0:time+(u.x*131+u.y*71+u.id*37);
  g.save();g.translate(84,146);g.scale(faceR?1:-1,1);if(dim)g.filter='brightness(.6) saturate(.55)';
  pmdDraw(g,R,pmdFrame(R,ms,true),sc,0,R===sl?2:row);g.restore();topY=146-(R.m.bb[3]-R.m.bb[1])*sc;
 }else{
  const s=getMiniSprite(u.id);
  if(s&&s.ready){const iw=s.img.naturalWidth||32,ih=s.img.naturalHeight||32,fw=(iw>=ih*1.7&&iw>=48)?iw/2:iw,fh=(ih>=iw*1.7&&ih>=48)?ih/2:ih,sc=Math.min(100/fw,100/fh);g.save();g.translate(84,146);if(!(u._fr===undefined?u.side==='player':u._fr))g.scale(-1,1);if(dim)g.filter='brightness(.6)';g.drawImage(s.img,0,0,fw,fh,-fw*sc/2,-fh*sc,fw*sc,fh*sc);g.restore()}
 }
 // atrapado (Atadura/Constricción): lazos de cuerda alrededor del cuerpo
 if(u.trapped&&u.hp>0&&topY<146){const hgt=146-topY,rx=Math.max(16,Math.min(40,hgt*.42)),pul=Math.sin(time/260)*1.2,ring=(i,front)=>{const y=146-hgt*(.2+.27*i),ry=rx*.34;g.beginPath();g.ellipse(84,y,rx+pul,ry,0,front?0:Math.PI,front?Math.PI:Math.PI*2);g.stroke()},P=[['#2a1608',8],['#b9803f',5],['#e8c27a',2]];
  g.save();g.lineCap='round';g.globalCompositeOperation='destination-over';for(const [c,w] of [...P].reverse()){g.strokeStyle=c;g.lineWidth=w;for(let i=0;i<3;i++)ring(i,false)}
  g.globalCompositeOperation='source-over';for(const [c,w] of P){g.strokeStyle=c;g.lineWidth=w;for(let i=0;i<3;i++)ring(i,true)}g.restore()}
 // pasto alto: se ocultan los pies y se dibujan hojas delante
 if(rec.grass&&topY<146){const hh=Math.max(4,Math.round(Math.max(14,(146-topY)*.3)*Math.min(1,rec.gAmt*1.15))),t=time/1000,sw=walking?Math.sin(t*14)*2:Math.sin(t*2.2)*.8;
  g.save();g.globalCompositeOperation='destination-out';g.fillRect(0,146-hh+2,168,hh+30);g.restore();
  const LP=[['#1d4a0c','#2a5a10'],['#3a9a30','#2a7a24'],['#40b088','#2f9a74'],['#a0e0c0','#78c8a0']];
  const leaf=(cx,by,w,h,lean,k)=>{g.save();g.translate(cx,by);g.rotate(lean);for(let i=0;i<4;i++){const inset=i*1.6;g.fillStyle=i===0?'#1d4a0c':i===1?'#3a9a30':i===2?'#40b088':'#a0e0c0';g.beginPath();{const PF=[[0,.5],[.04,.55],[.22,.92],[.5,1],[.74,.84],[.9,.55],[.97,.28],[1,0]],hw=w*.62-inset*.5,hy=h-inset*1.2,pts=[];for(const [t,f] of PF)pts.push([-f*hw,-t*hy]);for(let q=PF.length-1;q>=0;q--)pts.push([PF[q][1]*hw,-PF[q][0]*hy]);g.moveTo(pts[0][0],pts[0][1]);for(let q=1;q<pts.length-1;q++){const mx=(pts[q][0]+pts[q+1][0])/2,my=(pts[q][1]+pts[q+1][1])/2;g.quadraticCurveTo(pts[q][0],pts[q][1],mx,my)}g.lineTo(pts[pts.length-1][0],pts[pts.length-1][1])}g.closePath();if(i===0)g.fill();else{g.save();g.scale(1-i*.1,1-i*.08);g.translate(0,i*.6);g.fill();g.restore()}}g.restore()};
  const by=150,wd=Math.max(34,Math.min(70,(60*1.0)));
  for(const [dx,h,l] of [[-13,hh+4,-.45],[-5,hh+8,-.15],[3,hh+9,.12],[11,hh+5,.45],[0,hh+2,0]])leaf(84+dx+sw*(dx<0?-1:1)*.4,by,12,h,l+(walking?Math.sin(t*14+dx)*.12:0));
 }
 // barra de PS + etiquetas de estado sobre la figura (sprite aparte, siempre visible)
 const g0=g;{const g=rec.hg;g.clearRect(0,0,168,168);g.imageSmoothingEnabled=false;
 if(u.shiny){if(u._spk0===undefined){u._spk0=time;try{playSfx('shiny')}catch(e){}}const e0=time-u._spk0;if(e0<3200&&topY<146)shinyStars(g,84,(146+topY)/2,Math.max(34,(146-topY)*.6),Math.max(26,(146-topY)*.55),e0,13)}
  if(u.hp>0&&!window.__campOn){
  const topB=146-(146-topY)*(rec.K||1),ratio=Math.max(0,Math.min(1,u.hp/u.maxHp)),bw=60,bx=84-bw/2,by=Math.max(16,Math.min(topB-30,104));
  const tcol=u.side==='player'?'#4aa3ff':'#ff5a5a';
  g.fillStyle=tcol;g.beginPath();g.roundRect(bx-5,by-5,bw+10,16,7);g.fill();
  g.fillStyle='rgba(8,14,28,.9)';g.beginPath();g.roundRect(bx-3,by-3,bw+6,12,6);g.fill();
  g.fillStyle=tcol;g.strokeStyle='#0b1422';g.lineWidth=2;g.beginPath();g.moveTo(84-8,by-15);g.lineTo(84+8,by-15);g.lineTo(84,by-6);g.closePath();g.stroke();g.fill();
  g.fillStyle=ratio>.5?'#5be28f':ratio>.25?'#f3d54f':'#f2685a';g.beginPath();g.roundRect(bx,by,Math.max(4,bw*ratio),6,3);g.fill();
  g.fillStyle='rgba(255,255,255,.35)';g.fillRect(bx+2,by+1,Math.max(0,bw*ratio-4),1.5);
  if(false&&window.__r3lab&&window.__r3lab.has(u)){const lb=(window.__r3cap?'CAPTURAR · ':'')+base[u.id].name.toUpperCase()+' · NV.'+u.level;g.font='bold 10px monospace';g.textAlign='center';
   const lw=Math.min(164,Math.max(96,Math.ceil(g.measureText(lb).width)+14)),lx=84-lw/2,ly=Math.max(2,by-36);
   g.fillStyle='#162c3b';g.fillRect(lx,ly,lw,30);g.strokeStyle='#ffdd93';g.lineWidth=2;g.strokeRect(lx+1,ly+1,lw-2,28);g.fillStyle='#fff2bc';g.fillText(lb,84,ly+13);
   const bw2=lw-16,bx2=lx+8,by2=ly+18;g.fillStyle='#0b1822';g.fillRect(bx2-1,by2-1,bw2+2,9);g.fillStyle='#3a4b57';g.fillRect(bx2,by2,bw2,7);g.fillStyle=ratio>.5?'#58c46b':ratio>.2?'#e8c545':'#e0524a';g.fillRect(bx2,by2,Math.max(ratio>0?2:0,Math.round(bw2*ratio)),7)}
  const tags=[];if(u.poisoned)tags.push(['VEN','#8a5cc2']);if(u.trapped)tags.push(['ATA','#b07a3c']);if(u.critUp)tags.push(['CRI','#d28a2a']);if(u.paralyzed)tags.push(['PAR','#c9a227']);if(u.burned)tags.push(['QUE','#d2562f']);if(u.asleep>0)tags.push(['DOR','#5a7ea8']);if(u.seeded)tags.push(['DRE','#4f9a52']);if(u.slowed)tags.push(['LEN','#7a8a9a']);
  g.font='bold 9px monospace';g.textAlign='center';tags.slice(0,4).forEach((tg,i)=>{const tx=84-(tags.length>4?4:tags.length)*14+i*28+14;g.fillStyle='rgba(8,14,28,.85)';g.beginPath();g.roundRect(tx-13,by+11,27,12,4);g.fill();g.fillStyle=tg[1];g.beginPath();g.roundRect(tx-12,by+12,25,10,3);g.fill();g.fillStyle='#fff';g.fillText(tg[0],tx,by+20)});
 }
}
 rec.htex.needsUpdate=true;
 rec.tex.needsUpdate=true;
}

/* ===== Cursor unificado (ratón, teclado, mando y táctil) ===== */

// ---- Objetos que tapan a un Pokémon: se vuelven translúcidos ----
// Cada ~110 ms se lanza un rayo desde la cámara a cada Pokémon; lo que cruza (árboles, rocas, estantes…) baja su opacidad con transición suave.
// Los objetos atenuados no escriben profundidad en el pase de los sprites, así el Pokémon se ve completo detrás.
function r3Occlude(){
 const T=R3.T;if(!R3.fade)R3.fade={map:new Map(),last:0,ray:new T.Raycaster(),list:null,count:-1,want:new Set(),now:performance.now()};
 const F=R3.fade,now=performance.now(),dt=Math.min(.1,(now-F.now)/1000);F.now=now;
 if(window.__fadeOff){for(const [m,s] of F.map){m.material=s.orig;if(s.mat)s.mat.dispose()}F.map.clear();return}
 const G=R3.stageGroup;
 const bb=m=>{if(!m.userData.bb){m.updateWorldMatrix(true,false);m.userData.bb=new T.Box3().setFromObject(m)}return m.userData.bb};
 const ok=m=>{if(!m.isMesh||m.isInstancedMesh||!m.material||Array.isArray(m.material)||m.userData.noFade||m.visible===false)return false;
  if(R3.anim.grass.includes(m)||(R3.labWalls&&R3.labWalls.some(w=>w.m===m)))return false;
  const b=bb(m);if(b.max.y<.5)return false;const sx=b.max.x-b.min.x,sz=b.max.z-b.min.z;if(sx>9||sz>9)return false;
  const mt=m.material;if(mt.transparent&&mt.opacity<.95&&!F.map.has(m))return false;return true};
 if(now-F.last>(matchMedia('(pointer:coarse)').matches?160:110)){F.last=now;
  if(!F.list||F.count!==G.children.length){F.list=[];G.traverse(o=>{if(o.isMesh&&ok(o))F.list.push(o)});F.count=G.children.length}
  const want=new Set(),cam=R3.cam.position,dir=new T.Vector3(),tp=new T.Vector3();
  for(const [u,rec] of R3.units){if(!rec.sp.visible)continue;
   for(const oy of (matchMedia('(pointer:coarse)').matches?[.1,.65]:[.1,.55,1.05])){ // pies, torso y cabeza: el Pokémon puede estar tapado solo de las patas
   tp.copy(rec.sp.position);tp.y+=oy;dir.subVectors(tp,cam);const dist=dir.length();dir.normalize();F.ray.set(cam,dir);F.ray.far=dist-.5;
   for(const h of F.ray.intersectObjects(G.children,true)){const m=h.object;if(!ok(m))continue;
    let top=m;while(top.parent&&top.parent!==G)top=top.parent;
    if(top!==m){top.traverse(o=>{if(o.isMesh&&ok(o))want.add(o)});continue}
    want.add(m);const b=bb(m),c=b.getCenter(new T.Vector3()),ex=b.clone().expandByScalar(.06);
    for(const o of F.list){if(o===m||want.has(o))continue;const ob=bb(o);if(ex.containsPoint(ob.getCenter(new T.Vector3()))||ob.clone().expandByScalar(.06).containsPoint(c))want.add(o)}}}}
  F.want=want;for(const m of want)if(!F.map.has(m))F.map.set(m,{a:1,orig:m.material,mat:null});
 }
 for(const [m,s] of F.map){const tg=F.want.has(m)?.26:1;s.a+=(tg-s.a)*Math.min(1,dt*9);
  if(s.a<.985){if(!s.mat){s.mat=s.orig.clone();s.mat.transparent=true;m.material=s.mat}s.mat.opacity=s.a}
  else if(!F.want.has(m)){m.material=s.orig;if(s.mat)s.mat.dispose();F.map.delete(m)}}
}

function r3MakeCursor(){const T=R3.T,g=new T.Group(),mk=(w,h,d,c,x,y,z,ro)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshBasicMaterial({color:c,depthTest:false,depthWrite:false,toneMapped:false,transparent:true}));m.position.set(x,y,z);m.renderOrder=ro-1100;return m};
 const arms=[];for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const cg=new T.Group();
  for(const [ex,ez,w,d] of [[0,.5,.34,.09],[.5,0,.09,.34]]){}
  // brazo en L: dos barras
  const o=.44,l=.3,t=.075;
  for(const [bw,bd,bx,bz] of [[l,t,sx*(o-l/2+.03),sz*o],[t,l,sx*o,sz*(o-l/2+.03)]]){cg.add(mk(bw+.06,.02,bd+.06,0x1d2c3f,bx,0,bz,998));cg.add(mk(bw,.025,bd,0xffffff,bx,.002,bz,999))}
  g.add(cg);arms.push(cg)}
 const fill=new T.Mesh(new T.PlaneGeometry(.92,.92),new T.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.2,depthTest:false,depthWrite:false,toneMapped:false}));fill.rotation.x=-Math.PI/2;fill.renderOrder=-103;g.add(fill);
 g.traverse(o=>o.layers.set(1));g.userData={arms,fill};g.visible=false;R3.unitGroup.add(g);return g}
function r3UpdateCursor(t){
 const c=R3.cursor||(R3.cursor=r3MakeCursor());
 const tile=(typeof hovered!=='undefined'&&hovered&&(usingKeyboard||mouseOnBoard)&&inside(hovered.x,hovered.y)&&!(typeof locked!=='undefined'&&locked&&phase!=='player'))?hovered:null;
 if(!tile){c.visible=false;return}
 const tx=tile.x+.5,tz=tile.y+.5;
 if(!c.visible){c.position.set(tx,.09,tz);c.visible=true}
 c.position.x+=(tx-c.position.x)*.4;c.position.z+=(tz-c.position.z)*.4;c.position.y=.09+(R3.elev&&R3.elev.has(tile.x+','+tile.y)?R3.eh:0);
 const u=units.find(q=>q.hp>0&&q.x===tile.x&&q.y===tile.y);
 const col=selected&&u===selected?0xffe08a:(u&&u.side!=='player'?0xff8a8a:0xffffff);
 const pulse=.5+.5*Math.sin(t*5.5);
 c.userData.arms.forEach(a=>{a.children.forEach((m,i)=>{if(i%2)m.material.color.setHex(col)});const k=1.04+pulse*.07;a.scale.set(k,1,k)});
 c.userData.fill.material.color.setHex(col===0xffffff?0xffe08a:col);c.userData.fill.material.opacity=.12+pulse*.1}
window.__r3dir=function(v){try{if(!R3||!R3.cam)return v;const T=R3.T,cx=W/2,cz=H/2,p0=new T.Vector3(cx,0,cz).project(R3.cam);
 // las 4 direcciones de la cuadrícula con su ángulo en pantalla; se asignan a derecha/arriba/izquierda/abajo de forma biyectiva (antes en vista diagonal dos teclas coincidían)
 const G=[[1,0],[0,-1],[-1,0],[0,1]],A=G.map(g=>{const p1=new T.Vector3(cx+g[0],0,cz+g[1]).project(R3.cam);return Math.atan2(p1.y-p0.y,p1.x-p0.x)});
 const KA=[0,Math.PI/2,Math.PI,-Math.PI/2],ix=v[0]===1?0:v[1]===-1?1:v[0]===-1?2:3;let bo=0,bs=1,bc=1e9;
 for(const sg of [1,3])for(let o=0;o<4;o++){let c=0;for(let k=0;k<4;k++){let d=Math.abs(A[(sg*k+o)%4]-KA[k]);d=Math.min(d,2*Math.PI-d);c+=d}c+=(o||sg!==1)?0.01:0;if(c<bc){bc=c;bo=o;bs=sg}}
 return G[(bs*ix+bo)%4]}catch(e){return v}};
/* Mando: usa los mismos eventos de teclado que el resto del juego */
(function(){const MAP={12:'ArrowUp',13:'ArrowDown',14:'ArrowLeft',15:'ArrowRight',0:'Enter',1:'Escape',2:'Enter',3:'KeyN',4:'KeyQ',5:'KeyE',9:'KeyN'};const KEYS={Enter:'Enter',Escape:'Escape',ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',KeyN:'n',KeyQ:'q',KeyE:'e'};
 const st={};const fire=code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,key:KEYS[code]||code,bubbles:true,cancelable:true}));
 let dead=0;function poll(){if(dead)return;let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[]}catch(e){dead=1;return}const now=performance.now();
  for(const p of pads){if(!p)continue;const down={};
   for(const b in MAP)if(p.buttons[b]&&p.buttons[b].pressed)down[b]=1;
   const ax=p.axes[0]||0,ay=p.axes[1]||0;if(ay<-.55)down[12]=1;else if(ay>.55)down[13]=1;if(ax<-.55)down[14]=1;else if(ax>.55)down[15]=1;
   for(const b in MAP){const k=p.index+':'+b;if(down[b]){const s=st[k];const dir=b>=12&&b<=15;if(!s){st[k]={t:now,n:0};fire(MAP[b])}else if(dir&&now-s.t>(s.n?110:260)){s.t=now;s.n++;fire(MAP[b])}}else delete st[k]}}
  requestAnimationFrame(poll)}
 try{if(navigator.getGamepads)requestAnimationFrame(poll)}catch(e){}})();
function render3D(time){
 if(!R3){r3init();return}
 const sig=stageId+'|'+visKey(stageId)+'|'+map.join('/')+(stageNight(stageId)?'|n':'|d');
 if(R3.sig!==sig){R3.sig=sig;R3.zmT=1;R3.zm=1;r3build()}
 const T=R3.T,t=time/1000;
 // cámara: encuadre fijo con ligero paralaje según el ratón
 const asp=R3.size.w/R3.size.h,tx=W/2,tz=H/2;
 R3.zm=(R3.zm||1)+((R3.zmT||1)-(R3.zm||1))*.18;if(Math.abs((R3.zmT||1)-R3.zm)<.0005)R3.zm=R3.zmT||1;
 R3.yaw+=(R3.yawT-R3.yaw)*.16;if(Math.abs(R3.yawT-R3.yaw)<.0005)R3.yaw=R3.yawT;
 const EL=.62,th2=Math.tan(R3.cam.fov*Math.PI/360),D=Math.max(17.5/(2*th2*Math.min(asp,1.25)),14.8/(2*th2))*(R3.zm||1),cyw0=Math.cos(R3.yaw),syw0=Math.sin(R3.yaw);
 R3.cam.position.set(tx+syw0*Math.cos(EL)*D,-.2+Math.sin(EL)*D,tz+cyw0*Math.cos(EL)*D);R3.cam.lookAt(tx,-.2,tz);R3.cam.updateMatrixWorld();
 // unidades
 const alive=new Set();
 R3.upos=[];
 for(const u of units){
  if(window.__campOn){if(u.side!=='player'||u.hp<=0)continue}else if(u.hp<=0)continue;alive.add(u);
  const rec=r3unit(u);let px=u.x,pz=u.y,hop=0,fdx=0,fdy=0,walking=false;
  if(motion&&motion.u===u){walking=true;const v=Math.max(0,(time-motion.start)/motion.duration),idx=Math.min(motion.path.length-2,Math.floor(v)),pct=Math.max(0,Math.min(1,v-idx)),a=motion.path[idx],b=motion.path[idx+1];px=a.x+(b.x-a.x)*pct;pz=a.y+(b.y-a.y)*pct;hop=Math.abs(Math.sin(pct*Math.PI))*.1;fdx=b.x-a.x;fdy=b.y-a.y}
  if(window.__campOn&&u.camp){const cc=u.camp;px=cc.x;pz=cc.y;walking=cc.moving;fdx=cc.dx;fdy=cc.dy;hop=cc.moving?Math.abs(Math.sin(t*(cc.run?15:8)))*(cc.run?.11:.055):0}
  const sel=selected===u;
  {const T_=(X,Z)=>typeof frlgChar==='function'&&frlgChar(stageId,X,Z)==='T'?1:0,x0=Math.floor(px),z0=Math.floor(pz),fx=px-x0,fz=pz-z0;
   rec.gAmt=T_(x0,z0)*(1-fx)*(1-fz)+T_(x0+1,z0)*fx*(1-fz)+T_(x0,z0+1)*(1-fx)*fz+T_(x0+1,z0+1)*fx*fz;rec.grass=rec.gAmt>.04;
   (R3.upos||(R3.upos=[])).push({x:px+.5,z:pz+.5,w:walking})}
  r3paintUnit(rec,u,time,walking,fdx,fdy,sel);{const K=rec.K||1;rec.sp.scale.set(2.4*K,2.4*K,1)}
  const el=r3elev(px,pz);rec.sp.position.set(px+.5,.02+hop+el,pz+.5);rec.sp.visible=true;rec.hs.position.copy(rec.sp.position);rec.hs.visible=true;
  rec.sh.position.set(px+.5,.055+el,pz+.5);rec.sh.visible=true;rec.sh.scale.set(1-hop*2,.62*(1-hop*2),1);
  rec.ring.position.set(px+.5,.058+el,pz+.5);{const nc=R3.night?0xa9b8e8:0xffffff;if(rec.sp.material.color.getHex()!==nc)rec.sp.material.color.setHex(nc)}rec.ring.visible=!window.__campOn;
  const pulse=.5+.5*Math.sin(t*5);
  if(sel){rec.ring.material.color.setHex(0xffe08a);rec.ring.material.opacity=.9;rec.ring.scale.setScalar(1.05+pulse*.12)}
  else if(inspectedEnemy===u){rec.ring.material.color.setHex(0xff8a8a);rec.ring.material.opacity=.9;rec.ring.scale.setScalar(1+pulse*.08)}
  else{rec.ring.material.color.setHex(u.side==='player'?(u.acted?0x58708a:0x6cc4ff):0xff6a6a);rec.ring.material.opacity=u.acted?.35:.65;rec.ring.scale.setScalar(1)}
 }
 for(const [u,rec] of R3.units)if(!alive.has(u)){rec.sp.visible=rec.hs.visible=rec.sh.visible=rec.ring.visible=false;if(!units.includes(u)){R3.unitGroup.remove(rec.sp,rec.hs,rec.sh,rec.ring);rec.tex.dispose();R3.units.delete(u)}}
 // animaciones del entorno
 for(const w of R3.anim.water){if(w.m){w.m.emissiveIntensity=.16+.1*Math.sin(t*1.6+w.ph);w.m.opacity=.9+.04*Math.sin(t*2+w.ph)}else if(w.ring){const k=((t*.45+w.ph)%1),r=.12+k*.78;w.ring.scale.set(r,r*.62,1);w.ring.material.opacity=Math.min(1,1.3*(1-k)**1.4)}else if(w.scr){w.scr.offset.y=(t*.8)%1}else if(w.foam){const k=1+.18*Math.sin(t*5);w.foam.scale.set(k,.45*k,1);w.foam.material.opacity=.45+.15*Math.sin(t*4)}else if(w.rip){const r=w.rip,p=(t*.35+r.userData.ph)%1;r.position.x=r.userData.ox+(p-.5)*.7;r.position.z=r.userData.oz+(r.userData.i?.18:-.15);r.material.opacity=Math.sin(p*Math.PI)*.4;r.scale.x=.6+p*.6}}
 for(const b of R3.anim.grass){let rx=0,rz=Math.sin(t*1.7+b.userData.ph)*.1,sc=.72;
  for(const p of R3.upos||[]){const dx=b.position.x-p.x,dz=b.position.z-p.z,d=Math.hypot(dx,dz);if(d<.95){const k=(1-d/.95),w=p.w?1:.35,nx=dx/(d||1),nz=dz/(d||1),wob=Math.sin(t*16+b.userData.ph*3)*.16*w;rx+=nz*k*.55*w+wob*.6;rz+=-nx*k*.55*w+wob;sc-=k*.42}}
  b.rotation.x=rx;b.rotation.z=rz;b.scale.setScalar(Math.max(.26,sc))}
 if(R3.anim.motes){const p=R3.anim.motes.geometry.attributes.position;for(let i=0;i<p.count;i++){p.array[i*3+1]+=Math.sin(t*.7+i)*.0016+.0006;if(p.array[i*3+1]>2.9)p.array[i*3+1]=.3;p.array[i*3]+=Math.sin(t*.3+i*1.7)*.0012}p.needsUpdate=true}
 {const PO=R3.anim.portal;if(PO){const k=.5+.5*Math.sin(t*2.2);PO.ring.scale.setScalar(1+.06*k);PO.glow.material.opacity=.8+.2*k;PO.beam.material.opacity=.5+.3*k;PO.qs.position.y=2.35+Math.sin(t*1.6)*.09;for(let i=0;i<PO.pd.length;i++){const d=PO.pd[i],u=(t*d.sp+d.ph)%1;PO.pp[i*3]=Math.cos(d.a+t*.5)*d.r*(1-u*.4);PO.pp[i*3+1]=.08+u*2.1;PO.pp[i*3+2]=Math.sin(d.a+t*.5)*d.r*(1-u*.4)}PO.pts.geometry.attributes.position.needsUpdate=true}}
 {const FR=R3.anim.fire;if(FR){for(const m of FR.flames){const ph=m.userData.ph,k=.82+.22*Math.sin(t*9+ph)+.1*Math.sin(t*17+ph*2);m.scale.set(.9+.12*Math.sin(t*11+ph),k,.9+.12*Math.cos(t*13+ph));m.position.y=.12+m.userData.h*k/2;m.rotation.z=Math.sin(t*5+ph)*.08}
   FR.glow.material.opacity=(.82+.14*Math.sin(t*7)+.06*Math.sin(t*19))*(campNight()?1:.3);FR.glow.scale.setScalar(1+.04*Math.sin(t*6));
   for(let i=0;i<FR.ed.length;i++){const e=FR.ed[i],life=((t*e.sp+e.ph)%1.6)/1.6;FR.ep[i*3]=Math.cos(e.a)*e.r+e.dr*life+Math.sin(t*2+i)*.04*life;FR.ep[i*3+1]=.25+life*1.5;FR.ep[i*3+2]=Math.sin(e.a)*e.r+Math.cos(t*1.7+i)*.04*life}FR.embers.geometry.attributes.position.needsUpdate=true;FR.embers.material.opacity=.9}}
 r3UpdateCursor(t);
 R3.decalTex.needsUpdate=true;
 if(R3.labWalls&&R3.labWalls.length){const dx=R3.cam.position.x-tx,dz=R3.cam.position.z-tz,l=Math.hypot(dx,dz)||1;for(const w of R3.labWalls)w.m.visible=(w.nx*dx+w.nz*dz)/l<.35}
 try{r3Occlude()}catch(e){}
 {const sk=R3.stageGroup.uuid+'|'+R3.stageGroup.children.length+'|'+(R3.labWalls?R3.labWalls.filter(w=>w.m.visible).length:0);R3._shF=(R3._shF||0)+1;if(sk!==R3._shK||R3._shF%30===0){R3._shK=sk;R3.renderer.shadowMap.needsUpdate=true}} // sombras estáticas: solo se recalculan al cambiar el escenario (y cada ~0,5 s por seguridad)
 R3.nt=R3.night?[.56,.66,.98]:null; // noche del campamento: se enfría y oscurece la imagen final
 pxRun(R3,R3.renderer,R3.scene,R3.cam,.7,255,true);
}

/* ===== Escena de combate 2.5D: fondo 3D (suelo, plataformas, decorado) detrás de los sprites 2D de la escena cara a cara ===== */
let B3=null;

const B3V={yaw:0,pitch:.11,R:31,ty:1.9,eyaw:0};
function camPose(cam,y,zoom,cx){const R=B3V.R*(1-zoom),cp=Math.cos(B3V.pitch),sp=Math.sin(B3V.pitch);
 const tx=cx*.6;cam.position.set(tx+Math.sin(y)*cp*R,B3V.ty+sp*R,Math.cos(y)*cp*R);cam.lookAt(tx,B3V.ty,0);cam.updateMatrixWorld()}
function b3init(){
 if(B3||R3fail||!window.THREE)return B3;
 const T=window.THREE,cv=document.createElement('canvas');
 let renderer;try{renderer=new T.WebGLRenderer({canvas:cv,antialias:false,alpha:false,preserveDrawingBuffer:true})}catch(e){R3fail=true;return null}
 renderer.setPixelRatio(1);renderer.setSize(Math.round(720/PXB),Math.round(600/PXB),false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
 const scene=new T.Scene(),cam=new T.PerspectiveCamera(34,1.2,.1,200);
 camPose(cam,B3V.yaw,0,0);cam.updateProjectionMatrix();
 const hemi=new T.HemisphereLight(0xffffff,0x888888,.9),sun=new T.DirectionalLight(0xffffff,2.1);
 sun.position.set(-6,12,8);sun.target.position.set(0,0,0);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
 Object.assign(sun.shadow.camera,{left:-16,right:16,top:12,bottom:-12,near:1,far:50});sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;
 scene.add(hemi,sun,sun.target);
 const rim=new T.DirectionalLight(0x9ec9ff,.45);rim.position.set(8,5,-8);scene.add(rim);
 const flash=new T.PointLight(0xffffff,0,14,1.6);scene.add(flash);
 const group=new T.Group();scene.add(group);
 const ray=new T.Raycaster(),ground=new T.Plane(new T.Vector3(0,1,0),0),v=new T.Vector3();
 const hit=(px,py)=>{ray.setFromCamera(new T.Vector2(px/720*2-1,-(py/600)*2+1),cam);const p=new T.Vector3();return ray.ray.intersectPlane(ground,p)?p:null};
 B3={T,cv,renderer,scene,cam,hemi,sun,rim,flash,group,hit,sig:'',plats:[],anim:{grass:[],motes:null,clouds:[]},mats:new Map()};
 return B3;
}
function b3mat(c,o){const k=c+JSON.stringify(o||{});let m=B3.mats.get(k);if(!m){m=new B3.T.MeshStandardMaterial(Object.assign({color:c,roughness:.9,flatShading:true},o||{}));B3.mats.set(k,m)}return m}
function b3Cerulean(T,g,th,add,box,rnd){
 const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:1,flatShading:true},o||{}));
 const waterM=()=>new T.MeshStandardMaterial({color:th.water,emissive:th.water,emissiveIntensity:.3,roughness:.2,metalness:.1});
 const fenceX=(x0,x1,z)=>{const n=Math.round(x1-x0);for(let i=0;i<=n;i++)add(new T.Mesh(new T.BoxGeometry(.16,.9,.16),M('#e9dcc0')),x0+i*(x1-x0)/n,.45,z,true,true);for(const y of [.35,.7])add(new T.Mesh(new T.BoxGeometry(x1-x0,.1,.1),M('#e9dcc0')),(x0+x1)/2,y,z,true,true)};
 const fenceZ=(x,z0,z1)=>{const n=Math.round(z1-z0);for(let i=0;i<=n;i++)add(new T.Mesh(new T.BoxGeometry(.16,.9,.16),M('#e9dcc0')),x,.45,z0+i*(z1-z0)/n,true,true);for(const y of [.35,.7])add(new T.Mesh(new T.BoxGeometry(.1,.1,z1-z0),M('#e9dcc0')),x,y,(z0+z1)/2,true,true)};
 // lago de la izquierda con vallado en su orilla
 const lake=new T.Mesh(new T.PlaneGeometry(15,6),waterM());lake.rotation.x=-Math.PI/2;add(lake,-10,.02,-7.6,false,true);
 add(new T.Mesh(new T.BoxGeometry(15.3,.14,.3),M('#b98f5a')),-10,.04,-4.5,false,true);
 fenceX(-17,-3,-3.6);
 // puente de madera con escalera hacia el frente
 const wood=M('#d9bb66'),woodD=M('#a8843c'),woodL=M('#e6c978');
 add(new T.Mesh(new T.BoxGeometry(5,.7,5.4),wood),5.5,.35,-7.3,true,true);
 for(let i=0;i<4;i++){const h=.56-.14*i;add(new T.Mesh(new T.BoxGeometry(5,h,.6),i%2?wood:woodL),5.5,h/2,-4.3+i*.6,true,true)}
 for(const rx of [3.1,7.9]){for(let i=0;i<5;i++)add(new T.Mesh(new T.BoxGeometry(.14,.7,.14),woodD),rx,1.05,-9.8+i*1.35,true,true);add(new T.Mesh(new T.BoxGeometry(.12,.12,5.4),wood),rx,1.4,-7.3,true,true)}
 // saliente (desnivel que se salta) a la derecha del puente
 add(new T.Mesh(new T.BoxGeometry(4.2,.55,1.8),[M('#8a6a47'),M('#8a6a47'),M('#8bc86f'),M('#6b4f35'),M('#8a6a47'),M('#8a6a47')]),11,.275,-7.9,true,true);
 // valla vertical que separa el camino de arena
 fenceZ(13.6,-10,-3.4);
 // charca y camino de arena a la derecha
 const pond=new T.Mesh(new T.PlaneGeometry(6.4,3.6),waterM());pond.rotation.x=-Math.PI/2;add(pond,17.4,.02,-10.4,false,true);
 const sand=new T.Mesh(new T.PlaneGeometry(6.4,6.2),new T.MeshStandardMaterial({color:'#f0d27a',roughness:1}));sand.rotation.x=-Math.PI/2;add(sand,17.4,.015,-5.6,false,true);
}
function b3Bridge(T,g,th,add,rnd){
 const M=(c)=>new T.MeshStandardMaterial({color:c,roughness:1,flatShading:true});
 const wm=new T.MeshStandardMaterial({color:th.water,emissive:th.water,emissiveIntensity:.3,roughness:.2,metalness:.1});
 const lake=new T.Mesh(new T.PlaneGeometry(70,16),wm);lake.rotation.x=-Math.PI/2;add(lake,0,.02,-11.5,false,true);
 const wood=M('#d9bb66'),woodD=M('#a8843c'),woodL=M('#e6c978');
 // el puente pasa por debajo de los combatientes: ellos pelean sobre él
 add(new T.Mesh(new T.BoxGeometry(60,.17,9),wood),0,.085,.4,true,true);
 add(new T.Mesh(new T.BoxGeometry(60,.1,.3),woodD),0,.05,-4.1,true,true);
 for(let i=-14;i<=14;i++)add(new T.Mesh(new T.BoxGeometry(.07,.02,9),i%2?woodD:woodL),i*2,.175,.4,false,true);
 for(let i=-14;i<=14;i++)add(new T.Mesh(new T.BoxGeometry(.2,1.1,.2),woodD),i*2,.7,-3.9,true,true);
 for(const y of [.7,1.2])add(new T.Mesh(new T.BoxGeometry(60,.12,.12),wood),0,y,-3.9,true,true);
 for(const x of [-21,21])for(let k=0;k<3;k++)r3Tree3D(T,g,false,x+(k-1)*2.2,-13-k*1.5,2.4,k+x);
}
function b3Route25(T,g,th,add,rnd){
 const M=(c)=>new T.MeshStandardMaterial({color:c,roughness:1,flatShading:true});
 // como en el mapa: acantilado de roca detrás, campo de hierba con arbustos de bola y una franja de arena
 for(let i=0;i<17;i++){const x=-32+i*4,h=3.2+rnd(i,2)*2.2,w=4.4,z=-6.4-rnd(i,4)*.9;
  if(R3.rockM){const m=r3RockBlock(T,w,h,w*.9,R3.rockM,i*.37);add(m,x,-.2,z,true,true)}else add(new T.Mesh(new T.BoxGeometry(w,h,w*.9),M('#a88566')),x,h/2-.2,z,true,true)}
 const sand=new T.Mesh(new T.PlaneGeometry(9,5),new T.MeshStandardMaterial({color:'#dcc48a',roughness:1}));sand.rotation.x=-Math.PI/2;add(sand,-13,.03,1.6,false,true);
 const pts=[[-11,-3.2],[-8,-4.6],[-6,-2.4],[-14,-4.4],[-3.6,-4.8],[3.8,-4.6],[7,-2.6],[9.5,-4.4],[12.5,-3],[15,-4.8],[-16,-2.4],[17,-2.2],[5.4,-5.4],[-5.5,-5.6],[11,0.8]];
 pts.forEach((p,i)=>{const r=.95+rnd(i,7)*.3,b=new T.Mesh(new T.IcosahedronGeometry(r,1),new T.MeshStandardMaterial({color:['#5fbb4f','#58b04a','#66c456'][i%3],roughness:.9,flatShading:true}));b.scale.set(1,.86,1);add(b,p[0],r*.8,p[1],true,true);
  const sh=new T.Mesh(new T.CircleGeometry(r*1.05,16),new T.MeshBasicMaterial({color:0x1b4f27,transparent:true,opacity:.4,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.set(1,.7,1);add(sh,p[0],.02,p[1]+.1,false,false)});
}
function b3Train(T,g,th,add,rnd){
 const M=(c)=>new T.MeshStandardMaterial({color:c,roughness:1,flatShading:true});
 const wm=new T.MeshStandardMaterial({color:th.water,emissive:th.water,emissiveIntensity:.3,roughness:.2,metalness:.1});
 // como en el mapa: la franja de hierba corre entre un muro de roca (detrás) y el río (delante, junto a la cámara)
 for(let i=0;i<16;i++){const x=-31+i*4,h=3+rnd(i,2)*3.4,w=3.6+rnd(i,3)*1.2,z=-5.6-rnd(i,4)*1.6;
  if(R3.rockM){const m=r3RockBlock(T,w,h,w*.9,R3.rockM,i*.37);add(m,x,-.2,z,true,true)}else add(new T.Mesh(new T.BoxGeometry(w,h,w*.9),M('#a88566')),x,h/2-.2,z,true,true)}
 const river=new T.Mesh(new T.PlaneGeometry(80,14),wm);river.rotation.x=-Math.PI/2;add(river,0,.02,12.4,false,true);
}
function b3build(){window.__B3=B3;
 const T=B3.T,g=B3.group,th=stageTheme(stageId),id=stageId;
 while(g.children.length){const c=g.children.pop();c.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
 B3.mats.forEach(m=>m.dispose());B3.mats.clear();B3.anim={grass:[],motes:null,clouds:[]};B3.plats=[];
 const rnd=(a,b=0)=>{const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s)};
 const add=(m,x,y,z,cast=true,recv=true)=>{m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=recv;g.add(m);return m};
 const box=(w,h,d,c,o)=>new T.Mesh(new T.BoxGeometry(w,h,d),b3mat(c,o)),cone=(r,h,s,c)=>new T.Mesh(new T.ConeGeometry(r,h,s),b3mat(c)),cyl=(a,b,h,s,c,o)=>new T.Mesh(new T.CylinderGeometry(a,b,h,s),b3mat(c,o));
 const indoor=th.kind!=='out'&&th.kind!=='cave';
 // fondo/cielo pixelado y suelo con textura pixel
 {const st=new T.CanvasTexture(pxaBackdrop(th,false));st.colorSpace=T.SRGBColorSpace;st.magFilter=T.NearestFilter;st.minFilter=T.NearestFilter;st.generateMipmaps=false;B3.scene.background=st}
 {const ct=new T.CanvasTexture(pxaGround(th,()=>'.',6,6,()=>th.kind==='out'?'grass':th.kind==='lab'?'plank':'stone',false));ct.colorSpace=T.SRGBColorSpace;ct.wrapS=ct.wrapT=T.RepeatWrapping;ct.repeat.set(th.kind==='cave'?30:20,th.kind==='cave'?22:14.6);ct.magFilter=T.NearestFilter;ct.minFilter=th.kind==='cave'?T.NearestFilter:T.NearestMipmapLinearFilter;ct.anisotropy=8;
  const fl=new T.Mesh(new T.PlaneGeometry(120,88),(th.kind==='cave'?new T.MeshBasicMaterial({map:ct,toneMapped:false,color:0xe6e0d4}):new T.MeshStandardMaterial({map:ct,roughness:1})));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;fl.position.set(0,0,-8);g.add(fl)}
 const bb=(cv,wu,hu,x,y,z)=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;
  const sp=new T.Sprite(new T.SpriteMaterial({map:t,alphaTest:.5,toneMapped:false}));sp.center.set(.5,0);sp.scale.set(wu,hu,1);sp.position.set(x,y,z);g.add(sp);return sp};
 const wallTex=(base,rx,ry)=>{const t=new T.CanvasTexture(pxaWall(base,5));t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);t.magFilter=T.NearestFilter;t.minFilter=T.NearestMipmapLinearFilter;return t};
 // plataformas (se reposicionan en cada cuadro según el modo solo)
 const topC=th.kind==='out'?'#8bc86f':th.path;
 for(let i=0;i<2;i++){const p=new T.Group();const base=cyl(1,1*1.03,.34,40,shade(th.earth==='#8a6a47'?'#8a6a47':th.earth,1),{flatShading:false});add2(p,base,0,-.0);const top=cyl(1*.96,1*.96,.06,40,topC,{flatShading:false,roughness:.8});add2(p,top,0,.2);
  const ring=new T.Mesh(new T.RingGeometry(1*.8,1*.86,48),new T.MeshBasicMaterial({color:i?0xff9a9a:0x9ad0ff,transparent:true,opacity:.7,toneMapped:false,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.235;p.add(ring);
  p.children.forEach(c=>{c.castShadow=true;c.receiveShadow=true});g.add(p);B3.plats.push(p)}
 function add2(p,m,x,y){m.position.set(x,y,0);p.add(m)}
 // decorado por tipo
 if(th.kind==='out'){
  const pineT=false,CRB=id==='ceruleanrival';
  if(th.lunar){for(let row=0;row<3;row++){const n=13-row*2;for(let i=0;i<n;i++){const x=-16+i*(32/(n-1))+(rnd(i,row)-.5)*1.6,s1=.7+rnd(i,row+9)*1.1,z=-6.5-row*3.2+(rnd(i,row+3)-.5)*1.2;
    const rk=new T.Mesh(new T.IcosahedronGeometry(s1,0),b3mat(th.tree[(i+row)%3],{flatShading:true}));rk.scale.set(1.3,.62,1);rk.rotation.y=rnd(i,row+5)*6;add(rk,x,s1*.28,z)}}
   for(let i=0;i<5;i++){const cn=cone(2.2+rnd(i,3)*1.6,2.6+rnd(i,4)*2.4,6,th.wall);add(cn,-14+i*7+rnd(i,6)*2,1.1,-16-rnd(i,7)*3,false,false)}}
  else if(CRB)b3Cerulean(T,g,th,add,box,rnd);
  else if(id==='nugget'||id==='nuggetrocket')b3Bridge(T,g,th,add,rnd);
  else if(id==='nuggettrain')b3Train(T,g,th,add,rnd);
  else if(id==='route25'||id==='route25b'||id==='route25train')b3Route25(T,g,th,add,rnd);
  else for(let row=0;row<3;row++){const n=14-row*2,z=-6.5-row*3.4;for(let i=0;i<n;i++){const x=-15+i*(30/(n-1))+(rnd(i,row)-.5)*1.4,s1=.9+rnd(i,row+9)*.35,col=th.tree[(i+row)%3];
   if(pineT)r3Tree3D(T,g,true,x,z+(rnd(i,row+3)-.5)*1.2,2.5*s1,i);else r3Tree3D(T,g,false,x,z+(rnd(i,row+3)-.5)*1.2,2.6*s1,i)}}
  if(!th.lunar&&id!=='nugget'&&id!=='nuggetrocket'&&id!=='route25'&&id!=='route25b'&&id!=='route25train'){
  for(let i=0;i<16;i++){if(i%3!==2)continue;const x=(i%2?1:-1)*(5.5+rnd(i,2)*8),z=-1.5-rnd(i,5)*4.5;r3Grass(T,g,x,z,i*1.7,null).scale.setScalar(1.3)}
  for(let i=0;i<14;i++){const x=(i%2?1:-1)*(8+rnd(i,21)*6),z=-.2+rnd(i,22)*3;r3Grass(T,g,x,z,i*2.3,null).scale.setScalar(1.15)}}
 }else if(th.kind==='cave'){
  if(R3.rockM&&(id==='mtmoon'||id==='mtmoonj'||id==='mtmoonb'||id==='mtmoonc')){
   for(let row=0;row<2;row++)for(let i=0;i<22;i++){const x=-27+i*2.5+rnd(i,row+1)*1.1,h=(row?4.5:2.2)+rnd(i,2+row)*(row?4.5:2.6),w=2.2+rnd(i,3+row)*1.6;const m=r3RockBlock(T,w,h,w*.9,R3.rockM,i*.37+row);m.rotation.y=(rnd(i,5)-.5)*.4;add(m,x,-.2,-6.2-row*2.4-rnd(i,4)*.8)}
   for(let i=0;i<9;i++){const sx=i<5?-1:1,x=sx*(8+rnd(i,31)*14),z=-2.6-rnd(i,32)*2.2;for(let q=0;q<3;q++){const geo=new T.IcosahedronGeometry(.42+rnd(i,q+40)*.18,1),pp=geo.attributes.position;for(let k=0;k<pp.count;k++){const f=1+Math.sin(pp.getX(k)*41+pp.getY(k)*17+pp.getZ(k)*29+i+q)*.08;pp.setXYZ(k,pp.getX(k)*f,pp.getY(k)*f*.8,pp.getZ(k)*f)}geo.computeVertexNormals();const col=['#a8756a','#8f5f58','#bd8a7c'][q],m=new T.Mesh(geo,new T.MeshStandardMaterial({color:col,roughness:.95,flatShading:true,emissive:col,emissiveIntensity:.16}));add(m,x+(q-1)*.55,.3+(q===1?.25:0),z+(q%2?.2:-.15))}}
  }else{
  for(let i=0;i<34;i++){const x=-26+i*1.6+rnd(i,1),h=3+rnd(i,2)*5,w=1.6+rnd(i,3)*1.6;add(new T.Mesh(new T.BoxGeometry(w,h,w),new T.MeshStandardMaterial({map:wallTex(th.wall,Math.max(1,w/1.5),Math.max(1,h/1.5)),roughness:1})),x,h/2-.2,-6.5-rnd(i,4)*2.5)}
  }
  for(let i=0;i<22;i++){const s=1+rnd(i,6)*1.5,c=cone(.5*s,2.2*s,6,shade(R3.rockM?'#6e5048':th.wall,.8));c.rotation.x=Math.PI;add(c,-24+i*2.2+rnd(i,7),12-s,-8-rnd(i,8)*3)}
  if(!R3.rockM)for(let i=0;i<10;i++){const s=.5+rnd(i,9)*.8,c=cone(.3*s,1.4*s,5,th.wall);add(c,-12+i*2.6+rnd(i,10),.6*s,-2.8-rnd(i,11)*2.4)}
  if(!R3.rockM)for(let i=0;i<7;i++){const cr=new T.Mesh(new T.OctahedronGeometry(.3+rnd(i,12)*.2,0),new T.MeshStandardMaterial({color:0x7fb8ff,emissive:0x4a90ff,emissiveIntensity:1.1,flatShading:true}));cr.scale.y=1.6;add(cr,-10+i*3.4,.5,-3.8-rnd(i,13)*2,false,false)}
 }else{
  // interiores: muro trasero, columnas y detalles
  if(th.kind==='lab'){const lt=new T.CanvasTexture(pxaLabWall());lt.colorSpace=T.SRGBColorSpace;lt.wrapS=lt.wrapT=T.RepeatWrapping;lt.repeat.set(12,1);lt.magFilter=T.NearestFilter;lt.minFilter=T.NearestMipmapLinearFilter;add(new T.Mesh(new T.BoxGeometry(60,8,1),new T.MeshStandardMaterial({map:lt,roughness:1})),0,4,-9,false,true)}else if(th.kind!=='gym'&&th.kind!=='pool')add(new T.Mesh(new T.BoxGeometry(60,12,1),new T.MeshStandardMaterial({map:wallTex(th.wall,30,6),roughness:1})),0,6,-9,false,true);
  if(th.kind!=='lab'&&th.kind!=='gym'&&th.kind!=='pool')for(let i=-4;i<=4;i++)add(cyl(.5,.55,10,10,shade(th.wall,1.15),{flatShading:false}),i*5.2,5,-8.2);
  if(th.kind==='pool'){const pw=new T.CanvasTexture(pxaPoolWall());pw.colorSpace=T.SRGBColorSpace;pw.magFilter=pw.minFilter=T.NearestFilter;pw.generateMipmaps=false;pw.wrapS=pw.wrapT=T.RepeatWrapping;pw.repeat.set(36,6);add(new T.Mesh(new T.BoxGeometry(72,12,1),new T.MeshBasicMaterial({map:pw,toneMapped:false})),0,6,-9,false,false)}
  if(th.kind==='pool'){ // piscina del gimnasio: agua con borde de azulejo, plataformas y boyas, delante del muro
   const wtx=new T.CanvasTexture(pxaWaterTex(9));wtx.colorSpace=T.SRGBColorSpace;wtx.wrapS=wtx.wrapT=T.RepeatWrapping;wtx.repeat.set(26,4);wtx.magFilter=wtx.minFilter=T.NearestFilter;wtx.generateMipmaps=false;
   const wp=new T.Mesh(new T.PlaneGeometry(64,7),new T.MeshStandardMaterial({map:wtx,color:'#58b4f0',emissive:'#2a78c8',emissiveIntensity:.35,roughness:.2,metalness:.1}));wp.rotation.x=-Math.PI/2;wp.position.set(0,.07,-5.9);wp.receiveShadow=true;g.add(wp);
   const ed=(w,d,x,z)=>add(new T.Mesh(new T.BoxGeometry(w,.22,d),new T.MeshStandardMaterial({color:'#f3efe2',roughness:1})),x,.1,z,false,true);
   ed(64,.55,0,-2.2);ed(64,.45,0,-9.2);
   // plataformas de azulejo dentro de la piscina
   [[-9,-5.9,6,2.6],[8.5,-5.9,6,2.6]].forEach(p=>{add(new T.Mesh(new T.BoxGeometry(p[2],.3,p[3]),new T.MeshStandardMaterial({color:'#b6d8e6',roughness:1})),p[0],.14,p[1],true,true);add(new T.Mesh(new T.BoxGeometry(p[2]+.3,.12,p[3]+.3),new T.MeshStandardMaterial({color:'#f3efe2',roughness:1})),p[0],.08,p[1],false,true)});
   // cuerda de boyas rojas y blancas que separa los carriles
   for(let k=0;k<26;k++){const x=-31+k*2.4,bm=new T.Mesh(new T.SphereGeometry(.2,8,6),new T.MeshStandardMaterial({color:k%2?'#f4f4f4':'#e0483a',roughness:.7}));add(bm,x,.2,-4.1,false,false)}
  }
  if(th.kind==='lab'){
   const tex=cv=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;return t};
   const mb=(w,h,d,c,x,y,z,sh)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),r3mat(c));m.position.set(x,y,z);m.castShadow=sh!==false;m.receiveShadow=true;g.add(m);return m};
   const dec=(cv,w,h,x,y)=>{const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex(cv),transparent:true,alphaTest:.5,toneMapped:false}));p.position.set(x,y,-8.46);g.add(p)};
   const shelf=(x,sd)=>{const w=3.4,h=4.5,d=1.5,zf=-7.7;mb(w*.97,h*.97,d,'#4a4f5c',x,h*.485,zf-d/2-.01);const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex(pxaShelf(sd)),transparent:true,alphaTest:.5,toneMapped:false}));p.position.set(x,h/2,zf);g.add(p)};
   const S=2.4;
   dec(pxaWindow(),3.0,2.6,9.2,4.6);dec(pxaPoster(),1.8,2.3,-1.6,3.9);dec(pxaPoster(),1.8,2.3,.7,3.9);
   shelf(-14.2,3);shelf(-10.8,5);shelf(17.5,7);
   // mesa verde con una pokebola
   {const tx=4.2,tz=-5.6,y0=0;mb(3.0*S,.14*S,1.25*S,'#5cb86a',tx,.98*S,tz);mb(3.0*S,.05*S,1.25*S,'#8fdc9a',tx,1.07*S,tz,false);
    for(const lx of [-1.35,1.35])for(const lz of [-.5,.5])mb(.14*S,.98*S,.14*S,'#f6f7f9',tx+lx*S,.49*S,tz+lz*S);
    mb(2.7*S,.08*S,.9*S,'#dfe4ea',tx,.3*S,tz,false);
    const pb=new T.Mesh(new T.SphereGeometry(.2*S,14,12),r3mat('#f6f7f9'));pb.position.set(tx,1.28*S,tz);g.add(pb);
    const pr=new T.Mesh(new T.SphereGeometry(.2*S,14,8,0,6.283,0,1.2),r3mat('#d8453a'));pr.position.set(tx,1.28*S,tz);g.add(pr)}
   // maquina de Oak
   {const mx=-4.2,mz=-6,k=S*.9;const cyl2=(r1,r2,h,sg,c,x,y,z)=>{const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,sg),r3mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m};
    cyl2(.5*k,.58*k,.5*k,8,'#eceae2',mx,.45*k,mz);
    for(let q=0;q<3;q++){const a=q*2.094+.5,lg=new T.Mesh(new T.BoxGeometry(.2*k,.16*k,.7*k),r3mat('#b6bfca'));lg.rotation.y=-a;lg.position.set(mx+Math.cos(a)*.62*k,.08*k,mz+Math.sin(a)*.62*k);g.add(lg)}
    for(let q=0;q<8;q++){const a=q*.7854+.39;mb(.09*k,.95*k,.09*k,'#8fd0f0',mx+Math.cos(a)*.45*k,1.18*k,mz+Math.sin(a)*.45*k,false)}
    for(const [bx,bz,by] of [[-.15,.1,.85],[.18,-.05,.85],[0,-.2,1.15],[.05,.18,1.2]]){const b=new T.Mesh(new T.SphereGeometry(.15*k,12,10),r3mat('#d8453a'));b.position.set(mx+bx*k,by*k,mz+bz*k);g.add(b)}
    cyl2(.58*k,.5*k,.3*k,8,'#eceae2',mx,1.8*k,mz);cyl2(.46*k,.46*k,.12*k,16,'#d8453a',mx,2.0*k,mz);cyl2(.22*k,.22*k,.05*k,12,'#ff9a8e',mx-.1*k,2.07*k,mz)}
   // planta
   {const px=12.2,pz=-5.2,k=S*.9;const c1=new T.Mesh(new T.CylinderGeometry(.28*k,.2*k,.42*k,6),r3mat('#a99f93'));c1.position.set(px,.21*k,pz);g.add(c1);
    [[.34,.3,'#3d9a48'],[.62,.24,'#4cb05a'],[.86,.17,'#6cc873']].forEach(([yy,rr,cc],q)=>{const o=new T.Mesh(new T.OctahedronGeometry((rr+.08)*k),r3mat(cc));o.scale.set(1.2,.8,1.2);o.rotation.y=q*.7;o.position.set(px,(.38+yy)*k,pz);g.add(o)})}
  }
  if(th.kind==='gym'){
   const tx2=cv=>{const t=new T.CanvasTexture(cv);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.NearestFilter;t.minFilter=T.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=T.RepeatWrapping;return t};
   const gt=tx2(pxaGymGreen());gt.repeat.set(36,6);add(new T.Mesh(new T.BoxGeometry(72,12,1),new T.MeshBasicMaterial({map:gt,toneMapped:false})),0,6,-9,false,false);
   if(th.kind==='gym')for(const [rx,rz,k] of [[-9,-3.6,1],[-3.5,-6,.8],[5,-4.6,.9],[10.5,-7,1],[-12.5,-7.2,.8],[16,-3.4,.85]]){bb(pxaRock('#9aa0a8',Math.round(rx*3+rz)),1.6*k,1.15*k,rx,0,rz)}
   const wt=tx2(pxaWindow());for(let i=-4;i<=4;i++){const w2=new T.Mesh(new T.PlaneGeometry(2.1,2.45),new T.MeshBasicMaterial({map:wt,toneMapped:false,side:T.DoubleSide,fog:false}));w2.position.set(i*5.6,4.4,-8.4);g.add(w2)}}
 }
 // partículas ambientales
 const N=60,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=-14+Math.random()*28;pos[i*3+1]=.5+Math.random()*5;pos[i*3+2]=-8+Math.random()*10}
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));
 const motes=new T.Points(pg,new T.PointsMaterial({color:th.kind==='cave'?0x9ec4ff:0xffffff,size:.07,transparent:true,opacity:.6,depthWrite:false}));if(th.kind!=='pool'){g.add(motes);B3.anim.motes=motes}
 B3.hemi.color.setHex(th.hemi[0]);B3.hemi.groundColor.setHex(th.hemi[1]);B3.hemi.intensity=th.hemiI;B3.sun.color.setHex(th.sun);B3.sun.intensity=th.sunI;
 B3.scene.fog=new T.Fog(new T.Color(th.sky[1]),32,90);
}
function b3draw(t){
 if(!b3init())return false;
 if(B3.sig!==stageId){B3.sig=stageId;b3build()}
 const s=t/1000,ev=window.__feEv,fed=window.__fed;window.__feEv=null;
 const deep=!!(ev&&fed&&!feSolo);
 const atkLeft=deep&&ev.attacker.side==='player',side=deep?(atkLeft?-1:1):0;
 const yawRef=deep?side*B3V.eyaw:B3V.yaw;
 // posiciones 2D de referencia de cada criatura (pies) y su escala
 const dA=deep?fed.a:{dy:0,z:1},dT=deep?fed.t:{dy:0,z:1};
 const L=feSolo?{x:360,y:FE.feet+6,z:1}:{x:FE.pX,y:FE.feet+6+(atkLeft||!deep?dA.dy*(deep?1:0):dT.dy),z:atkLeft?dA.z:(deep?dT.z:1)};
 const Rr=feSolo?null:{x:FE.eX,y:FE.feet+6+(deep?(atkLeft?dT.dy:dA.dy):0),z:deep?(atkLeft?dT.z:dA.z):1};
 camPose(B3.cam,yawRef,0,0);
 const place=(pl,it)=>{const p=B3.hit(it.x,it.y),q=B3.hit(it.x+150*it.z,it.y);pl.visible=false;pl.position.set(p.x,0,p.z);const r=p.distanceTo(q);pl.scale.set(r,1,r);return p};
 const PL=place(B3.plats[0],L),PRr=Rr?place(B3.plats[1],Rr):null;
 for(const b of B3.anim.grass)b.rotation.z=Math.sin(s*1.7+b.userData.ph)*.14;
 for(const c of B3.anim.clouds)c.position.x=((c.position.x+30+s*c.userData.sp*.4)%60)-30;
 if(B3.anim.motes){const p=B3.anim.motes.geometry.attributes.position;for(let i=0;i<p.count;i++){p.array[i*3+1]+=Math.sin(s*.7+i)*.002+.0008;if(p.array[i*3+1]>6)p.array[i*3+1]=.4}p.needsUpdate=true}
 const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 let focus=0,zoom=0,fl=0,flc=0xffffff,flx=0,melee=0;
 if(ev){
  const impact=ev.critical?2220:1560,sd=ev.attacker.side==='player'?-1:1;
  const pre=sm(t/(impact*.85)),post=sm((t-impact)/380),back=sm((t-impact-420)/1100);
  focus=sd*pre*(1-post)+(-sd)*post*(1-back)*.8;
  const mel=false;
  zoom=mel?pre*(1-post)*.17+post*(1-back)*.2:pre*(1-post)*.07+post*(1-back)*.1;melee=mel?1:0;
  if(!ev.miss&&t>impact){fl=Math.max(0,1-(t-impact)/420)*(ev.critical?9:5);flx=(sd<0?PRr:PL).x}
  const col=(typeof FX_TYPE!=='undefined'&&FX_TYPE[ev.move.type]||[])[0];if(col)flc=parseInt(col.replace('#',''),16)||0xffffff;
 }
 const yaw=ev?Math.sin(s*.45)*.04:0,bob=ev?Math.sin(s*.6)*.08:0,half=PRr?Math.abs(PRr.x-PL.x)/2:4,cx=focus*half*(melee?1.1:.28);
 camPose(B3.cam,yawRef+yaw,zoom,cx);B3.cam.position.y+=bob;B3.cam.updateMatrixWorld();
 B3.flash.intensity=fl;B3.flash.color.setHex(flc);B3.flash.position.set(flx,2.2,(PL.z));
 pxRun(B3,B3.renderer,B3.scene,B3.cam,2.5,255,false);
 {const was=sg.imageSmoothingEnabled;sg.imageSmoothingEnabled=false;sg.drawImage(B3.cv,0,0,720,600);sg.imageSmoothingEnabled=was}
 if(!ev||!PRr)return true;
 const pr=p=>{const v=p.clone().project(B3.cam);return [(v.x+1)/2*720,(1-v.y)/2*600]};
 const q1=pr(PL),q2=pr(PRr),k=Math.hypot(q2[0]-q1[0],q2[1]-q1[1])/Math.hypot(Rr.x-L.x,Rr.y-L.y);
 sg.translate((q1[0]+q2[0])/2,(q1[1]+q2[1])/2);sg.scale(k,k);sg.translate(-(L.x+Rr.x)/2,-(L.y+Rr.y)/2);
 return true;
}

/* Estados (veneno, parálisis, ↑/↓ de stats…): etiqueta flotante sobre el Pokémon en vez de dibujarse plana en el suelo */
window.__r3status=function(time){
 if(typeof R3==='undefined'||!R3||!R3.cam||!R3.cv||!R3.wrap||R3.cv.hidden||getComputedStyle(R3.cv).display==='none')return false;
 let host=R3.stHost;if(!host){host=R3.stHost=document.createElement('div');host.className='r3st';R3.wrap.append(host)}
 const eff=statusEffects,pool=host.children;
 while(pool.length<eff.length){const d=document.createElement('div');d.className='r3stItem';host.append(d)}
 const rc=R3.cv.getBoundingClientRect(),wr=R3.wrap.getBoundingClientRect(),T=R3.T;
 for(let i=0;i<pool.length;i++){const d=pool[i],e=eff[i];if(!e){d.style.display='none';continue}
  const el=Math.max(0,time-e.start),prog=Math.min(1,el/1150),alpha=Math.max(0,Math.min(1,el/140,(1250-el)/360));
  const v=new T.Vector3(e.x+.5,(R3.elev&&R3.elev.has(e.x+','+e.y)?R3.eh:0)+1.9+(e.kind==='up'?prog*.5:prog*.2),e.y+.5).project(R3.cam);
  d.style.display='block';d.textContent=e.label;
  d.style.left=((v.x*.5+.5)*rc.width+(rc.left-wr.left))+'px';d.style.top=((-v.y*.5+.5)*rc.height+(rc.top-wr.top))+'px';
  d.style.opacity=alpha;d.style.borderColor=e.color}
 return true};
window.__r3screen=function(x,y,h){try{if(!R3||!R3.cam||!R3.cv||!R3.wrap)return null;const T=R3.T,rc=R3.cv.getBoundingClientRect(),wr=R3.wrap.getBoundingClientRect();
 const v=new T.Vector3(x+.5,(R3.elev&&R3.elev.has(x+','+y)?R3.eh:0)+(h||0),y+.5).project(R3.cam);return {x:(v.x*.5+.5)*rc.width+(rc.left-wr.left),y:(-v.y*.5+.5)*rc.height+(rc.top-wr.top)}}catch(e){return null}};
window.__r3active=function(){try{return !!(R3&&R3.cam&&R3.cv&&R3.wrap&&!R3.cv.hidden&&getComputedStyle(R3.cv).display!=='none')}catch(e){return false}};

;(()=>{
const st=document.createElement('style');st.textContent=`
#enemyCard{position:absolute;top:10px;right:10px;z-index:40;width:min(40%,268px);pointer-events:none;background:linear-gradient(180deg,rgba(14,22,42,.94),rgba(8,13,28,.94));border:2px solid #e6c988;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.5);padding:9px 10px;color:#eaf2ee;font-size:clamp(10px,1.45vw,12.5px);line-height:1.35;font-family:inherit}
#enemyCard[hidden]{display:none}
#enemyCard .ecTop{display:flex;gap:9px;align-items:center}
#enemyCard .ecPor{width:64px;height:64px;flex:0 0 64px;border-radius:9px;background:radial-gradient(circle at 50% 70%,#587f92,#2a4556);box-shadow:0 0 0 2px #0b1020,inset 0 0 0 2px rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:30px}
#enemyCard .ecPor img.big{width:100%;height:100%;border-radius:9px}
#enemyCard .ecPor img{width:56px;height:56px;image-rendering:pixelated;object-fit:contain}
#enemyCard .ecName{font-weight:900;color:#ffd2aa;display:flex;justify-content:space-between;gap:6px}
#enemyCard .ecName span:last-child{color:#cfe0dc;font-weight:700}
#enemyCard .ecBar{height:7px;background:#0d1a26;border-radius:9px;overflow:hidden;margin:4px 0 2px}
#enemyCard .ecBar i{display:block;height:100%}
#enemyCard .ecSm{font-size:.88em;color:#bcd3cf}
#enemyCard .ecMv{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:7px}
#enemyCard .ecM{border:1px solid #5d7d88;border-left-width:4px;border-radius:7px;background:rgba(40,70,88,.7);padding:4px 6px}
#enemyCard .ecM b{display:block;font-size:.95em}
#enemyCard .ecM small{font-size:.82em;opacity:.85}
#enemyCard .ecLg{margin-top:6px;font-size:.8em;color:#aac5c0;border-top:1px dashed rgba(230,201,136,.5);padding-top:4px}
body.hasEC #enemyInfo,body.hasEC #moves,body.hasEC #moveinfo{display:none!important}
`;document.head.appendChild(st);
let card=null;
window.__enemyCard=function(e){
 const wrap=document.querySelector('.canvaswrap');if(!wrap)return;
 if(!card){card=document.createElement('div');card.id='enemyCard';card.hidden=true;wrap.appendChild(card)}
 const sel=(typeof selected!=='undefined')&&selected;
 document.body.classList.toggle('hasEC',!!e);
 if(!e||sel||(typeof phase!=='undefined'&&phase==='win')){card.hidden=true;document.body.classList.remove('hasEC');return}
 const b=base[e.id],ms=getMiniSprite(e.id);
 const pp=porSrc(e,'enemy');const por=e.shiny&&!pp?'<span class="pmdSlot" data-pmd="'+pkId(e)+'" data-s="52" data-still="1"></span>':pp?'<img class="big" src="'+pp+'" alt="'+b.name+'">':(ms&&ms.ready)?'<img src="'+ms.img.src+'" alt="'+b.name+'">':b.emoji;
 const f=Math.max(0,e.hp/e.maxHp);
 const mv=e.moves.map(mp=>{const m=moveDB[mp.key];return '<div class="ecM" style="border-left-color:'+(typeColors[m.type]||'#9ca4a7')+'"><b>'+(TYPE_EMOJI[m.type]||'⚪')+' '+m.name+'</b><small>PP '+mp.pp+'/'+m.pp+'</small></div>'}).join('');
 const types=(b.types||[]).map(t=>(TYPE_EMOJI[t]||'')+' '+t).join(' · ');
 card.innerHTML='<div class="ecTop"><div class="ecPor">'+por+'</div><div style="flex:1;min-width:0"><div class="ecName"><span>'+(e.shiny?'✨ ':'')+b.name+'</span><span>Nv. '+e.level+'</span></div><div class="ecBar"><i style="width:'+100*f+'%;background:'+(f<.3?'#e58e75':'#73d8a3')+'"></i></div><div class="ecSm">PS '+e.hp+'/'+e.maxHp+' · PM '+movementAllowance(e)+'/'+b.move+(e.slowed?' · 👣':'')+'</div><div class="ecSm">'+types+'</div></div></div><div class="ecMv">'+mv+'</div><div class="ecLg">🟥 Movimiento · 🟧 Ataque tras moverse · Esc cierra</div>';
 card.hidden=false;if(e.shiny)pmdFill(card);
};
})();

;(()=>{
const st=document.createElement('style');st.textContent=`
#helpOv{position:fixed;inset:0;z-index:400;background:rgba(4,8,18,.82);display:flex;align-items:center;justify-content:center;padding:14px}
#helpOv[hidden]{display:none}
#helpBox{width:min(640px,100%);max-height:92vh;overflow:auto;background:linear-gradient(180deg,#16283a,#0e1828);border:3px solid #f0cf8e;border-radius:14px;box-shadow:0 12px 50px #000b;padding:18px 20px;color:#e6f0ec;font-size:14px;line-height:1.5}
#helpBox h2{font-family:'Press Start 2P',monospace;font-size:13px;color:#ffdf9e;margin:0 0 12px;line-height:1.6}
#helpBox h3{font-size:13px;color:#ffd2aa;margin:14px 0 4px}
#helpBox ol,#helpBox ul{margin:4px 0 0;padding-left:20px}#helpBox li{margin:3px 0}
#helpBox .k{display:inline-block;border:1px solid #6d8f98;border-radius:5px;background:#27465a;padding:0 5px;font-size:12px}
#helpBox .sw{display:inline-block;width:11px;height:11px;border-radius:2px;vertical-align:middle;margin-right:3px}
#helpBox .hTabs{display:flex;gap:8px;margin:0 0 6px}
#helpBox .hTabs button{flex:1;padding:9px 6px;border-radius:9px;border:1px solid #6d8f98;background:#1c3346;color:#cfe3ea;font-weight:800;font-size:13px;cursor:pointer}
#helpBox .hTabs button.on{background:#c79657;border-color:#f2d29b;color:#283b41}
#helpBox .hp[hidden]{display:none}
#helpBox .tip{margin:8px 0 0;padding:8px 10px;border-radius:8px;background:#1c3346;border:1px solid #3d5f72;font-size:13px}
@media (pointer:coarse),(max-width:700px){#helpBox{max-height:calc(100dvh - 28px);padding:14px 14px;font-size:15px;-webkit-overflow-scrolling:touch}#helpClose{position:sticky;bottom:0;padding:14px}}
.helpFab{position:absolute;right:54px;bottom:12px;z-index:6;width:34px;height:34px;border-radius:50%;border:1px solid var(--line,#ffffff40);background:rgba(10,18,36,.72);color:#fff;font-size:17px;font-weight:900;line-height:1;cursor:pointer;backdrop-filter:blur(8px);box-shadow:0 2px 8px rgba(0,0,0,.35);display:none}
@media (pointer:coarse){.helpFab{display:block}}
#helpClose{margin-top:16px;width:100%;padding:11px;border-radius:9px;background:#c79657;border:1px solid #f2d29b;border-bottom:3px solid #7a5a2a;color:#283b41;font-weight:900;cursor:pointer}
`;document.head.appendChild(st);
const ov=document.createElement('div');ov.id='helpOv';ov.hidden=true;
ov.innerHTML=`<div id="helpBox" role="dialog" aria-label="Cómo jugar"><h2>❓ CÓMO JUGAR</h2>
<p>Es un juego de <b>estrategia por turnos</b> sobre un tablero. Derrota a todos los Pokémon rivales para ganar el combate.</p>
<div class="hTabs" role="tablist"><button type="button" data-t="touch">📱 Pantalla táctil</button><button type="button" data-t="pc">🖥️ Ratón y teclado</button></div>
<div class="hp" data-p="touch">
<h3>Tu turno, paso a paso</h3>
<ol>
<li><b>Toca un Pokémon tuyo</b> en el tablero (o en «Tu equipo»). Se marcan en <span class="sw" style="background:#1848dc"></span><b>azul</b> las casillas a las que puede llegar.</li>
<li><b>Toca una casilla azul</b> para moverlo. Para quedarte donde estás, toca otra vez al mismo Pokémon.</li>
<li><b>Elige una acción</b> en el menú: <b>Movimientos</b> (solo aparece si un rival está a tu alcance), <b>Objeto</b>, <b>Esperar</b> o <b>Cancelar</b> (deshace el movimiento).</li>
<li><b>Movimientos:</b> toca un movimiento: se elige y aparece su <b>ficha</b> (tipo, potencia, alcance, efecto). Después <b>toca al enemigo</b> que esté en alcance: el ataque se ejecuta al tocarlo. Para cambiar de movimiento, usa el botón de volver.</li>
<li>Cuando todos hayan actuado, el turno pasa al rival. También puedes tocar <b>Terminar fase ▶</b>.</li>
</ol>
<h3>Mirar a los enemigos</h3>
<p>Toca a un enemigo para ver su ficha (nivel, PS, movimientos y alcance). Lo <span class="sw" style="background:#cd5a0a"></span>naranja es donde podría atacarte tras moverse.</p>
<h3>Cámara y pantalla</h3>
<ul>
<li><b>Desliza un dedo hacia un lado</b> sobre el tablero para girar la cámara 90°.</li>
<li><b>Pellizca con dos dedos</b> para acercar o alejar.</li>
<li>También puedes usar los botones <b>↶ ⟲ ↷</b> (girar) y <b>＋ －</b> (zoom).</li>
<li>El botón <b>☰</b> (arriba a la derecha del tablero) abre el <b>menú del juego</b>: Mapa de Kanto, Equipo, Guardar, Terminar fase, dinero y medallas, sin salir del tablero.</li>
<li>El botón de las <b>cuatro esquinas</b> (abajo a la derecha) pone el tablero en <b>pantalla completa</b>.</li>
<li>En la lista de ataques, la <b>✕</b> de la esquina vuelve al menú de acciones.</li>
</ul>
<p class="tip">💡 Para jugar más cómodo, usa la <b>pantalla completa</b>: con ☰ tienes todo a mano.</p>
</div>
<div class="hp" data-p="pc" hidden>
<p class="tip">⚡ <b>En corto:</b> 1) elige a tu Pokémon · 2) muévelo a una casilla azul · 3) elige <b>Movimientos</b> y toca al enemigo. Cuando todos actuaron, juega el rival.</p>
<h3>Tu turno, paso a paso</h3>
<ol>
<li><b>Elige un Pokémon tuyo:</b> haz clic en él en el tablero o en la lista «Tu equipo».</li>
<li><b>Muévelo:</b> se marcan en <span class="sw" style="background:#1848dc"></span><b>azul</b> las casillas a las que llega. Haz clic en una. Si quieres quedarte donde está, haz clic sobre su propia casilla.</li>
<li><b>Elige una acción</b> en el menú que aparece: <b>Movimientos</b> (solo aparece si un rival está a tu alcance), <b>Objeto</b> (pociones, Poké Ball…), <b>Esperar</b> o <b>Cancelar</b> (deshace el movimiento).</li>
<li><b>Movimientos:</b> escoge uno y luego al enemigo que quede a su alcance. Pasa el ratón sobre un movimiento para ver su <b>ficha</b>: tipo, potencia, precisión, PP, alcance y efecto.</li>
<li>Cuando todos tus Pokémon hayan actuado, la fase pasa sola al rival. También puedes pulsar <b>Terminar fase ▶</b> antes.</li>
</ol>
<h3>Mirar a los enemigos</h3>
<p>Haz clic en un enemigo para ver su ficha: nivel, PS, movimientos y su alcance. <span class="sw" style="background:#cd5a0a"></span>Lo naranja es donde podría atacarte tras moverse. <span class="k">Esc</span> cierra la ficha.</p>
<h3>Atajos de teclado</h3>
<ul>
<li><span class="k">1</span>–<span class="k">4</span>: elegir al instante una opción del menú de acciones o un movimiento. Con un movimiento elegido, <b>vuelve a pulsar su número</b> para confirmarlo sobre el objetivo marcado.</li>
<li><span class="k">←</span> <span class="k">↑</span> <span class="k">↓</span> <span class="k">→</span>: mover el cursor por el tablero y por los menús (la ficha del movimiento se actualiza).</li>
<li><span class="k">Enter</span> o <span class="k">Z</span>: confirmar · <span class="k">Esc</span> o <span class="k">X</span>: volver atrás · <span class="k">N</span>: terminar la fase.</li>
</ul>
<h3>Cámara y pantalla</h3>
<ul>
<li><span class="k">Q</span> y <span class="k">E</span> giran la vista · <span class="k">R</span> la restablece · <span class="k">+</span> y <span class="k">−</span> o la <b>rueda del ratón</b> acercan y alejan.</li>
<li><span class="k">F</span> (o el botón ⛶ del tablero) activa la pantalla completa.</li>
<li>También puedes usar los botones ↶ ⟲ ↷ ＋ － sobre el tablero.</li>
</ul>
<h3>Trucos útiles</h3>
<ul>
<li>El <b>tipo</b> importa: un ataque «muy eficaz» o «poco eficaz» se avisa antes de golpear.</li>
<li>Algunos terrenos cuestan más movimiento (agua, hierba alta; los árboles bloquean). Las <b>cornisas</b> se pueden saltar hacia abajo, pero solo caes a la primera casilla de abajo.</li>
<li>Con una <b>Poké Ball</b> (menú Objeto) puedes capturar Pokémon salvajes cuando están débiles.</li>
<li>Ganar da <b>experiencia</b> y los entrenadores dan dinero. Tu progreso se guarda solo en este navegador.</li>
</ul>
</div>
<h3>Entre combates</h3>
<p>Al ganar vuelves al <b>Mapa de Kanto</b>: elige el siguiente lugar. Puedes revisar tu equipo y la Pokédex desde la barra de arriba.</p>
<button id="helpClose" type="button">¡ENTENDIDO!</button></div>`;
document.body.appendChild(ov);
const close=()=>{ov.hidden=true;try{localStorage.setItem('ptHelpSeen','1')}catch(e){}};
const setTab=t=>{ov.querySelectorAll('.hp').forEach(e=>e.hidden=e.dataset.p!==t);ov.querySelectorAll('.hTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t))};
ov.querySelectorAll('.hTabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.t));
const openHelp=()=>{setTab(matchMedia('(pointer:coarse)').matches?'touch':'pc');ov.hidden=false;const bx=ov.querySelector('#helpBox');if(bx)bx.scrollTop=0};
window.__showHelp=openHelp;
window.__showHelpOnce=()=>{let s=false,g=true;try{s=localStorage.getItem('ptHelpSeen');g=!!localStorage.getItem('pt_gestureHint_v1')}catch(e){}if(s)return;
 // v650: en el móvil, primero el tutorial de gestos y después las instrucciones de combate
 if(!g&&window.__r3d&&matchMedia('(pointer:coarse)').matches){window.__helpAfterGestures=true;return}
 if(matchMedia('(pointer:coarse)').matches)return; // v651: en el móvil se aprende jugando (tutorial guiado en el primer combate); Cómo jugar sigue en ☰ y en ?
 openHelp()};
{const w=document.querySelector('.canvaswrap');if(w){const f=document.createElement('button');f.type='button';f.className='helpFab';f.textContent='?';f.title='Cómo jugar';f.setAttribute('aria-label','Cómo jugar');f.addEventListener('pointerdown',e=>e.stopPropagation());f.addEventListener('click',e=>{e.stopPropagation();openHelp()});w.append(f)}}
ov.querySelector('#helpClose').onclick=close;
ov.addEventListener('click',e=>{if(e.target===ov)close()});
window.addEventListener('keydown',e=>{if(!ov.hidden&&(e.code==='Escape'||e.code==='Enter')){e.stopImmediatePropagation();e.preventDefault();close()}},true);
const mk=(txt,id,cls)=>{const b=document.createElement('button');b.id=id;b.type='button';b.className=cls;b.textContent=txt;b.onclick=window.__showHelp;return b};
const ha=document.querySelector('.campaignHeaderActions');if(ha)ha.insertBefore(mk('❓ CÓMO JUGAR','openHelp','rbtn'),ha.children[1]||null);
const ta=document.querySelector('.titleActions');if(ta){const o=document.getElementById('titleOptions');ta.insertBefore(mk('❓ CÓMO JUGAR','titleHelp','secondary'),o||null)}
})();

;(()=>{
const st=document.createElement('style');st.textContent=`
#tutBar{position:absolute;left:50%;top:56px;transform:translateX(-50%);z-index:45;width:min(88%,540px);pointer-events:none;background:linear-gradient(180deg,rgba(40,28,8,.95),rgba(24,16,4,.95));border:2px solid #ffd58a;border-radius:12px;box-shadow:0 4px 18px #000a;color:#fff3d6;padding:9px 13px;font-size:clamp(11px,1.6vw,14px);line-height:1.4;text-align:center}
#tutBar[hidden]{display:none}
.mcCoach{bottom:64px}
.mcCoach.mcFixed{position:fixed;z-index:600;bottom:24px}.mcCoach.mcFixed.mcTop{top:16px;bottom:auto}
.mcCoach .mcKb{display:block;margin-top:3px;font-style:normal;color:#f7d88f;font-size:11px}
.mcCoach.mcTop{bottom:auto;top:52px}
.mcCoach.mcDone,.mcCoach.mcDone .gcBox{pointer-events:none}
.mcMark{position:absolute;z-index:540;pointer-events:none;transform:translate(-50%,-100%)}
.mcMark[hidden]{display:none}
.mcMark span{display:block;font-size:34px;line-height:1;filter:drop-shadow(0 3px 4px rgba(0,0,0,.6));animation:mcTap 1s ease-in-out infinite}
.mcMark i{position:absolute;left:50%;top:100%;width:44px;height:22px;margin-left:-22px;margin-top:-6px;border-radius:50%;border:3px solid #f7d88f;box-shadow:0 0 12px #f7d88f;animation:mcRing 1s ease-out infinite}
.mcMark.tile{transform:translate(-50%,-100%)}
@keyframes mcTap{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes mcRing{0%{opacity:1;transform:scale(.5)}100%{opacity:0;transform:scale(1.5)}}
.mcPulseBtn{position:relative;z-index:2;outline:3px solid #f7d88f!important;outline-offset:2px;animation:mcBtn 1s ease-in-out infinite}
@keyframes mcBtn{0%,100%{box-shadow:0 0 0 0 rgba(247,216,143,.85)}50%{box-shadow:0 0 0 9px rgba(247,216,143,0)}}body.hasEC #tutBar{left:12px;transform:none;width:calc(100% - 300px);text-align:left}#tutBar b{color:#ffd58a}#tutBar small{display:block;opacity:.75;margin-top:2px;font-size:.82em}
`;document.head.appendChild(st);
let bar=null,active=false,seenPlayerTurns=0,lastPhase='';
window.__tutStart=()=>{active=true;try{window.__capTutReset&&window.__capTutReset()}catch(e){}seenPlayerTurns=0;lastPhase='';try{clearTimeout(mcDoneT);if(mc)mc.classList.remove('mcDone')}catch(e){}try{if(isMobT()&&window.__gestureCoach)window.__gestureCoach()}catch(e){}try{window.__mcAttacked=false;mcOff=false;mcSawEnemy=false;mcDoneAt=0;mcHit=false;mcAim=false;mcHide()}catch(e){}};
// v652 · móvil: tutorial guiado "aprender haciendo" en el primer combate (Pueblo Paleta). En vez de texto largo,
// una tarjeta corta dice qué tocar y un dedo animado lo señala en el tablero o en el menú. Avanza solo cuando lo haces.
const isMobT=()=>matchMedia('(pointer:coarse)').matches;
const MC_KEY='pt_mobTut_v1';let mc=null,mcMark=null,mcRAF=0,mcPulse=null,mcStep=-1,mcDoneAt=0,mcTarget=null,mcAim=false,mcHit=false;
// v652: el tutorial se muestra en cada partida nueva; «Saltar» solo lo cierra para la partida actual
let mcOff=false,mcSawEnemy=false,mcDoneT=0;const mcSeen=()=>mcOff;const mcSave=()=>{mcOff=true};
const mcClearPulse=()=>{if(mcPulse){mcPulse.classList.remove('gcPulse','mcPulseBtn');mcPulse=null}};
const mcHide=()=>{if(mc)mc.hidden=true;if(mcMark)mcMark.hidden=true;mcTarget=null;mcClearPulse();cancelAnimationFrame(mcRAF);mcRAF=0};
const mcLoop=()=>{mcRAF=0;if(!mcMark||!mcTarget||!window.__r3screen){if(mcMark)mcMark.hidden=true;return}
 const p=window.__r3screen(mcTarget.x,mcTarget.y,mcTarget.h||0);if(!p){mcMark.hidden=true;return}
 mcMark.hidden=false;mcMark.style.left=p.x+'px';mcMark.style.top=p.y+'px';mcMark.className='mcMark'+(mcTarget.tile?' tile':'');mcRAF=requestAnimationFrame(mcLoop)};
const mcPoint=t=>{mcTarget=t;if(!mcRAF)mcRAF=requestAnimationFrame(mcLoop)};
const mcPulseBtn=b=>{if(mcPulse===b)return;mcClearPulse();if(b){b.classList.add('mcPulseBtn');mcPulse=b}};
function mcShow(step,ico,title,sub,opts){
 if(!isMobT()){const kb=pcKey(title);title=tw(title);sub=tw(sub);if(kb)sub=(sub?sub+' ':'')+'<i class="mcKb">⌨ '+kb+'</i>'}
 const wrap=document.querySelector('.canvaswrap');if(!wrap)return;
 if(!mc){mc=document.createElement('div');mc.className='gCoach mcCoach';mc.setAttribute('role','status');mc.setAttribute('aria-live','polite');wrap.append(mc)}
 if(!mcMark){mcMark=document.createElement('div');mcMark.className='mcMark';mcMark.hidden=true;mcMark.innerHTML='<i></i><span>👇</span>';wrap.append(mcMark)}
 // v653: si la ventana de victoria o la de Equipo están fuera del tablero (PC sin pantalla completa), la tarjeta va encima de ellas
 {const ov=['managerOverlay','modal'].map(id=>$(id)).find(e=>e&&!e.hidden&&!wrap.contains(e));const host=ov?document.body:wrap;
  if(mc.parentNode!==host)host.append(mc);mc.classList.toggle('mcFixed',!!ov)}
 if(mcMark.parentNode!==wrap)wrap.append(mcMark);
 const dots=step>=0?'<div class="gcDots">'+Array.from({length:(opts&&opts.n)||5},(_,k)=>k).map(k=>'<i class="'+(k<step?'ok':k===step?'on':'')+'"></i>').join('')+'</div>':'';
 const key=step+'|'+title+'|'+sub;
 if(mc.dataset.k!==key){mc.dataset.k=key;
  mc.innerHTML='<div class="gcBox'+(opts&&opts.ok?' gcOk':'')+'"><div class="gcIco">'+ico+'</div><div class="gcTxt"><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+dots+'</div>'+(opts&&opts.noSkip?'':'<button type="button" class="gcSkip">Saltar</button>')+'</div>';
  const sk=mc.querySelector('.gcSkip');if(sk){sk.addEventListener('pointerdown',e=>e.stopPropagation());sk.onclick=e=>{e.stopPropagation();if(opts&&opts.onSkip){opts.onSkip();capHide()}else{mcSave();active=false;mcHide()}}}}
 mc.hidden=false;mcStep=step;mc.dataset.top=opts&&opts.top?'1':'';
 {const bm=$('battleMenu');mc.classList.toggle('mcTop',!!(bm&&!bm.hidden)||mc.dataset.top==='1')} // con el menú de batalla abierto (abajo en el móvil), la tarjeta sube arriba
}
function mobCoach(){
 if(window.__gcPending||document.querySelector('.gCoach:not(.mcCoach)')){mcHide();return} // v652: ni la tarjeta ni la mano mientras espera/corre el tutorial de gestos          // primero termina el tutorial de gestos
 if(!$('modal').hidden||!$('managerOverlay').hidden||(typeof cinematicBusy!=='undefined'&&cinematicBusy)){mcHide();return}
 const me=units.filter(u=>u.side==='player'&&u.hp>0),foes=units.filter(u=>u.side==='enemy'&&u.hp>0);
 const nm=u=>base[u.id].name;
 mcTarget=null;
 if(phase==='enemy'){mcSawEnemy=true;mcClearPulse();mcShow(-1,'🕒','Turno del rival','Mira cómo se mueve y ataca. Luego vuelve tu turno.',{noSkip:true});mcPoint(null);if(mcMark)mcMark.hidden=true;return}
 if(phase!=='player'||locked){mcHide();return}
 if(window.__mcAttacked)mcHit=true; // atacó de verdad (perform)
 // 1 · elegir Pokémon
 if(!selected){const u=me.find(q=>!q.acted);mcClearPulse();
  if(!u){mcShow(-1,'▶','Termina tu fase','Toca ☰ y luego «Terminar fase».');return}
  mcShow(0,'👆',(mcSawEnemy?'Tu turno otra vez: toca a ':'Toca a ')+nm(u),'Es tu Pokémon. Tócalo para elegirlo.');mcPoint({x:u.x,y:u.y,h:1.6});return}
 if(selected.side!=='player'){mcClearPulse();mcShow(0,'👆','Ese es el rival','Toca a tu Pokémon para empezar.');const u=me.find(q=>!q.acted);if(u)mcPoint({x:u.x,y:u.y,h:1.6});return}
 // 4/5 · apuntar el ataque
 if(skill!==null){mcClearPulse();const m=moveDB[selected.moves[skill].key];
  const tg=foes.filter(v=>canAim(selected,m,v.x,v.y));
  if(tg.length){mcAim=true;mcShow(4,'🎯','Toca al rival','Tu ataque llega hasta él. ¡Tócalo para atacar!');mcPoint({x:tg[0].x,y:tg[0].y,h:1.6})}
  else mcShow(4,'📏','No llega','El rival está lejos. Toca ✕ y elige «⌛ Esperar» para acercarte el próximo turno.');return}
 // 3 · menú de acciones / ataques
 if(actionMenu){const bm=$('battleMenu'),btns=bm?[...bm.querySelectorAll(':scope>button:not(.bmClose)')]:[];
  if(actionMenu==='actions'){const bt=t=>btns.find(b=>b.textContent.includes(t));
   const canHit=foes.some(v=>selected.moves.some(mp=>mp.pp>0&&moveDB[mp.key].power>0&&canAim(selected,moveDB[mp.key],v.x,v.y)));
   if(canHit&&bt('Movimientos')){mcShow(2,'⚔','Toca «Movimientos»','Ahí están los ataques de '+nm(selected)+'.');mcPulseBtn(bt('Movimientos'))}
   else{mcShow(2,'⌛','Toca «Esperar»','El rival aún está lejos: por eso no aparece «Movimientos». Esperar termina el turno de '+nm(selected)+'.');mcPulseBtn(bt('Esperar'))}
   return}
  if(actionMenu==='moves'){let k=selected.moves.findIndex(mp=>mp.pp>0&&moveDB[mp.key].power>0&&foes.some(v=>canAim(selected,moveDB[mp.key],v.x,v.y)));if(k<0)k=selected.moves.findIndex(mp=>mp.pp>0&&moveDB[mp.key].power>0);
   mcShow(3,'💥','Elige un ataque',k>=0?'Prueba con «'+moveDB[selected.moves[k].key].name+'». '+(isMobT()?'Al tocarlo verás su ficha; luego toca al rival.':''):'Elige uno de la lista.');mcPulseBtn(btns[k>=0?k:0]);return}
 }
 mcClearPulse();
 // 2 · moverse
 if(!selected.moved){
  let best=null,bd=1e9;try{for(const sp of reachableSpots(selected)){const d=Math.min(...foes.map(v=>Math.abs(v.x-sp.x)+Math.abs(v.y-sp.y)));if(d>=1&&(d<bd||d===bd&&sp.cost<best.cost)){bd=d;best=sp}}}catch(e){}
  // v652: si ya alcanza al rival desde donde está, no le pedimos moverse: basta con tocarlo otra vez para quedarse
  const hitHere=foes.some(v=>selected.moves.some(mp=>mp.pp>0&&moveDB[mp.key].power>0&&canAim(selected,moveDB[mp.key],v.x,v.y)));
  const curD=Math.min(...foes.map(v=>Math.abs(v.x-selected.x)+Math.abs(v.y-selected.y)));
  if(hitHere||!best||bd>=curD){mcShow(1,'📍',hitHere?'Ya estás junto al rival':'Quédate aquí','Toca a '+nm(selected)+' otra vez para quedarte'+(hitHere?' y atacar.':'.'));mcPoint({x:selected.x,y:selected.y,h:1.6});return}
  mcShow(1,'👣','Toca una casilla azul','Ahí se moverá '+nm(selected)+'. Acércate al rival.');
  if(best&&!(best.x===selected.x&&best.y===selected.y))mcPoint({x:best.x,y:best.y,h:.05,tile:true});else mcPoint({x:selected.x,y:selected.y,h:1.6});return}
 mcShow(2,'📋','Elige qué hacer','Usa el menú que apareció junto a tu Pokémon.');
}
// v653 · tutorial de captura (primer combate salvaje con Poké Balls) y de equipo (llevar la captura al tablero).
// Mismo estilo que el del primer combate: tarjeta corta + dedo que señala. Se guarda en la partida (tc): 1 = captura, 2 = equipo.
let capOwn=false,capEnc=null,capCaught0=-1,capBalls0=-1,capMsg=null,capMsgUntil=0,teamWatch=null,capScrolled=null;
const tutCT=()=>window.__tutCT||0,tutSet=b=>{window.__tutCT=tutCT()|b;try{autoSaveSafe()}catch(e){}};
const caughtCount=()=>[...partyAll(),...storageBox].filter(u=>u.caughtAt).length;
const ballCount=()=>['pokeball','greatball','ultraball'].reduce((s,k)=>s+(bag[k]||0),0);
const visEl=el=>!!el&&!el.hidden&&el.offsetParent!==null;
const tw=s=>!s||isMobT()?s:s.replace(/Toca ☰ y luego «Terminar fase»\.?/g,'Haz clic en «Terminar fase ▶» o pulsa N.').replace(/Toca ☰ y luego «🐾 Equipo»\.?/g,'Haz clic en «🐾 Equipo».').replace(/\bToca a /g,'Haz clic en ').replace(/\bToca\b/g,'Haz clic en').replace(/\btoca\b/g,'haz clic en').replace(/Tócalo/g,'Haz clic en él');
// v653 · atajos de teclado que se muestran en la guía del PC
const pcKey=t=>/Movimientos|Objeto|Esperar|Elige qué hacer/.test(t)?'Teclas 1–4 o flechas + Enter':/Elige un ataque/.test(t)?'Teclas 1–4 · Esc vuelve':/^Toca al (rival|Pokémon salvaje)/.test(t)?'Esc para volver atrás':/Termina tu fase/.test(t)?'':/^(Tu turno otra vez: )?[Tt]oca a [A-ZÁÉÍÓÚ]/.test(t)?'Q / E giran la cámara · rueda del ratón: zoom':'';
const capShow=(step,ico,t,sub,opts)=>{capOwn=true;mcShow(step,ico,tw(t),tw(sub),opts)};
const capHide=()=>{if(capOwn){capOwn=false;mcHide()}};
const capFlash=(ico,t,sub,opts,ms)=>{capMsg=[ico,t,sub,opts,ms];capMsgUntil=0};
const pulseSee=b=>{mcPulseBtn(b);if(b&&capScrolled!==b){capScrolled=b;try{b.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}}};
window.__capTutSure=()=>{if(window.__tutCT==null)window.__tutCT=caughtCount()>0?3:0;return !(tutCT()&1)&&caughtCount()===0};
window.__capTutReset=()=>{window.__tutCT=0;capEnc=null;capCaught0=-1;capBalls0=-1;capMsg=null;teamWatch=null;capHide()};
function capCoach(){
 if(mc&&mc.classList.contains('mcDone'))return;
 if(window.__gcPending||document.querySelector('.gCoach:not(.mcCoach)')){capHide();return}
 if(window.__tutCT==null)window.__tutCT=caughtCount()>0?3:0; // partidas guardadas antes de este tutorial
 if(capMsg&&(!capMsgUntil||Date.now()<capMsgUntil)){
  const blocked=!$('modal').hidden||cinematicBusy||captureBusy||!$('captureScene').hidden||!$('expScene').hidden||progressIsOpen||pendingExperience.length||pendingProgress.length||!$('managerOverlay').hidden&&!capMsg[0].includes('✨');
  if(blocked){if(teamCoach())return;capHide();return}
  if(!capMsgUntil)capMsgUntil=Date.now()+capMsg[4];
  capShow(-1,capMsg[0],capMsg[1],capMsg[2],capMsg[3]);mcPoint(null);if(mcMark)mcMark.hidden=true;mcClearPulse();return}
 capMsg=null;
 if(teamCoach())return;
 if(capFlow())return;
 capHide();
}
function capFlow(){
 const enc=currentEncounter;
 if(tutCT()&1||!enc||isTrainerBattle()||!$('campaignOverlay').hidden)return false;
 const balls=ballCount(),cc=caughtCount();
 if(capEnc!==enc){capEnc=enc;capCaught0=cc;capBalls0=balls}
 if(cc>capCaught0){capCaught0=cc;capBalls0=balls;tutSet(1);
  const u=[...reserves,...storageBox].filter(q=>q.caughtAt).pop(),nm=u?base[u.id].name:'el Pokémon';
  capFlash('🔴','¡Capturaste a '+nm+'!',(u&&reserves.includes(u)?'Quedó en tus reservas. ':'Se envió a la Caja Pokémon. ')+'La próxima vez, bájale PS antes: así es más fácil.',{ok:true,noSkip:true},5000);return true}
 if(balls<capBalls0&&!captureBusy){capBalls0=balls;capFlash('💨','¡Se escapó!','Mientras menos PS tenga, más fácil es atraparlo: bájaselos con un ataque (sin debilitarlo) y vuelve a intentarlo.',{noSkip:true},5000);return true}
 capBalls0=balls;
 if(balls<1||phase!=='player'||locked||cinematicBusy||captureBusy||!$('modal').hidden||!$('managerOverlay').hidden)return false;
 const wild=units.filter(u=>u.side==='enemy'&&u.hp>0);if(!wild.length||storageBox.length>=BOX_CAPACITY)return false;
 const me=units.filter(u=>u.side==='player'&&u.hp>0),nm=u=>base[u.id].name,sk={onSkip:()=>tutSet(1)};
 const near=a=>wild.filter(v=>distance(a,v)<=CAPTURE_RANGE);
 // 5 · apuntar la Ball
 if(captureMode&&captureMode.ballId){mcClearPulse();const t=near(captureMode.actor);
  if(t.length){capShow(4,'🎯','Toca al Pokémon salvaje','Mientras menos PS tenga el salvaje, más fácil es atraparlo.',sk);mcPoint({x:t[0].x,y:t[0].y,h:1.6})}
  else{capShow(4,'📏','Está muy lejos','La Ball llega a 3 casillas o menos.',sk);mcPoint(null)}return true}
 if(captureMode)return false; // está usando otro objeto
 // 4 · mochila
 if(!$('gameBag').hidden){mcPoint(null);
  if(!$('revivePicker').hidden)return false;
  if(bagTab!=='balls'){capShow(3,'🔴','Toca «🔴 Poké Balls»','Es la pestaña de arriba de la mochila.',Object.assign({top:true},sk));pulseSee($('bagTabs').querySelector('[data-t="balls"]'))}
  else{const row=[...$('inventoryList').querySelectorAll('.inventoryItem')].find(r=>/Ball/.test(r.textContent)),b=row&&row.querySelector('button');
   capShow(3,'🔴','Toca «Usar» en la Poké Ball','Después eliges a qué salvaje lanzarla.',Object.assign({top:true},sk));pulseSee(b&&!b.disabled?b:null)}
  return true}
 // 1 · elegir Pokémon
 if(!selected){const u=me.find(q=>!q.acted);if(!u)return false;mcClearPulse();
  capShow(0,'🔴','¡Captura un Pokémon!','Tienes Poké Balls del Profesor Oak. Toca a '+nm(u)+' para empezar.',sk);mcPoint({x:u.x,y:u.y,h:1.6});return true}
 if(selected.side!=='player'||selected.acted||skill!==null)return false; // si está atacando, lo dejamos
 // 3 · menú de acciones
 if(actionMenu==='moves'){mcClearPulse();mcPoint(null);capShow(2,'🎒','¿Atacar o capturar?','Un ataque le baja PS. Para lanzar la Ball, toca ✕ y luego «🎒 Objeto».',sk);return true}
 if(actionMenu==='actions'){mcPoint(null);const bm=$('battleMenu'),btns=bm?[...bm.querySelectorAll(':scope>button:not(.bmClose)')]:[];
  const bt=t=>btns.find(b=>b.textContent.includes(t));
  if(near(selected).length){capShow(2,'🎒','Toca «🎒 Objeto»','Ahí están tus Poké Balls.',sk);mcPulseBtn(bt('Objeto'))}
  else{capShow(2,'📏','Aún está lejos','La Ball llega a 3 casillas. Toca «⌛ Esperar» y acércate el próximo turno.',sk);mcPulseBtn(bt('Esperar'))}
  return true}
 // 2 · acercarse
 if(!selected.moved){mcClearPulse();
  if(near(selected).length){capShow(1,'📍','Ya está a tu alcance','Toca a '+nm(selected)+' otra vez para quedarte ahí.',sk);mcPoint({x:selected.x,y:selected.y,h:1.6});return true}
  let best=null,bd=1e9;try{for(const sp of reachableSpots(selected)){const d=Math.min(...wild.map(v=>distance(sp,v)));if(d>=1&&(d<bd||d===bd&&sp.cost<best.cost)){bd=d;best=sp}}}catch(e){}
  capShow(1,'👣','Acércate al salvaje','Toca una casilla azul. La Ball llega a 3 casillas o menos.',sk);
  if(best&&!(best.x===selected.x&&best.y===selected.y))mcPoint({x:best.x,y:best.y,h:.05,tile:true});else mcPoint({x:selected.x,y:selected.y,h:1.6});return true}
 return false;
}
function teamCoach(){
 if(teamWatch&&units.includes(teamWatch)&&$('modal').hidden){const nm=base[teamWatch.id].name;teamWatch=null;tutSet(2);
  capFlash('✨','¡'+nm+' ya está en tu equipo!','Desde 🐾 Equipo cambias quién combate. Toca ✕ Cerrar para seguir.',{ok:true,noSkip:true},4500);return true}
 if(tutCT()&2)return false;
 const u=reserves.filter(q=>q.caughtAt).slice(-1)[0];if(!u){teamWatch=null;return false}
 if(units.filter(q=>q.side==='player').length>=maxDeploy()||cinematicBusy||captureBusy||progressIsOpen||pendingExperience.length||pendingProgress.length)return false;
 const mgr=$('managerOverlay'),teamOpen=!mgr.hidden&&!$('teamManager').hidden;
 // v653 · al ganar la etapa: botón «🐾 EDITAR EQUIPO» de la ventana de victoria
 if(!$('modal').hidden){const eb=phase==='win'&&[...$('modalButtons').querySelectorAll('button')].find(b=>/EDITAR EQUIPO/.test(b.textContent));if(!eb)return false;
  const nm=base[u.id].name,fresh=capMsg&&/Capturaste/.test(capMsg[1]);if(fresh)capMsg=null;teamWatch=u;mcPoint(null);if(mcMark)mcMark.hidden=true;
  capShow(0,'🐾',(fresh?'¡Capturaste a '+nm+'! Súmalo':'Suma a '+nm)+' a tu equipo','Toca «🐾 Editar equipo». Las reservas no pelean.',{top:true,n:3,onSkip:()=>{teamWatch=null;tutSet(2)}});pulseSee(eb);return true}
 if(!$('campaignOverlay').hidden&&!teamOpen)return false;
 let prep=false;try{prep=canPrepare()}catch(e){}
 if(!teamOpen&&(!prep||phase!=='player'))return false; // al empezar un combate, antes de mover a nadie
 const nm=base[u.id].name,sk={onSkip:()=>{teamWatch=null;tutSet(2)},n:3};teamWatch=u;mcPoint(null);if(mcMark)mcMark.hidden=true;
 if(teamOpen){
  if(managerSelected===u){const b=[...$('partyDetails').querySelectorAll('button')].find(q=>/DESPLEGAR/.test(q.textContent));
   capShow(2,'＋','Toca «＋ Desplegar en el tablero»',nm+(phase==='win'?' peleará desde el próximo combate.':' entrará a este combate.'),Object.assign({top:true},sk));pulseSee(b&&!b.disabled?b:null)}
  else{const b=$('reserveList').children[reserves.indexOf(u)];
   capShow(1,'🐾','Toca a '+nm,'Está en tus reservas: las reservas no pelean.',Object.assign({top:true},sk));pulseSee(b)}
  return true}
 const fm=document.querySelector('.fsMenu');
 if(fm&&!fm.hidden){capShow(0,'🐾','Toca «🐾 Equipo»','Ahí organizas tu equipo.',Object.assign({top:true},sk));pulseSee(fm.querySelector('[data-a="openTeam"]'));return true}
 const mb=document.querySelector('.fsMenuBtn');
 if(visEl(mb)){capShow(0,'☰','¡Lleva a '+nm+' al combate!','Toca ☰ y luego «🐾 Equipo».',sk);mcPulseBtn(mb)}
 else{capShow(0,'🐾','¡Lleva a '+nm+' al combate!','Toca «🐾 Equipo».',sk);mcPulseBtn($('openTeam'))}
 return true;
}
setInterval(()=>{if(active&&!mcSeen())try{window.__tutHint()}catch(e){}
 else try{capCoach()}catch(e){}
 if(mc&&!mc.hidden){const bm=$('battleMenu');mc.classList.toggle('mcTop',!!(bm&&!bm.hidden)||mc.dataset.top==='1')}},300);
window.__tutHint=function(){
 const wrap=document.querySelector('.canvaswrap');if(!wrap)return;
 if(!bar){bar=document.createElement('div');bar.id='tutBar';bar.hidden=true;wrap.appendChild(bar)}
 const mob=true; // v653: el PC usa la misma guía que el móvil (antes, una barra de texto)
 const finish=()=>{active=false;bar.hidden=true;if(mob&&mc&&!mc.hidden&&!mcDoneAt&&!mcSeen()){mcSave();mcDoneAt=1;mcShow(-1,'✨','¡Ya sabes jugar!',isMobT()?'Elige, muévete y ataca. Más opciones y ayuda en ☰.':'Elige, muévete y ataca. Ayuda completa en ❓ Cómo jugar.',{ok:true,noSkip:true});mc.classList.add('mcDone');if(mcMark)mcMark.hidden=true;mcClearPulse();clearTimeout(mcDoneT);mcDoneT=setTimeout(()=>{mcHide();if(mc)mc.classList.remove('mcDone')},3000)}else if(!mcDoneAt)mcHide()};
 if(!active||!currentEncounter||currentEncounter.id&&currentEncounter.id!=='pallet'){if(active&&phase==='win')finish();else{bar.hidden=true;if(!mcDoneAt)mcHide();if(currentEncounter&&currentEncounter.id!=='pallet')active=false}return}
 if(phase==='win'){finish();return}
 if(phase==='player'&&lastPhase!=='player')seenPlayerTurns++;lastPhase=phase;
 if(seenPlayerTurns>=(mob?5:3)||(mob&&mcHit&&!locked&&(typeof cinematicBusy==='undefined'||!cinematicBusy))){finish();return}
 if(mob){bar.hidden=true;if(mcSeen()&&!mcDoneAt){mcHide();return}mobCoach();return}
 let t='';
 if(phase==='enemy')t='🕒 <b>Turno del rival.</b> Observa cómo se mueve y ataca; luego vuelve tu turno.';
 else if(skill!==null)t='🎯 <b>Elige a quién atacar:</b> haz clic en el enemigo que esté a tu alcance. <small>Esc para volver atrás.</small>';
 else if(actionMenu)t='📋 <b>Elige una acción</b> del menú: <b>Movimientos</b> para pelear, <b>Esperar</b> para terminar sin atacar. <small>Atajo: teclas <b>1-4</b>.</small>';
 else if(inspectedEnemy&&!selected)t='👁️ Esta es la <b>ficha del rival</b>. Lo rojo y naranja es su alcance. Pulsa <b>Esc</b> y elige tu Pokémon.';
 else if(selected&&selected.acted)t='✅ Este Pokémon ya actuó. Pulsa <b>Terminar fase ▶</b> si no queda nadie más.';
 else if(selected&&!selected.moved)t='👣 Las casillas <b>azules</b> son hasta donde puedes llegar: haz clic en una para <b>moverte</b>. <small>Si quieres quedarte, haz clic sobre tu propia casilla.</small>';
 else if(selected)t='📋 Ahora elige qué hacer en el menú que apareció.';
 else if(phase==='player')t='👆 <b>Tu turno:</b> haz clic en tu Pokémon para seleccionarlo. <small>Tip: haz clic en el enemigo para ver su ficha. Botón ❓ arriba = ayuda completa.</small>';
 if(!t){bar.hidden=true;return}
 bar.innerHTML=t;bar.hidden=false;
};
})();

;(()=>{
const W=192,H=145;
const DATA="A192|A19B32C5D59C5B11A4w57|A18B33C6D58C5B10A5w57|A18B33C7D57C5B10A5w57|A17B35C6D57C5B10A4w58|A16B36C7D55C5B10A5w58|A15B37C7D55C5B10A5w58|A13B39C7D55C5B9A6w58|A11B41C7D54C5B10A5w59|A11B41C7D53C6B8A7w59|A10B42C8D51C6B8A7w60|A10B41C9D49C7B8A7w61|A10B41C9D47C8B9A7w61|A9B42C9D46C9B9A7w61|A9B42C10D45C8B9A7w62|A9B6C3B32C11D44C9B9A7w62|A8B5C6B31C11D44C8B10A7w62|A7B5C8B31C11D42C7B12A6w63|A6B6C8B31C11D42C7B12A6w63|A5B6C10B30C12D40C8B12A7w62|A5B6C10B31C11D40C7B13A9w60|BA3B7C11B30C12D38C8B12A14w56|BA3B7C11B30C12D38C7B13A18w52|B2AB7C13B29C12D38C7B12A22w49|B10C14B28C12D38C7B11A24w48|B8C20B24C12D38C7B9A2o24Aw47|CB7C22B22C12D38C7B8A3o24A2w46|CB6C24B20C12D38C7B8A4o24A2w46|CB5C9D6C10B20C12D38C7B8A4o24A2w46|C2B4C7D11C8B19C12D38C6B9A4o24Aw47|C2B4C6D14C6B19C11D38C7B8A5o24Aw47|C3B2C6D18C5B16C11D39C6B9A5o24A3w45|C3B2C6D19C7B13C11D39C5B10A5o24A8w40|C3B2C6D21C7B11C11D18E6D14C5B11A5o8A31w33|C3B2C6D21C8B10C11D17E7D13C5B12A5o8A19B9A6w30|C3BC6D24C6B9C11D14E12D10C7B12A5o8A15B7C5B4A5w28|DC2BC6D12E7D7C4B9C11D10E16D8C7B14A5o8A11B9C9B4A4w27|DC9D10E12D5C4B8C11D8E18D7C6B15A6o8A8B9C5D5C4B3A4w26|DC8D10E14D4C4B7C12D7E18D7C6B16A6o8A7B8C5D9C3B3A4w25|DC8D10E14D5C3B7C11D8E18D7C5B16A7o8A5B8C6D4E4D3C2B3A4w25|DC6D11E16D4C4B5C10D9E18D8C5B15A8o8A3B9C6D3E7D2C3B3A4w24|DC6D11E6o8E3D3C4B3C11D9E7r19q5p15o17p12q5r13q2CB3A4w24|D2C4D12E7o6E4D3C4BC13D9E7r19q5p13o18p12q6r13q2CB3A4w24|D2C4D12E6o7E4D3C17D10E7r19q4p11o21p12q5r14q2CB3A3w25|D2C4D12E6o7E4D3C13D14E7r10b4r5q4p8o24p11q6r10b4q2B3A4w25|D2C4D13E6o6E4D3C11D15E8r10b4r4q5p8o24p11q7r9b4q2B3A3w26|D2C4D13E16D3C6D19E9r17q6p7o25p10q9r12q2B3A2w27|D2C4D14E14D3C5D18E12r16q6p8o25p10q11r10q2B2A3w27|D2C5D13E4o8ED4C3D17E15r16q6p8o26p9q23B2A2w28|D3C5D12E4r8D8o8r32D8C5B9A18o5p3B9C15q7pB2A2w28|D4C5D12E3r8D9o6r33D6C7B8A19o5p3B10C14q6p2B2A2w28|D4C5D14Er8D8o7r33D3C9B8A20o5p3B11C13q6p2B2A2w28|D5C5D14r2b4r2D8o7r27q6C12B8A20o6p2B14C10q2b4p2B2A2w28|D5C5D14r2b4r2D9o6r23q10C11B9A20o6p2B18C6q2b4p2BA4w27|D6C5D13r8D15r21q12C11B8A21o7pB24p8BA4w27|D6C6D12r8D15r16q17C10B9A21o7pB24p8BA4w27|D7C6D11r8D8o8r11q21C9B10A21o8B24p8A5w27|D8C8D8r8C3D5r8D8C32B11A21o8A2B22p7oA5w27|D8C9D7r7qC4D4r8D7C32B12A21o8A4B20p6o2A4w28|D9C11D4r5q3C4D4r8D5C31B15A21o8A7B17p4o4A3w29|D10C13Dr3q5C4D4r2b4r2D3C26B22A21o8A10B14p2o6A3w29|D13C11q8C4D4r2b4r2D2C21B27A22o8A13B11o8A3w29|D17C7q8C5D3r8D2C13B35A22o8A14B9Ao8A2w30|D18C6q8C5D3r8DC11B37A23o8A16B4A4o8A2w30|D21C3q8C5D3r8DC7B40A24o8A24o8A2w30|D24rq7C6D2r8C5B11p31o65A2w30|D24r3q5C6D2r6q2C5B11p29o66A3w30|CD23r5q3C7Dr6q2C4B12p26o69A3w30|C3D21r6q2C7Dr2b4q2C4B12p24o72A2w30|C5D19r6q2C8q2b4q2C3B13p13o83A2w30|C7D17r6q2C8q8C3B13p5o87b4A3w29|C11D13r6q2C8q8C2B14p2o90b4A3w29|C16D8r2q6C8q8CB15o96A4w28|C24q8C8q8B11A5o8A48o8A24o8A4w28|C24q8C8q8B9A7o8A48o8A24o8A4w28|C24q8C8q7pB8A8o8A29w3A16o8A24o8A5w27|C21B3p6q2C8q6p2B8A8o3z5w8A19w13A8o8A24o8A7w25|C15B9p8B3C5q4p4B7A9z8w9A19w13A7o8A24o8A8w24|C7B17p8B7Cq2p6B6A9wz8w11A17w15A5o8A24o8A8w24|C4B20p8B8p8B6A7w3z8w14A15w17A2o8A24o8A8w24|B24p8B8p8B5A6w5z8w16A14w18o8A24o8A8w24|B24p16o8B5A5w6z8w18A14w16zo7A24o8A6w26|B24p17o6B5A5w7z8w19A13w16zo7A14B5A5o8A3w29|B24p16o7B5A4w8z8w20A12w16z2o6A13B6A5o8A2w30|B24p16o7B5A4w8z8w20A11w17z2o6A11B9A4o8Aw31|B24p17o6B4A4w9z8w19A8w21z2o6A10B11A3o8Aw31|B23Ao3p20B3A4w10z8w19A6w23z2o6A7B7C4B3A3o8w32|B20A4o5p18B3A4w10z8w20A6w22zo7A5B8C5B3A3o7bw32|B16A8o8p8o8BA4w11z8w22A4w22o8A3B7C8B3A3o6b2w32|B11A23B6p8BA4w11z8w48o11p4q11p4o8b2w32|B9A28B3p8BA3w12z8w47A2o13q12p4o7b3w32|B3A36Bp8BA3w12z8w46A2o14q12p4o6b4w32|A23w9A8op7BA3w12z8w46A2o10b4q12p4o5b5w32|A20w15A5o2p6BA3w12z8w46A3o9b4p2q10p4o5b5w32|A15w22A3o2p6B2A2w12z8w45A10o7p2q9p4o6b5w32|A13w25A2o2p3q2pB2A3w11z8w45A10o7p2q8p5o5b6w32|A11w27A2op4q3B3A3w10z8w45A3o12p4q8p4o6b6w32|A6w30A4p4q4B3A3w10z8w45A15B5C6B4A5o2b6w32|A3w30A6Bp3q5B3A2w11z8w46A14B5C5B5A5o2b6w32|A2w31A4B3p2q6CB2A2w11z8w46A13B5C6B5A5ob7w32|Aw31A4B4p2q6CB3A3w9z8w46A11B7C5B6A5ob7w32|Aw31A4B4pq7C2B3A3w8z8w45A11B7C4B7A6ob7w32|w32A4B4pq7C3B2A3w8z8w44A11B8C2B9A6ob7w32|w32A4B4pq7C3B2A3w8z8w42A11B20A7ob7w32|w33A3B4pq7C3B2A3w8z8w40A11B21A8o2b6w32|w34A3B3o8C2B3A2w9z8w37A8B11p16o10b6w32|w34A4B3o6C3B2A3w9z8w35A6B15p16o10b6w32|w34A4B2o7C2B2A3w10z8w34A4B18p2q2p11o11b6w32|w34A4B2o7B4A2w11z8w34A2B20q4p11o11b6w32|w34A3B4o6B3A3w11z8w33A2B8C6B4C3q4p11o12b5w32|w33A4B12A4w11z8w33A2B5C16q3p12o12b5w32|w33A4B10A5w12z8w32A3B3C18q2p13o12b5w32|w33A4B3o8A3w13z8w32A2B3C19q2p12o13b5w32|w34A3B3p6o2A2w14z39o9q17p7B6A13w37|w34A4B2p3o5Aw15z38o9q17p8B5A14w37|w34A6o6b2w16z38o9q16p9B5A14w37|w35A5o4b4w16z38o10q14p10B3A15w38|w37A3ob7w16z37o11q14p9oA18w38|w40b8w16z37o2p5b4q12p9o3A17w39|w40b8w16z36o2p6b4q7p13o4A14w42|w40b8w16z35o3p2o8q4p13o7A11w45|w40b8w50A3B3pq7C2B10A20w48|w40b8w50A4B2p4q4CB7A8w9A6w49|w40b8w50A6p8B3A11w66|w40b8w51A5o3p5BA11w68|w40b8w53A3o8A7w73|w40b8w56o8A4w76|w39A6b3w56z3o5A2w78|w38A9bw56z6o2Aw79|w38A2o8b64w80|w38AB2o6A2b19A4b40w80|w38ABo7A2b18A2B2A7b34w80|w38ABo8A2b17AB3A3b4A2b32w80|w38A3o7A2b17A2BA4b4A2b32w80|w38A6b4A2b18A4b6A2b32w80|w39A5b4A2b62w80|w39Ao8A2b62w80|w40A10w142|w43A6w143|w45A3w144|w192|w192|w192|w192|w192";
const POS={pallet:[44,109],route1:[44,97],viridian:[44,85],route2in:[44,76],forest:[44,67],forestexit:[44,60],route2:[44,58],gymguard:[44,53],pewter:[49,49],route3:[60,52],route3b:[68,52],mtmoonj:[76,52],mtmoon:[76,52],mtmoonb:[85,45],mtmoonc:[85,45],route4:[104,45],ceruleanrival:[125,46],ceruleanguard:[117,41],cerulean:[125,46],nugget:[125,36],nuggetrocket:[125,36],route25:[134,28],route25b:[134,28],bill:[143,28],route5:[124,58],route6:[124,80],vermilionrival:[124,93],vermilionguard:[124,93],vermilion:[124,93]};
const VIA={'route1>viridian':[[44,85]],'viridian>route2in':[[44,84]],'pewter>route3':[[52,52]],'mtmoon>mtmoonb':[[85,52]],'mtmoonj>mtmoonb':[[85,52]],'nugget>route25':[[125,28]],'bill>route5':[[143,46],[125,46]]};
const CITY=new Set(['pallet','viridian','gymguard','cerulean','ceruleanrival','vermilionrival','vermilion']);
const GROUP={forest:'forestexit',gymguard:'pewter',route3:'route3b',mtmoonj:'mtmoon',mtmoonb:'mtmoonc',ceruleanrival:'cerulean',nugget:'nuggetrocket',route25:'route25b',vermilionrival:'vermilion'},HID=new Set(['vermilionguard','vermilion','route25b','nuggetrocket','ceruleanguard','cerulean','forestdoug','forestmid','forestexit','pewter','route3b','mtmoon','mtmoonc']),GNAME={forest:'Bosque Verde',gymguard:'Ciudad Plateada',route3:'Ruta 3',mtmoonj:'Monte Moon',mtmoonb:'Subsuelo',ceruleanrival:'Ciudad Celeste',nugget:'Ruta 24',route25:'Ruta 25',vermilionrival:'Ciudad Carmín'};
const LABEL={};
const OTHER_CITIES=[[28,45],[44,85],[100,69],[124,69],[156,69],[124,93],[108,117],[44,133],[44,53],[124,45]];
const SQUARES=[[28,52],[156,45],[156,53],[158,71],[132,93],[110,119],[46,134],[76,132]];
const st=document.createElement('style');st.textContent=`
.kmapHolder{position:relative;width:100%;aspect-ratio:${W}/${H};border:3px solid #1d2f46;border-radius:12px;overflow:hidden;background:#9ac1ea;box-shadow:inset 0 0 0 2px #ffffff40,0 3px 0 #0a1822}
.kmapHolder canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
.kmapHolder svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.kmNode{position:absolute;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;border:2px solid #17202d;background:#e9edf2;padding:0;cursor:pointer;box-shadow:0 2px 0 #0007;z-index:3}
.kmNode.city{width:18px;height:18px;border-radius:4px}
.kmNode.done{background:#6fdc8c}
.kmNode.avail{background:#ffd54a;animation:kmPulse 1.1s ease-in-out infinite}
.kmNode.locked{background:#6a7482;cursor:not-allowed;opacity:.85}
.kmNode.active{outline:3px solid #fff;outline-offset:2px}
@keyframes kmPulse{50%{transform:translate(-50%,-50%) scale(1.25)}}
.kmLbl{position:absolute;transform:translate(-50%,0);font:900 9.5px/1.1 system-ui,sans-serif;color:#10212f;background:#f4eac7e6;border:1px solid #6c5d34;border-radius:4px;padding:1px 4px;white-space:nowrap;pointer-events:none;z-index:2}
.kmBanner{position:absolute;left:8px;bottom:8px;z-index:4;background:#10212fdd;color:#ffe9a8;border:1px solid #c9b46a;border-radius:7px;padding:4px 9px;font:800 11px system-ui,sans-serif}
`;document.head.appendChild(st);
const PAL={w:['#a8d0f2','#9cc3ea'],b:['#5ea3da','#5ea3da'],A:'#2d7a2f',B:'#479b36',C:'#66b73e',D:'#88cf4c',E:'#b0df68',o:'#dd9d22',p:'#e6b64c',q:'#efcd6c',r:'#f3e08e',z:'#e5deb8'};
let bg=null;
function drawBg(){
 const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const rows=DATA.split('|');
 for(let y=0;y<H;y++){let x=0;const m=rows[y].match(/([A-Za-z])(\d*)/g)||[];
  for(const tok of m){const k=tok[0],n=tok.length>1?parseInt(tok.slice(1),10):1;
   for(let i=0;i<n;i++,x++){let col=PAL[k];if(Array.isArray(col))col=col[y&1];g.fillStyle=col||'#000';g.fillRect(x,y,1,1)}}}
 // ciudades y puntos de interés (decorativos)
 const circ=(x,y)=>{g.fillStyle='#f4efe2';g.fillRect(x-3,y-2,6,4);g.fillRect(x-2,y-3,4,6);g.fillStyle='#d9533a';g.fillRect(x-2,y-2,4,4);g.fillRect(x-1,y-3,2,6);g.fillRect(x-3,y-1,6,2)};
 const sq=(x,y)=>{g.fillStyle='#f4efe2';g.fillRect(x-2,y-2,5,5);g.fillStyle='#4f7fe0';g.fillRect(x-1,y-1,3,3)};
 OTHER_CITIES.forEach(p=>circ(p[0],p[1]));SQUARES.forEach(p=>sq(p[0],p[1]));
 return c;
}
window.__kmap=function(holder){
 holder.className='kmapHolder';holder.replaceChildren();
 if(!bg)bg=drawBg();
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').drawImage(bg,0,0);holder.append(cv);
 const ns='http://www.w3.org/2000/svg',sv=document.createElementNS(ns,'svg');sv.setAttribute('viewBox','0 0 '+W+' '+H);
 const order=STAGE_ORDER.filter(id=>POS[id]&&!HID.has(id));
 const clr=id=>GROUP[id]?stageCleared.has(GROUP[id]):stageCleared.has(id);
 for(let i=0;i<order.length-1;i++){
  const a=POS[order[i]],b=POS[order[i+1]],ib=STAGE_ORDER.indexOf(order[i+1]);
  const pts=[a,...(VIA[order[i]+'>'+order[i+1]]||[]),b];
  const l=document.createElementNS(ns,'polyline');l.setAttribute('points',pts.map(p=>p.join(',')).join(' '));l.setAttribute('fill','none');l.setAttribute('stroke-linejoin','round');
  const done=clr(order[i]);
  l.setAttribute('stroke',done?'#d8301f':ib<=stageUnlocked?'#d8301fa0':'#00000040');l.setAttribute('stroke-width',done?'1.6':'1.1');if(!done)l.setAttribute('stroke-dasharray','2.2 2.2');
  sv.append(l);
 }
 holder.append(sv);
 STAGE_ORDER.forEach((id,index)=>{
  const p=POS[id];if(!p||HID.has(id))return;const data=CAMPAIGN[id],unlocked=DEVU||index<=stageUnlocked,finished=clr(id);
  const b=document.createElement('button');b.type='button';b.disabled=!unlocked;
  b.className='kmNode'+(CITY.has(id)?' city':'')+(finished?' done':unlocked?' avail':' locked')+(!cityView&&(index===campaignViewed||(GROUP[id]&&campaignViewed===STAGE_ORDER.indexOf(GROUP[id])))?' active':'');
  b.style.left=(100*p[0]/W)+'%';b.style.top=(100*p[1]/H)+'%';b.title=(GNAME[id]||data.name)+(finished?' · superado':unlocked?' · disponible':' · bloqueado');
  b.setAttribute('aria-label',data.name);
  b.onclick=()=>{campaignViewed=index;cityView=false;renderCampaign()};holder.append(b);
 });
 {/* v651: Ruta 22, al oeste de Ciudad Verde (duelo opcional con el rival, entrenamiento y pesca). cityView = vista de la Ruta 22 */
  const on=DEVU||stageCleared.has('viridian'),done=optionalCleared.has('route22'),R22=[32,84],VC=POS.viridian;
  const l=document.createElementNS(ns,'polyline');l.setAttribute('points',VC.join(',')+' '+R22.join(','));l.setAttribute('fill','none');l.setAttribute('stroke',done?'#d8301f':on?'#d8301fa0':'#00000040');l.setAttribute('stroke-width',done?'1.6':'1.1');if(!done)l.setAttribute('stroke-dasharray','2.2 2.2');sv.append(l);
  const s=document.createElement('button');s.type='button';s.className='kmNode '+(done?'done':on?'avail':'locked')+(cityView?' active':'');s.disabled=!on;s.style.left=(100*R22[0]/W)+'%';s.style.top=(100*R22[1]/H)+'%';s.title='Ruta 22'+(done?' · superado':on?' · disponible':' · bloqueada');s.setAttribute('aria-label','Ruta 22');s.onclick=()=>{cityView=true;renderCampaign()};holder.append(s)}
 for(const id in LABEL){const p=POS[id],l=document.createElement('div');l.className='kmLbl';l.textContent=LABEL[id][0];l.style.left=(100*p[0]/W)+'%';l.style.top=(100*(p[1]+LABEL[id][1])/H)+'%';holder.append(l)}
 const lv=document.createElement('div');lv.className='kmBanner';const cur=CAMPAIGN[STAGE_ORDER[campaignViewed]];lv.textContent='📍 '+(cityView?'Ruta 22':cur?(GNAME[STAGE_ORDER[campaignViewed]]||cur.name):'');holder.append(lv);
};
})();

requestAnimationFrame(draw);loadPokeAPI();
})();
/* v651: con una ventana abierta (mapa de Kanto, Equipo, Pokédex, Tienda, Mochila, avisos, Cómo jugar…) la página de atrás no se desplaza:
   se bloquea el scroll del documento y el scroll de las ventanas no "se escapa" al llegar a su borde. */
(()=>{
 const st=document.createElement('style');
 st.textContent='html.ptLock,html.ptLock body{overflow:hidden!important;overscroll-behavior:none!important}'+
  '#campaignOverlay,#campaignOverlay *,#managerOverlay,#managerOverlay *,#dexOverlay,#dexOverlay *,#shopOverlay,#shopOverlay *,#modal,#modal *,#gameBag,#gameBag *,#helpBox,[role=dialog],[role=dialog] *{overscroll-behavior:contain}';
 document.head.append(st);
 const IDS=['campaignOverlay','managerOverlay','dexOverlay','shopOverlay','modal','gameBag','revivePicker'];
 const shown=el=>!!el&&!el.hidden&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
 const anyOpen=()=>{for(const id of IDS)if(shown(document.getElementById(id)))return true;const hb=document.getElementById('helpBox');if(hb&&shown(hb.parentElement||hb))return true;
  for(const d of document.querySelectorAll('.fsMenu,[role=dialog]'))if(shown(d)&&getComputedStyle(d).position==='fixed')return true;return false};
 let q=false;const check=()=>{q=false;document.documentElement.classList.toggle('ptLock',anyOpen())};
 new MutationObserver(()=>{if(!q){q=true;requestAnimationFrame(check)}}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
 // la rueda del ratón sobre el fondo oscuro de una ventana no debe mover la página
 addEventListener('wheel',e=>{if(!document.documentElement.classList.contains('ptLock'))return;let t=e.target;while(t&&t!==document.body){const cs=getComputedStyle(t);if(/(auto|scroll)/.test(cs.overflowY)&&t.scrollHeight>t.clientHeight+1)return;t=t.parentElement}e.preventDefault()},{passive:false});
 check();
})();

/* Mapa de Kanto con zoom: botones ＋ － ⟲, rueda del ratón, pellizco y arrastre. Los puntos y rótulos mantienen su tamaño (solo se separan). */
;(()=>{
const KZ={s:1,x:0,y:0},MAXZ=3.5;
const st=document.createElement('style');st.textContent=`
.kmapHolder .kmZoom{position:absolute;inset:0;transform-origin:0 0;will-change:transform}
.kmapHolder.kmZoomed{touch-action:none;cursor:grab}
.kmZoom .kmNode{transform:translate(-50%,-50%) scale(calc(1/var(--z,1)))}
.kmZoom .kmNode.avail{animation-name:kmPulseZ}
@keyframes kmPulseZ{50%{transform:translate(-50%,-50%) scale(calc(1.25/var(--z,1)))}}
.kmZoom .kmLbl{transform:translate(-50%,0) scale(calc(1/var(--z,1)));transform-origin:50% 0}
.kmZoomCtl{position:absolute;right:8px;top:8px;z-index:6;display:flex;flex-direction:column;gap:5px}
.kmZoomCtl button{width:32px;height:32px;border-radius:8px;border:2px solid #1d2f46;background:#10212fdd;color:#ffe9a8;font:900 16px/1 system-ui,sans-serif;padding:0;cursor:pointer;display:grid;place-items:center}
.kmZoomCtl button:disabled{opacity:.4;cursor:default}
`;document.head.appendChild(st);
const orig=window.__kmap;if(typeof orig!=='function')return;
window.__kmap=function(holder){orig.apply(this,arguments);try{kmZoomify(holder)}catch(e){console.warn('zoom del mapa:',e)}};
function kmZoomify(h){
 if(h._kmOff)for(const [tg,ty,f,o] of h._kmOff)tg.removeEventListener(ty,f,o); // al volver al mapa se reconstruye: se quitan los oyentes anteriores (si no, cada visita sumaba otro y el zoom se multiplicaba)
 const offs=h._kmOff=[],on=(tg,ty,f,o)=>{tg.addEventListener(ty,f,o);offs.push([tg,ty,f,o])};
 const inner=document.createElement('div');inner.className='kmZoom';
 [...h.children].filter(c=>!c.classList.contains('kmBanner')).forEach(c=>inner.append(c));h.prepend(inner);
 const bPlus=document.createElement('button'),bMinus=document.createElement('button'),bReset=document.createElement('button'),ctl=document.createElement('div');
 ctl.className='kmZoomCtl';[[bPlus,'＋','Acercar el mapa'],[bMinus,'－','Alejar el mapa'],[bReset,'⟲','Restablecer el zoom']].forEach(([b,t,l])=>{b.type='button';b.textContent=t;b.title=l;b.setAttribute('aria-label',l);ctl.append(b)});h.append(ctl);
 const apply=(sm)=>{inner.style.transition=sm?'transform .2s ease-out':'none';const w=h.clientWidth,hh=h.clientHeight;KZ.s=Math.max(1,Math.min(MAXZ,KZ.s));KZ.x=Math.min(0,Math.max(w-w*KZ.s,KZ.x));KZ.y=Math.min(0,Math.max(hh-hh*KZ.s,KZ.y));
  inner.style.transform='translate('+KZ.x+'px,'+KZ.y+'px) scale('+KZ.s+')';inner.style.setProperty('--z',KZ.s);h.classList.toggle('kmZoomed',KZ.s>1.001);bPlus.disabled=KZ.s>=MAXZ-.001;bMinus.disabled=bReset.disabled=KZ.s<=1.001};
 const zoomAt=(f,cx,cy,sm)=>{const s0=KZ.s;KZ.s=Math.max(1,Math.min(MAXZ,s0*f));const k=KZ.s/s0;KZ.x=cx-(cx-KZ.x)*k;KZ.y=cy-(cy-KZ.y)*k;apply(sm)};
 const mid=()=>[h.clientWidth/2,h.clientHeight/2];
 // los botones acercan hacia el punto activo (tu etapa actual); si no hay, al centro
 const focus=()=>{const n=h.querySelector('.kmNode.active')||h.querySelector('.kmNode.avail');if(!n)return null;const w=h.clientWidth,hh=h.clientHeight;return [parseFloat(n.style.left)/100*w,parseFloat(n.style.top)/100*hh]};
 const step=f=>{const s0=KZ.s,fc=focus();if(!fc||isNaN(fc[0])){zoomAt(f,...mid(),true);return}
  KZ.s=Math.max(1,Math.min(MAXZ,s0*f));KZ.x=h.clientWidth/2-fc[0]*KZ.s;KZ.y=h.clientHeight/2-fc[1]*KZ.s;apply(true)};
 bPlus.onclick=()=>step(1.3);bMinus.onclick=()=>step(1/1.3);bReset.onclick=()=>{KZ.s=1;KZ.x=KZ.y=0;apply(true)};
 on(h,'wheel',e=>{e.preventDefault();const r=h.getBoundingClientRect();const dy=Math.max(-100,Math.min(100,e.deltaY*(e.deltaMode===1?33:1)));zoomAt(Math.exp(-dy*.0007),e.clientX-r.left,e.clientY-r.top,true)},{passive:false}); // proporcional al giro: la rueda avanza ~12 % por muesca y el panel táctil va fino
 let drag=null,dragged=false;
 on(h,'pointerdown',e=>{if(e.pointerType==='touch'||KZ.s<=1.001||e.target.closest('.kmZoomCtl'))return;drag={x:e.clientX,y:e.clientY,moved:0};dragged=false});
 on(window,'pointermove',e=>{if(!drag||!h.isConnected)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;drag.moved+=Math.abs(dx)+Math.abs(dy);if(drag.moved>6){dragged=true;KZ.x+=dx;KZ.y+=dy;apply()}});
 on(window,'pointerup',()=>{drag=null;setTimeout(()=>{dragged=false},0)});
 on(h,'click',e=>{if(dragged){e.stopPropagation();e.preventDefault()}},true);
 // táctil: pellizco con dos dedos y arrastre con uno cuando hay zoom
 let tp=null;
 const pts=t=>[...t].map(q=>[q.clientX,q.clientY]);
 on(h,'touchstart',e=>{const p=pts(e.touches);tp={n:p.length,p,moved:0};dragged=false},{passive:true});
 on(h,'touchmove',e=>{if(!tp)return;const p=pts(e.touches),r=h.getBoundingClientRect();
  if(p.length>=2&&tp.p.length>=2){e.preventDefault();const d0=Math.hypot(tp.p[0][0]-tp.p[1][0],tp.p[0][1]-tp.p[1][1]),d1=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);
   const c0=[(tp.p[0][0]+tp.p[1][0])/2,(tp.p[0][1]+tp.p[1][1])/2],c1=[(p[0][0]+p[1][0])/2,(p[0][1]+p[1][1])/2];
   KZ.x+=c1[0]-c0[0];KZ.y+=c1[1]-c0[1];if(d0>0)zoomAt(d1/d0,c1[0]-r.left,c1[1]-r.top);else apply();dragged=true}
  else if(p.length===1&&tp.p.length===1&&KZ.s>1.001){e.preventDefault();const dx=p[0][0]-tp.p[0][0],dy=p[0][1]-tp.p[0][1];tp.moved+=Math.abs(dx)+Math.abs(dy);if(tp.moved>6){dragged=true;KZ.x+=dx;KZ.y+=dy;apply()}}
  tp.p=p},{passive:false});
 on(h,'touchend',e=>{if(!e.touches.length){tp=null;setTimeout(()=>{dragged=false},60)}else tp={n:e.touches.length,p:pts(e.touches),moved:99}},{passive:true});
 apply();requestAnimationFrame(apply);
}
})();
