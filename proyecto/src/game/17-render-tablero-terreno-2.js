const EXTRA_STAGES=new Set(['route3','route3b','mtmoonj','mtmoon','mtmoonc','ceruleanrival','mtmoonb','route4','ceruleanguard','cerulean','nugget','nuggetrocket','nuggettrain','route25','route25b','route25train','route5','route6','vermilionrival','vermilionguard','vermilion']);
function gbaBuildExtra(id){
    const out=document.createElement('canvas');out.width=720;out.height=600;const o=out.getContext('2d');
    const nat=document.createElement('canvas');nat.width=192;nat.height=160;const b=nat.getContext('2d');b.imageSmoothingEnabled=false;
    const R=(x,y,w,h,c)=>{b.fillStyle=c;b.fillRect(x,y,w,h)};
    const hh=(x,y,k)=>{let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(k,2246822519))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;return (h^(h>>>16))>>>0};
    const cave=id==='mtmoon'||id==='mtmoonj'||id==='mtmoonb'||id==='mtmoonc',gym=id==='ceruleanguard'||id==='cerulean'||id==='vermilionguard'||id==='vermilion';
    const at=(x,y)=>frlgChar(id,x,y)||'W';
    const solidW=(x,y)=>{const c=at(x,y);return c==='W'};
    for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
        const c=at(tx,ty),ox=tx*16,oy=ty*16;
        const spk=(n,cols,sx=16,sy=16)=>{for(let i=0;i<n;i++){const h=hh(tx*16+i,ty*16,7);R(ox+h%sx,oy+(h>>8)%sy,1,1,cols[(h>>16)%cols.length])}};
        if(gym){
            if(c==='W'){R(ox,oy,16,16,'#3a5a9a');R(ox,oy+(ty===1?12:0),16,4,'#5a7cbc');for(let i=0;i<16;i+=4)R(ox+i,oy+4,1,12,'#2e4a84');if(ty===1){R(ox,oy+14,16,2,'#243a6c')}}
            else if(c==='~'){R(ox,oy,16,16,'#4aa0e8');spk(10,['#8cd0ff','#7cc0f4','#3a88d0']);for(let i=0;i<3;i++){const wy=(i*5+ (hh(tx,ty,9)%4))%16;R(ox+2+i*4,oy+wy,5,1,'#9ee0ff')}
                if(!(at(tx,ty-1)==='~'))R(ox,oy,16,2,'#2e78c0');if(!(at(tx,ty+1)==='~'))R(ox,oy+14,16,2,'#2e78c0');if(!(at(tx-1,ty)==='~'))R(ox,oy,2,16,'#2e78c0');if(!(at(tx+1,ty)==='~'))R(ox+14,oy,2,16,'#2e78c0')}
            else if(c==='p'){R(ox,oy,16,16,'#6aa0d8');R(ox,oy,16,1,'#8ec0f0');R(ox,oy+15,16,1,'#4a80b8');R(ox+7,oy,2,16,'#5a90c8')}
            else{const chk=(tx+ty)%2===0;R(ox,oy,16,16,chk?'#e4edf8':'#c9d9ec');R(ox,oy,16,1,'#f6faff');R(ox,oy,1,16,'#f6faff');spk(3,['#b8cce4','#d6e3f2'])}
        }else if(cave){
            if(c==='W'){R(ox,oy,16,16,'#5a4e44');spk(26,['#463c34','#6a5c50','#3a322c']);
                if(!solidW(tx,ty+1)){R(ox,oy+11,16,5,'#7a6c5e');R(ox,oy+15,16,1,'#3a322c')}
                if(!solidW(tx,ty-1))R(ox,oy,16,2,'#6a5c50')}
            else{R(ox,oy,16,16,(tx+ty)%2?'#a89c86':'#b0a48e');spk(14,['#948872','#bcb09a','#8a7e6a']);
                if(c==='k'){R(ox+2,oy+4,12,10,'#6c6052');R(ox+3,oy+3,10,2,'#6c6052');R(ox+4,oy+4,6,3,'#8a7e6c');R(ox+2,oy+13,12,2,'#3a322c');R(ox+11,oy+6,3,7,'#54483c')}}
        }else{
            // exterior: hierba azul verdosa, senda de arena, salientes y paredes rocosas
            const grass=()=>{R(ox,oy,16,16,'#70c8a0');spk(7,['#5cb890','#88d8b4','#58b48c']);const h=hh(tx,ty,3)%38;if(h===0){R(ox+5,oy+8,1,1,'#fff');R(ox+4,oy+9,1,1,'#e85060');R(ox+6,oy+9,1,1,'#e85060');R(ox+5,oy+10,1,1,'#e85060');R(ox+5,oy+9,1,1,'#ffd860')}};
            if(c==='p'){R(ox,oy,16,16,'#ecd9a0');spk(10,['#d8c284','#f4e8c0','#cdb676']);
                const np=(x,y)=>at(x,y)==='p'||at(x,y)==='T';
                if(!np(tx,ty-1))R(ox,oy,16,2,'#c8ad6c');if(!np(tx,ty+1))R(ox,oy+14,16,2,'#c8ad6c');if(!np(tx-1,ty))R(ox,oy,2,16,'#c8ad6c');if(!np(tx+1,ty))R(ox+14,oy,2,16,'#c8ad6c')}
            else if(c==='r'){grass();R(ox,oy+1,16,9,'#c89c60');spk(12,['#b4884c','#d8ae74']);R(ox,oy+10,16,5,'#9a6c3c');R(ox,oy+10,16,1,'#6a4824');R(ox,oy+15,16,1,'#5a3a1c');for(let i=0;i<16;i+=5)R(ox+i,oy+11,1,4,'#7e5530')}
            else if(c==='W'){R(ox,oy,16,16,'#b08c64');for(let i=0;i<5;i++)R(ox,oy+i*3+(hh(tx,ty,i)%2),16,1,i%2?'#98744c':'#c4a074');spk(14,['#8a6844','#cba884','#7e5c3a']);if(!solidW(tx,ty+1)){R(ox,oy+12,16,4,'#7a5836');R(ox,oy+15,16,1,'#4a341e')}if(!solidW(tx,ty-1))R(ox,oy,16,2,'#d4b488')}
            else grass();
        }
    }
    const big=document.createElement('canvas');big.width=768;big.height=640;const bg=big.getContext('2d');bg.imageSmoothingEnabled=false;
    bg.drawImage(nat,0,0,192,160,0,0,768,640);
    o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(big,0,0,768,640,0,0,720,600);
    o.imageSmoothingEnabled=false;
    if(!cave&&!gym){
        const tl=getTallSprite(),tr=getTreeSprite();
        for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)if(frlgChar(id,tx,ty)==='T')o.drawImage(tl,0,0,16,16,tx*S-1,ty*S,62,62);
        for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)if(frlgChar(id,tx,ty)==='t')o.drawImage(tr,0,0,32,48,tx*S+3,ty*S+S-78,54,81);
    }
    return out;
}
function gbaBuildBackground(){
    if(EXTRA_STAGES.has(stageId))return gbaBuildExtra(stageId);
    if(stageId==='gymguard'||stageId==='pewter'){
        const out=document.createElement('canvas');out.width=720;out.height=600;const o=out.getContext('2d');o.imageSmoothingEnabled=false;
        if(GYM_BG.complete&&GYM_BG.naturalWidth)o.drawImage(GYM_BG,0,0,192,160,0,0,720,600);else{o.fillStyle='#d4c48c';o.fillRect(0,0,720,600);out.pending=true}
        return out;
    }
    if(stageId==='route2'){
        const out=document.createElement('canvas');out.width=720;out.height=600;const o=out.getContext('2d');
        if(ROUTE2_BG.complete&&ROUTE2_BG.naturalWidth){
            const big=document.createElement('canvas');big.width=768;big.height=640;const bg=big.getContext('2d');bg.imageSmoothingEnabled=false;
            bg.drawImage(ROUTE2_BG,0,0,192,160,0,0,768,640);
            o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(big,0,0,768,640,0,0,720,600);
        }else{o.fillStyle='#6cc6a0';o.fillRect(0,0,720,600);out.pending=true}
        return out;
    }
    if(stageId==='route22'){
        const out=document.createElement('canvas');out.width=720;out.height=600;const o=out.getContext('2d');
        if(ROUTE22_BG.complete&&ROUTE22_BG.naturalWidth){
            // Recorte 288x240 de la Ruta 22: x5 sin suavizar y reducción suave a 720x600 (mantiene la definición)
            const big=document.createElement('canvas');big.width=1440;big.height=1200;const bg=big.getContext('2d');bg.imageSmoothingEnabled=false;
            bg.drawImage(ROUTE22_BG,0,0,288,240,0,0,1440,1200);
            o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(big,0,0,1440,1200,0,0,720,600);
        }else{o.fillStyle='#6cd6a8';o.fillRect(0,0,720,600);out.pending=true}
        return out;
    }
    if(stageId==='forest'||stageId==='forestdoug'||stageId==='forestmid'||stageId==='forestexit'){
        const out=document.createElement('canvas');out.width=720;out.height=600;const o=out.getContext('2d');
        if(FOREST_BG.complete&&FOREST_BG.naturalWidth){
            // Escalado en dos pasos (x4 sin suavizar y luego reducción suave) para que la hierba conserve definición
            const big=document.createElement('canvas');big.width=768;big.height=640;const bg=big.getContext('2d');bg.imageSmoothingEnabled=false;
            bg.drawImage(FOREST_BG,0,stageId!=='forestexit'?160:0,192,160,0,0,768,640);
            o.imageSmoothingEnabled=true;o.imageSmoothingQuality='high';o.drawImage(big,0,0,768,640,0,0,720,600);
            o.imageSmoothingEnabled=false;
            const tl=getTallSprite();
            for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)if(frlgChar(stageId,tx,ty)==='T')o.drawImage(tl,0,0,16,16,tx*S-1,ty*S,62,62);
            const tr=getTreeSprite();
            for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const c=frlgChar(stageId,tx,ty);if(c==='t'||c==='F')o.drawImage(tr,0,0,32,48,tx*S+3,ty*S+S-78,54,81)}
        }else{o.fillStyle='#5a9a7c';o.fillRect(0,0,720,600);out.pending=true}
        return out;
    }
    if(stageId==='pallet')return gbaBuildLab();
    const gym=stageId==='gymguard'||stageId==='pewter';
    const nat=document.createElement('canvas');nat.width=W*NT;nat.height=H*NT;
    const b=nat.getContext('2d');b.imageSmoothingEnabled=false;
    const P=(x,y,c)=>{b.fillStyle=c;b.fillRect(x,y,1,1)};
    const R=(x,y,w,h,c)=>{b.fillStyle=c;b.fillRect(x,y,w,h)};
    const kinds=Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>gbaTerrainKind(stageId,x,y)));
    const kindAt=(x,y,fallback)=>x>=0&&y>=0&&x<W&&y<H?kinds[y][x]:fallback;
    const FR=!!FRLG_VIS[stageId];
    const waterAt=(x,y)=>x>=0&&y>=0&&x<W&&y<H?terrain(x,y)==='~':true;

    // ---- Capa 1: suelo, pixel por pixel ----
    for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
        const kind=kinds[ty][tx],isWater=terrain(tx,ty)==='~',ox=tx*NT,oy=ty*NT;
        for(let j=0;j<NT;j++)for(let i=0;i<NT;i++){
            const X=ox+i,Y=oy+j,r=nh(X,Y,3)%100;
            let c;
            if(isWater){
                c='#4aa0d4';
                if(r<9)c='#5fb4e2';
                if(((X+(Y>>1)*3)%9===0)&&(Y%4===1))c='#a6dcf2';
                const eL=i===0&&!waterAt(tx-1,ty),eR=i===NT-1&&!waterAt(tx+1,ty),eT=j===0&&!waterAt(tx,ty-1),eB=j===NT-1&&!waterAt(tx,ty+1);
                if(eL||eR||eT||eB)c='#2f78b0';
                else if((i===1&&!waterAt(tx-1,ty))||(j===1&&!waterAt(tx,ty-1)))c='#3b8fc7';
            }else if(kind==='grass'){
                if(FR){
                    // v0.51 · césped de Rojo Fuego / Verde Hoja: verde azulado plano con matitas sueltas.
                    c='#73cea5';
                    const t1x=2+nh(tx,ty,61)%10,t1y=3+nh(tx,ty,62)%9,t2x=1+nh(tx,ty,63)%11,t2y=3+nh(tx,ty,64)%9;
                    for(const [qx,qy] of [[t1x,t1y],[t2x,t2y]]){
                        const dx=i-qx,dy=j-qy;
                        if(dy===0&&(dx===0||dx===2))c='#8cdebd';
                        else if(dy===1&&dx===1)c='#8cdebd';
                        else if(dy===1&&(dx===0||dx===2))c='#5bc096';
                    }
                    // halo claro junto a los caminos
                    const nP=(a,b)=>kindAt(a,b,'grass')==='path';
                    if((i===0&&nP(tx-1,ty))||(i===NT-1&&nP(tx+1,ty))||(j===0&&nP(tx,ty-1))||(j===NT-1&&nP(tx,ty+1)))c='#bde7a5';
                }else{
                // v0.51 · césped como en Rojo Fuego / Verde Hoja: verde vivo con matas en "v" que se repiten cada 8 px.
                c='#78c850';
                if(((X+Y)&1)===0&&r<22)c='#80d058';
                const bx=X&7,by=Y&7,alt=(((X>>3)+(Y>>3))&1);
                for(const [tx0,ty0] of (alt?[[5,1],[1,5]]:[[1,2],[5,6]])){
                    const dx=bx-tx0,dy=by-ty0;
                    if((dx===0||dx===2)&&dy===0)c='#4f9f38';
                    else if(dx===1&&dy===1)c='#4f9f38';
                    else if(dx===1&&dy===0)c='#a4e47c';
                }}
            }else if(kind==='tall'&&FR){
                c='#73cea5';
                const nT=(a,b)=>kindAt(a,b,'tall')==='tall';
                if(nh(tx,ty,65)%3===0&&j===12&&i===3)c='#8cdebd';
            }else if(kind==='tall'){
                c='#3f9a3c';
                const row=(Y+1)%4,col=(X+((Y>>2)&1)*2)%4;
                if(row===1&&col===0)c='#1f6a2c';
                else if(row===2&&(col===0||col===1))c='#1f6a2c';
                else if(row===0&&col===2)c='#9be07c';
                else if(row===3&&col===3)c='#5fba52';
                else if(row===0&&col===0)c='#2e8434';
                if(j===NT-1&&kindAt(tx,ty+1,'tall')!=='tall')c='#18522a';
                if(j===0&&kindAt(tx,ty-1,'tall')!=='tall'&&col%2===0)c='#b4ee94';
            }else if(kind==='path'){
                if(FR){
                    c='#efe78c';if(r<6)c='#dec68c';else if(r<11)c='#f7f2b0';
                }else{
                c='#e8d49a';
                if(r<10)c='#d8c183';else if(r<15)c='#f2e2b4';
                if(((X*3+Y*5)%13===0)&&r<60)c='#c9ae73';}
                // bordes con las casillas vecinas que no son camino (esquinas redondeadas)
                const L=kindAt(tx-1,ty,'path')!=='path',Rr=kindAt(tx+1,ty,'path')!=='path',T=kindAt(tx,ty-1,'path')!=='path',B=kindAt(tx,ty+1,'path')!=='path';
                const eL=L&&i<=1,eR=Rr&&i>=NT-2,eT=T&&j<=1,eB=B&&j>=NT-2;
                const corner=(L&&T&&i<=1&&j<=1)||(Rr&&T&&i>=NT-2&&j<=1)||(L&&B&&i<=1&&j>=NT-2)||(Rr&&B&&i>=NT-2&&j>=NT-2);
                if(corner&&((i===0||i===NT-1)&&(j===0||j===NT-1))){c=FR?'#bde7a5':'#78c850'}
                else if(eL||eR||eT||eB){
                    const outer=(L&&i===0)||(Rr&&i===NT-1)||(T&&j===0)||(B&&j===NT-1);
                    c=FR?(outer?'#d9c27e':'#e6d98a'):(outer?(nh(X,Y,5)%3?'#b89c62':'#a98e55'):'#d2ba80');
                }
            }else if(kind==='floor'){
                const alt=((tx+ty)&1);
                c=alt?'#cfc6ac':'#d8cfb6';
                if(r<10)c=alt?'#c3baa0':'#cbc2a8';
                if(i===0||j===0)c='#a79e86';
                else if(i===1||j===1)c=alt?'#ddd5bd':'#e6dec9';
            }else if(kind==='dais'){
                c='#b59a7c';if(r<14)c='#a88d70';
                const T=kindAt(tx,ty-1,'dais')!=='dais',B=kindAt(tx,ty+1,'dais')!=='dais',L=kindAt(tx-1,ty,'dais')!=='dais',Rr=kindAt(tx+1,ty,'dais')!=='dais';
                if(T&&j===0)c='#e0cba8';
                else if(T&&j===1)c='#c9b190';
                if(L&&i===0)c='#d6bf9d';
                if(B&&j>=NT-3)c=j===NT-1?'#4f3f33':'#6f5a48';
                if(Rr&&i>=NT-2)c='#6f5a48';
            }else if(kind==='carpet'){
                c='#b83c3f';if(r<12)c='#a33337';
                if(i===0||i===NT-1)c='#e2b84f';
                else if(i===1||i===NT-2)c='#8e2a31';
                if((j+tx*3)%6===2&&i>2&&i<NT-3)c='#cf5252';
            }else if(kind==='cave'){
                c='#8d8577';if(r<18)c='#7c7467';else if(r<25)c='#9c9486';
                if(((X*7+Y*5)%23===0))c='#625b50';
            }else if(kind==='wall'){
                const course=Math.floor(j/5),off=course%2?4:0;
                c='#8d939e';
                if(r<10)c='#7f8590';
                if(j%5===4)c='#575c67';
                else if((i+off)%8===7)c='#575c67';
                else if(j%5===0)c='#a9aeb8';
                if(j===NT-1)c='#3e424b';
            }
            b.fillStyle=c;b.fillRect(X,Y,1,1);
        }
    }
    // Sombra proyectada por el muro del gimnasio.
    if(gym){
        for(let x=0;x<W*NT;x++){
            R(x,NT,1,3,'#00000026');R(x,NT+3,1,2,'#00000012');
        }
        // Estandartes colgando del muro.
        for(const bx of [2,5,9]){
            const X=bx*NT+4;
            R(X-1,0,9,1,'#3a2f28');
            R(X,1,7,11,'#c9473f');R(X,1,7,1,'#e56f62');R(X+3,2,1,8,'#f3c95b');
            R(X,12,3,2,'#c9473f');R(X+4,12,3,2,'#c9473f');
            R(X,1,1,11,'#9a3330');
        }
        // Dibujo de arena: círculo discreto en el centro del tablero.
        b.strokeStyle='#b4a98d';b.lineWidth=1;b.beginPath();b.arc(W*NT/2,(H*NT)/2+6,26,0,Math.PI*2);b.stroke();
    }

    // ---- Capa 2: decoración que no bloquea (las flores se animan en gbaDrawBackground) ----
    const flowers=[];
    if(!gym){
        for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
            const t=terrain(tx,ty);
            if(FR||t!=='.'||kinds[ty][tx]!=='grass')continue;
            const r=nh(tx,ty,21)%11;
            if(r<2){
                const fx=tx*NT+3+nh(tx,ty,22)%9,fy=ty*NT+3+nh(tx,ty,23)%9;
                const col=['#fbf6e0','#ffd84a','#f58fb4'][nh(tx,ty,24)%3];
                flowers.push({x:fx,y:fy,col});
            }
        }
    }

    // ---- Capa 3: objetos (de arriba hacia abajo para solapar bien) ----
    const shadow=(cx,cy,rx,ry)=>{b.fillStyle='#00000030';b.beginPath();b.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);b.fill()};
    function drawTree(ox,oy){
        shadow(ox+7.5,oy+13.5,6.5,2);
        const pine=(stageId==='forest'||stageId==='forestdoug'||stageId==='forestmid'||stageId==='forestexit'||stageId==='route22'||stageId==='route2'||stageId==='route2in')&&nh(Math.floor(ox/NT),Math.floor(oy/NT),44)%2===0;
        if(pine){
            // pino: tres pisos de copa
            R(ox+6,oy+11,3,3,'#5a3a26');R(ox+6,oy+11,1,3,'#7a5434');
            const tiers=[[1,5,13],[3,8,12],[5,11,11]];
            let k=0;
            for(const [top,hw,base] of [[0,3,5],[3,5,9],[6,7,12]]){
                for(let j=top;j<base;j++){
                    const w=Math.round(hw*(j-top+1)/(base-top)),cx=7;
                    for(let i=cx-w;i<=cx+w;i++){
                        if(i<0||i>=NT)continue;
                        let c='#2f8f3c';
                        if(i<cx-w*.3)c='#58b84a';else if(i>cx+w*.4)c='#1f6f30';
                        if(i===cx-w||i===cx+w||j===base-1)c='#17502a';
                        if(nh(ox+i,oy+j,33)%9===0)c=i<cx?'#8bd66c':'#1b6430';
                        P(ox+i,oy+j,c);
                    }
                }
                k++;
            }
            return;
        }
        R(ox+6,oy+10,3,4,'#6a4630');R(ox+6,oy+10,1,4,'#8a603f');R(ox+5,oy+13,5,1,'#4c3222');
        const cx=7,cy=5.5;
        for(let j=-2;j<12;j++)for(let i=0;i<NT;i++){
            const dx=(i-cx)/7.2,dy=(j-cy)/6.4,d=dx*dx+dy*dy;
            if(d>1)continue;
            let c='#38a03c';
            const lit=(i-cx)*-0.6+(j-cy)*-0.8;
            if(lit>2.2)c='#74d466';else if(lit>0.2)c='#4cb84c';
            else if(lit<-3.2)c='#26822f';
            if(nh(ox+i,oy+j,31)%6===0)c=lit>0?'#98e47c':'#1f6e2c';
            if(d>0.78)c='#17502a';
            P(ox+i,oy+j,c);
        }
    }
    function drawRock(ox,oy,onFloor){
        shadow(ox+7.5,oy+12.5,6.5,2);
        for(let j=2;j<14;j++)for(let i=1;i<14;i++){
            const dx=(i-7.5)/6.4,dy=(j-8)/5.8,d=dx*dx+dy*dy;
            if(d>1)continue;
            let c='#9aa0a8';
            const lit=(i-7.5)*-0.5+(j-8)*-0.8;
            if(lit>2.4)c='#cdd2d8';else if(lit>0.8)c='#b2b8bf';else if(lit<-2.6)c='#6d747e';
            if((i*3+j*5)%11===0&&d<.6)c='#838a93';
            if(d>0.74)c='#3f4651';
            P(ox+i,oy+j,c);
        }
    }
    function drawHouse(ox,oy,seed){
        const roofs=[['#d9544d','#b53e3a','#f08073'],['#4f8fc7','#3a6fa2','#82b7e0'],['#5ba66a','#3f8450','#8bcf99']];
        const [r1,r2,r3]=roofs[nh(Math.floor(ox/NT),Math.floor(oy/NT),seed)%3];
        shadow(ox+8,oy+14,7,2);
        // pared
        R(ox+1,oy+6,13,8,'#f4ebd3');R(ox+1,oy+6,13,1,'#cfc4a6');R(ox+1,oy+13,13,1,'#a89d82');R(ox+13,oy+6,1,8,'#d9cfb4');
        // ventana y puerta
        R(ox+3,oy+8,4,4,'#4a5a72');R(ox+4,oy+9,2,2,'#8cc5ea');R(ox+5,oy+8,1,4,'#4a5a72');
        R(ox+9,oy+8,3,6,'#6a4630');R(ox+9,oy+8,3,1,'#8a603f');P(ox+11,oy+11,'#f3d36b');
        // tejado
        for(let j=0;j<6;j++){
            const inset=j<2?2-j:0;
            R(ox+inset,oy+j,NT-inset*2,1,j%2?r2:r1);
        }
        R(ox+1,oy,13,1,r3);R(ox,oy+5,NT,1,'#6d3b33');
        for(let k=0;k<NT;k+=3)P(ox+k,oy+3,r2);
    }
    // ---- v0.51: elementos del paisaje de Rojo Fuego / Verde Hoja ----
    function frCone(ox,oy){
        // abeto cónico de dos tonos con raíz oscura (como los árboles que enmarcan las rutas)
        for(let j=0;j<NT;j++){
            let hw;
            if(j<12){hw=Math.floor(j*0.52)+((j%4===3)?1:0);hw=Math.min(hw,6)}else hw=-1;
            for(let i=7-hw;hw>=0&&i<=7+hw;i++){
                const rel=(i-7)/Math.max(1,hw);
                let c=rel<-.35?((i+j)&1?'#bdff8c':'#a8f07c'):rel<.25?'#84d663':'#399431';
                if(j%4===3&&hw>0)c=rel>.25?'#2d7a28':'#6cc050';
                if(i===7-hw||i===7+hw)c='#395a10';
                if(j===0)c='#395a10';
                P(ox+i,oy+j,c);
            }
        }
        // base: mancha de sombra verde oscuro y tronco
        for(let j=11;j<NT;j++)for(let i=0;i<NT;i++){
            const dx=(i-7)/7,dy=(j-13)/2.1;if(dx*dx+dy*dy<=1)P(ox+i,oy+j,(j===NT-1||Math.abs(dx)>.8)?'#18a56b':'#395a10');
        }
        R(ox+6,oy+12,3,2,'#7b4a4a');P(ox+7,oy+12,'#946b6b');
    }
    function frClump(ox,oy){
        const g=Array.from({length:NT},()=>Array(NT).fill(0));
        const leaves=[[-78,5],[-50,7],[-20,8],[20,8],[50,7],[78,5],[-5,6]];
        for(const [deg,len] of leaves){
            const a=deg*Math.PI/180;
            for(let t=0;t<=len;t+=.4){
                const x=Math.round(7+Math.sin(a)*t),y=Math.round(11-Math.cos(a)*t*1.05-t*t*0.045*Math.abs(Math.sin(a)));
                for(const [ddx,ddy] of [[0,0],[1,0],[0,1]]){const xx=x+ddx,yy=y+ddy;if(xx>=0&&xx<NT&&yy>=0&&yy<NT)g[yy][xx]=3}
                if(x>=0&&x<NT&&y>=0&&y<NT&&t>1)g[y][x]=4;
            }
        }
        const og=g.map(r=>r.slice());
        for(let y=0;y<NT;y++)for(let x=0;x<NT;x++)if(og[y][x]===0){
            for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<NT&&yy>=0&&yy<NT&&og[yy][xx]>=3){g[y][x]=1;break}}
        }
        for(let y=0;y<NT;y++)for(let x=0;x<NT;x++){
            const v=g[y][x];if(!v)continue;
            let c=v===1?'#395a10':v===4?'#84d663':'#399431';
            if(v===3&&y>=11)c='#18a56b';
            P(ox+x,oy+y,c);
        }
    }
    function frLedge(tx,ty,ox,oy){
        const L=frlgChar(stageId,tx-1,ty)==='l',Rr=frlgChar(stageId,tx+1,ty)==='l';
        for(let i=0;i<NT;i++){
            if(!L&&i<2)continue;if(!Rr&&i>NT-3)continue;
            const edge=(!L&&i<4)||(!Rr&&i>NT-5);
            const top=edge?7:6,bot=edge?11:12;
            for(let j=top;j<=bot;j++){
                let c='#7b4a4a';
                if(j===top)c='#946b6b';else if(j>=bot-1)c='#5a3942';
                else if(nh(ox+i,oy+j,71)%4===0)c='#946b6b';else if(nh(ox+i,oy+j,72)%5===0)c='#5a3942';
                P(ox+i,oy+j,c);
            }
            P(ox+i,oy+bot+1,'#5bc096');
        }
    }
    function frFlowers(ox,oy){
        for(const [fx,fy] of [[3,3],[8,7]]){
            R(ox+fx-1,oy+fy+3,6,1,'#18a56b');R(ox+fx,oy+fy+2,4,1,'#18a56b');
            for(const [dx,dy,col] of [[0,0,'#c63142'],[1,0,'#ef846b'],[2,0,'#c63142'],[0,1,'#c63142'],[1,1,'#ffc673'],[2,1,'#c63142'],[1,-1,'#c63142'],[3,1,'#ef846b']])P(ox+fx+dx,oy+fy+dy,col);
        }
    }
    function frSign(ox,oy){
        R(ox+6,oy+9,3,4,'#7b4a4a');R(ox+2,oy+3,11,7,'#5a5a73');R(ox+3,oy+4,9,5,'#94a5b5');
        R(ox+4,oy+5,7,1,'#c63142');R(ox+4,oy+7,5,1,'#c63142');R(ox+2,oy+3,11,1,'#adbdce');
    }
    function frFence(ox,oy){
        R(ox,oy+7,NT,2,'#7b7b84');R(ox,oy+7,NT,1,'#94a5b5');
        for(const x of [1,7,13]){R(ox+x-1,oy+4,3,9,'#5a5a73');R(ox+x,oy+4,1,9,'#94a5b5');R(ox+x-1,oy+4,3,1,'#adbdce')}
    }
    for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
        const t=terrain(tx,ty),ox=tx*NT,oy=ty*NT;
        if(FR){
            const ch=frlgChar(stageId,tx,ty);
            if(ch==='o')frFlowers(ox,oy);
            else if(ch==='t'||ch==='F')continue;
            else if(ch==='l')frLedge(tx,ty,ox,oy);
            else if(ch==='s')frSign(ox,oy);
            else if(ch==='f')frFence(ox,oy);
            else if(ch==='h')drawHouse(ox,oy,7);
            else if(ch==='r')drawRock(ox,oy,false);
            continue;
        }
        if(t==='F')drawTree(ox,oy);
        else if(t==='X'){
            if(!gym&&(stageId==='pallet'||stageId==='viridian'))drawHouse(ox,oy,7);
            else drawRock(ox,oy,gym);
        }
    }
    // ---- Escalado nítido a la resolución del tablero + rejilla táctica ----
    const out=document.createElement('canvas');out.width=720;out.height=600;
    const o=out.getContext('2d');o.imageSmoothingEnabled=false;
    o.drawImage(nat,0,0,W*NT,H*NT,0,0,720,600);
    // Hierba alta: sprite original 16x16 ampliado x4 (un píxel nativo = 4 px), apoyado en su casilla de 60 px.
    if(FR){
      const sp=getTallSprite();
      for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++)if(frlgChar(stageId,tx,ty)==='T')o.drawImage(sp,0,0,16,16,tx*S+4,ty*S+5,52,52);
      // Árboles: un abeto por casilla (sprite 32x48 a 54x81 px), apoyado en la base de su casilla; las filas se solapan como en el bosque original.
      const tr=getTreeSprite();
      for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const c=frlgChar(stageId,tx,ty);if(c==='t'||c==='F')o.drawImage(tr,0,0,32,48,tx*S+3,ty*S+S-78,54,81)}
    }
    // v0.51: sin cuadrícula visible sobre el escenario; las casillas se marcan solo al mover o apuntar.
        out.flowers=flowers;
    return out;
}
function gbaDrawBackground(){
   const id=stageId+'|'+map.join('/');
   let bg=gbaStageBuffers.get(id);
   if(!bg){bg=gbaBuildBackground();if(!bg.pending){gbaStageBuffers.set(id,bg);if(gbaStageBuffers.size>15)gbaStageBuffers.clear()}}
   ctx.drawImage(bg,0,0);
   if(bg.flowers&&bg.flowers.length){
      const f=Math.floor(performance.now()/520)%2,k=720/(W*NT);
      for(const fl of bg.flowers){
         const x=fl.x*k,y=fl.y*k,u=k;
         ctx.fillStyle='#4f9f38';ctx.fillRect(x,y+2*u,u,u);
         ctx.fillStyle=fl.col;
         if(f===0){ctx.fillRect(x,y-u,u,u);ctx.fillRect(x-u,y,u,u);ctx.fillRect(x+u,y,u,u);ctx.fillRect(x,y+u,u,u)}
         else{ctx.fillRect(x-u,y-u,u,u);ctx.fillRect(x+u,y-u,u,u);ctx.fillRect(x-u,y+u,u,u);ctx.fillRect(x+u,y+u,u,u)}
         ctx.fillStyle='#f2a020';ctx.fillRect(x,y,u,u);
      }
   }
   return true;
}
const gbaStageBuffers=new Map();
/* v0.51 · Casillas resaltadas: relleno translúcido más suave + esquinas en "L" estilo táctico (sin manchas grises sobre el camino). */
function drawTileMark(x,y,fill,edge,inset,time,strong){
    const px=x*S+inset,py=y*S+inset,w=S-inset*2,pulse=.5+.5*Math.sin((time||0)/300+(x+y)*.6);
    ctx.save();
    ctx.globalAlpha=strong?1:.9;ctx.fillStyle=fill;ctx.fillRect(px,py,w,w);
    ctx.globalAlpha=strong?1:.55+.25*pulse;
    ctx.fillStyle=edge;ctx.fillRect(px,py,w,2);ctx.fillRect(px,py+w-2,w,2);ctx.fillRect(px,py,2,w);ctx.fillRect(px+w-2,py,2,w);
    ctx.globalAlpha=1;ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(px+2,py+2,w-4,2);
    if(strong){const L=12,T=4;ctx.fillStyle='#fff0a8';for(const [cx,cy,dx,dy] of [[px,py,1,1],[px+w,py,-1,1],[px,py+w,1,-1],[px+w,py+w,-1,-1]]){ctx.fillRect(dx>0?cx:cx-L,dy>0?cy:cy-T,L,T);ctx.fillRect(dx>0?cx:cx-T,dy>0?cy:cy-L,T,L)}}
    ctx.restore();
}
function drawTile(x,y,t,time){let px=x*S,py=y*S,n=(x*37+y*17)%5;ctx.fillStyle=(stageId==='mtmoon'||stageId==='mtmoonj')?(n%2?'#8b8479':'#a19a87'):stageId==='pewter'?(n%2?'#97aa90':'#abb6a0'):n%2?'#79a978':'#86b47d';ctx.fillRect(px,py,S,S);ctx.fillStyle='#9ac18a';for(let a=0;a<3;a++)ctx.fillRect(px+(x*13+y*17+a*19)%49+5,py+(x*9+y*7+a*23)%45+9,4,3);if(t==='F'){ctx.fillStyle='#547d5a';ctx.fillRect(px+8,py+24,44,24);ctx.fillStyle='#406d51';for(const [ox,oy,r] of [[14,22,15],[34,19,19],[44,33,15]]){ctx.beginPath();ctx.arc(px+ox,py+oy,r,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#7eb379';ctx.fillRect(px+21,py+11,10,6);ctx.fillRect(px+39,py+22,9,5)}if(t==='~'){ctx.fillStyle='#4f9bb0';ctx.fillRect(px,py,S,S);ctx.fillStyle='#80c6cf';for(let i=0;i<3;i++)ctx.fillRect(px+6+((i*19+time/90)%41),py+12+i*16,14,3)}if(t==='X'){ctx.fillStyle='#7f8990';ctx.fillRect(px+8,py+20,45,30);ctx.fillStyle='#b4b3a7';ctx.fillRect(px+16,py+10,30,28);ctx.fillStyle='#e3d9bd';ctx.fillRect(px+22,py+12,10,5);ctx.fillStyle='#525e6b';ctx.fillRect(px+8,py+48,40,6)}ctx.strokeStyle='#35634731';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,S-1,S-1)}
const miniBoundsCache=new WeakMap();
function miniContentBounds(img,fw,fh){
    let c=miniBoundsCache.get(img);if(c)return c;
    c={x:0,y:0,w:fw,h:fh};
    try{const cv=document.createElement('canvas');cv.width=fw;cv.height=fh;const g=cv.getContext('2d');g.drawImage(img,0,0,fw,fh,0,0,fw,fh);
        const d=g.getImageData(0,0,fw,fh).data;let x0=fw,y0=fh,x1=-1,y1=-1;
        for(let y=0;y<fh;y++)for(let x=0;x<fw;x++)if(d[(y*fw+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
        if(x1>=0)c={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};
    }catch(e){}
    miniBoundsCache.set(img,c);return c;
}
function drawWalkingMini(context,sprite,ix,iy,w,h,mirror,active,time,idle,frameMs){
    const img=sprite.img,sw=img.naturalWidth||32,sh=img.naturalHeight||32;
    const f=active?Math.floor(time/(frameMs||165))%2:(idle!==undefined?Math.floor((time+idle)/520)%2:0);
    let sx=0,sy=0,fw=sw,fh=sh;
    // Algunos iconos GBA se guardan en tiras de 2 cuadros.
    if(sw>=sh*1.7&&sw>=48){fw=Math.floor(sw/2);sx=f*fw;}
    else if(sh>=sw*1.7&&sh>=48){fh=Math.floor(sh/2);sy=f*fh;}
    context.save();context.imageSmoothingEnabled=false;
    if(mirror){context.translate(ix+w,0);context.scale(-1,1);ix=0;}
    if(active&&fw===sw&&fh===sh){
        // Fallback estático: alternar torso/patas sin desplazar el sprite del suelo.
        const upper=Math.floor(fh*.66),split=Math.round(h*.66);
        const shift=f===0?-2:2;
        context.drawImage(img,sx,sy,fw,upper,ix+shift,iy,w,split);
        context.drawImage(img,sx,sy+upper,fw,fh-upper,ix-shift,iy+split,w,h-split);
    }else if(!active&&idle!==undefined&&fw===sw&&fh===sh){
        // sprite de un solo cuadro: respira estirándose desde los pies
        const k=Math.sin((time+idle)/260),hh=Math.round(h*(1+.04*k)),ww=Math.round(w*(1-.025*k));
        context.drawImage(img,sx,sy,fw,fh,ix+Math.round((w-ww)/2),iy+h-hh,ww,hh);
    }else context.drawImage(img,sx,sy,fw,fh,ix,iy,w,h);
    context.restore();
}
function drawUnit(u,time){
    let p=u.x*S,q=u.y*S,b=base[u.id],selectedNow=selected===u,hop=0,faceDX=0,faceDY=0,dust=null;
    const walking=!!(motion&&motion.u===u);
    if(walking){
        const span=motion.duration;
        let v=Math.max(0,(time-motion.start)/span);
        let idx=Math.min(motion.path.length-2,Math.floor(v));
        let pct=Math.max(0,Math.min(1,v-idx));
        const from=motion.path[idx],to=motion.path[idx+1];
        // v0.72 · carrera a velocidad constante (sin frenar en cada casilla), con rebote por zancada y polvo
        p=(from.x+(to.x-from.x)*pct)*S;
        q=(from.y+(to.y-from.y)*pct)*S;
        hop=Math.abs(Math.sin(pct*Math.PI))*7;faceDX=to.x-from.x;faceDY=to.y-from.y;
        if(pct<.45){dust={x:p+30-(to.x-from.x)*14,y:q+54-(to.y-from.y)*14,k:pct/.45}}
    }
    ctx.fillStyle=u.side==='player'?'#416fa6':'#b45563';ctx.beginPath();ctx.ellipse(p+30,q+50,27,10,0,0,Math.PI*2);ctx.fill();
    if(dust){ctx.save();ctx.globalAlpha=(1-dust.k)*.55;ctx.fillStyle='#f4ead0';for(const [ox,oy,r] of [[0,0,5],[-7,-3,3.5],[6,-4,3]]){ctx.beginPath();ctx.arc(dust.x+ox*(1+dust.k),dust.y+oy-dust.k*6,r*(1+dust.k*.9),0,Math.PI*2);ctx.fill()}ctx.restore()}
    // v0.71 · selección: esquinas que laten + salto de "elegido" + flecha que rebota sobre la cabeza
    let selPop=0;
    if(selectedNow){
        if(window._selU!==u){window._selU=u;window._selAt=time}
        const age=time-window._selAt,pulse=.5+.5*Math.sin(time/170),inset=3+Math.round(pulse*2);
        if(age<300){const k=age/300;selPop=Math.sin(k*Math.PI)*(1-k*.35)}
        ctx.strokeStyle='#ffe49b';ctx.lineWidth=4;const L=14;
        for(const [cx,cy,dx,dy] of [[p+inset,q+inset,1,1],[p+S-inset,q+inset,-1,1],[p+inset,q+S-inset,1,-1],[p+S-inset,q+S-inset,-1,-1]]){ctx.beginPath();ctx.moveTo(cx+dx*L,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+dy*L);ctx.stroke()}
        ctx.fillStyle='#ffe49b';const ay=q-2+Math.round(Math.sin(time/150)*3);
        ctx.beginPath();ctx.moveTo(p+30,ay+10);ctx.lineTo(p+22,ay);ctx.lineTo(p+38,ay);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#6a4a20';ctx.lineWidth=2;ctx.stroke();
    }else if(window._selU===u)window._selU=null;
    ctx.fillStyle='#18343b7c';ctx.beginPath();ctx.ellipse(p+30,q+52,21,5,0,0,Math.PI*2);ctx.fill();
    let dimSprite=null;const pmdR=pmdOk(pkId(u));const s=getMiniSprite(u.id);if(pmdR){
        const wr=walking?pmdGet(pkId(u),'Walk'):null,pr=(selectedNow&&!walking&&!u.acted&&u.hp>0)?pmdGet(pkId(u),'Pose'):null,R=wr&&wr.ready?wr:(pr&&pr.ready?pr:pmdR),m=R.m,ib=pmdR.m.bb,sc=Math.min(60/(ib[3]-ib[1]),64/(ib[2]-ib[0]),5),
        faceR=(walking&&faceDX!==0)?faceDX>0:(u._fr===undefined?u.side==='player':u._fr);
        if(walking){if(faceDX!==0){u._fr=faceDX>0;u._fv=0}else if(faceDY!==0)u._fv=faceDY>0?1:2}
        const row=u._fv===1?0:u._fv===2?4:2;
        const isPose=!!(pr&&pr.ready&&R===pr),ms=walking?time:isPose?time-window._selAt:(u.acted||u.hp<=0)?0:time+(u.x*131+u.y*71+u.id*37);
        ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(p+30,q+55-Math.round(hop)-(selPop>0?Math.round(selPop*8):0));ctx.scale((faceR||row!==2)?1:-1,1);
        if(u.acted||u.hp<=0)ctx.filter='brightness(.55) saturate(.5)';
        pmdDraw(ctx,R,pmdFrame(R,isPose?ms*.55:ms,true),sc,0,row);
        ctx.restore();
    }else if(s&&s.ready){
        const iw=s.img.naturalWidth||32,ih=s.img.naturalHeight||32;
        const framesH=(iw>=ih*1.7&&iw>=48)?iw/2:iw;
        const framesV=(ih>=iw*1.7&&ih>=48)?ih/2:ih;
        const bb=miniContentBounds(s.img,framesH,framesV);
        // v0.51: el icono GBA tiene mucho margen transparente; se escala según su contenido real.
        const scale=Math.min(52/bb.w,54/bb.h,3.2);
        const width=Math.round(framesH*scale),height=Math.round(framesV*scale);
        const mirror=(walking&&faceDX!==0)?faceDX>0:u.side==='player';
        const cxo=(bb.x+bb.w/2)*scale,cx=mirror?width-cxo:cxo;
        const ix=Math.round(p+30-cx),iy=Math.round(q+55-(bb.y+bb.h)*scale);
        ctx.save();if(selPop>0){ctx.translate(p+30,q+55);ctx.scale(1-.08*selPop,1+.2*selPop);ctx.translate(-(p+30),-(q+55))}
        if(walking){const lean=faceDX>0?.07:faceDX<0?-.07:0;ctx.translate(p+30,q+55);ctx.rotate(lean*Math.min(1,hop/5));ctx.scale(1+.05*(1-hop/7),1-.06*(1-hop/7));ctx.translate(-(p+30),-(q+55))}
        drawWalkingMini(ctx,s,ix,iy-(selPop>0?Math.round(selPop*8):0)-Math.round(hop),width,height,mirror,walking,time,(u.acted||u.hp<=0)?undefined:(u.x*131+u.y*71+u.id*37)%1040,walking?motion.duration:undefined);
        ctx.restore();
        dimSprite={s,ix,iy,width,height,mirror};
    }else{roundrect(p+10,q+5,40,40,7,typeColors[b.types[0]]||'#9db0ac');ctx.font='29px sans-serif';ctx.textAlign='center';ctx.fillText(b.emoji,p+30,q+37);ctx.textAlign='left'}
    if(u.trapped&&u.hp>0){ // cuerdas de Constricción/Atadura enrolladas al cuerpo (tablero 2D)
        const pul=Math.sin(time/260)*.8;ctx.save();ctx.lineCap='round';
        for(let i=0;i<3;i++){const y=q+48-i*10,rx=15+pul,ry=4.6;for(const [col,w] of [['#2a1608',4.4],['#b9803f',2.8],['#e8c27a',1.2]]){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(p+30,y,rx,ry,0,i%2?Math.PI:0,i%2?Math.PI*2:Math.PI);ctx.stroke()}}
        ctx.restore()}
    if(u.hp>0){const tags=[];if(u.poisoned)tags.push(['VEN','#8a5cc2']);if(u.trapped)tags.push(['ATA','#b07a3c']);if(u.critUp)tags.push(['CRI','#d28a2a']);if(u.paralyzed)tags.push(['PAR','#c9a227']);if(u.burned)tags.push(['QUE','#d2562f']);if(u.asleep>0)tags.push(['DOR','#5a7ea8']);if(u.seeded)tags.push(['DRE','#4f9a52']);
     ctx.save();ctx.font='bold 9px monospace';ctx.textAlign='center';tags.forEach((tg,i)=>{const tx=p+2+i*29,ty=q+S-14;ctx.fillStyle='#0b1822';ctx.fillRect(tx-1,ty-1,28,13);ctx.fillStyle=tg[1];ctx.fillRect(tx,ty,26,11);ctx.fillStyle='#fff';ctx.fillText(tg[0],tx+13,ty+9)});ctx.restore()}
    if(u.slowed&&u.hp>0){ctx.fillStyle='#273c56';ctx.fillRect(p+1,q-10,54,15);ctx.fillStyle='#ffe5aa';ctx.font='bold 11px monospace';ctx.fillText('−3 PM',p+10,q+1)}if(u.acted||u.hp<=0){if(dimSprite){const d=dimSprite;if(!window._dimCv)window._dimCv=document.createElement('canvas');const dc=window._dimCv;dc.width=d.width;dc.height=d.height;const dg=dc.getContext('2d');dg.imageSmoothingEnabled=false;dg.clearRect(0,0,d.width,d.height);drawWalkingMini(dg,d.s,0,0,d.width,d.height,d.mirror,false,time);dg.globalCompositeOperation='source-atop';dg.fillStyle='#10212b8c';dg.fillRect(0,0,d.width,d.height);ctx.drawImage(dc,d.ix,d.iy)}else{ctx.fillStyle='#10212b80';ctx.fillRect(p+2,q+2,56,55)}}if(u.paralyzed){ctx.font='16px sans-serif';ctx.fillText('⚡',p+40,q+18)}if(u.hp<=0){ctx.font='bold 22px sans-serif';ctx.fillStyle='#f8d3be';ctx.fillText('✕',p+25,q+30)}
}
function drawRoute(path,time){
    if(!path||path.length<2)return;
    const points=path.map(p=>({x:p.x*S+30,y:p.y*S+30}));
    ctx.save();ctx.lineCap='square';ctx.lineJoin='miter';
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
    ctx.strokeStyle='#223a42';ctx.lineWidth=21;ctx.stroke();
    ctx.strokeStyle='#f6cf7f';ctx.lineWidth=14;ctx.stroke();
    ctx.strokeStyle='#ffeab3';ctx.lineWidth=5;ctx.stroke();
    const last=points[points.length-1],prev=points[points.length-2];
    const dx=Math.sign(last.x-prev.x),dy=Math.sign(last.y-prev.y);
    const pulse=.5+.5*Math.sin(time/190);
    ctx.fillStyle='#172f3d';ctx.fillRect(last.x-26,last.y-26,52,52);
    ctx.strokeStyle='#fff1b9';ctx.lineWidth=3;ctx.strokeRect(last.x-26,last.y-26,52,52);
    // Destination arrow points in the direction of the final step.
    ctx.save();ctx.translate(last.x,last.y);ctx.rotate(Math.atan2(dy,dx));
    ctx.fillStyle='#223741';ctx.beginPath();ctx.moveTo(23,0);ctx.lineTo(-7,-20);ctx.lineTo(-7,20);ctx.closePath();ctx.fill();
    ctx.fillStyle=pulse>.5?'#ffe5a3':'#f8ce72';ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-6,-14);ctx.lineTo(-6,14);ctx.closePath();ctx.fill();ctx.restore();ctx.restore();
}
function drawCursor(time){
    // El ratón usa su flecha nativa, libre a nivel de píxel.
    // La flecha dibujada queda solo para el modo de control por teclado.
    if(!usingKeyboard)return;
    let tile=keyboardCursor;
    if(!tile||!inside(tile.x,tile.y))return;
    const px=tile.x*S+5,py=tile.y*S+4+Math.round(Math.sin(time/185)*2);
    ctx.save();ctx.lineJoin='miter';ctx.lineWidth=3;
    // Sombra oscura para contrastar sobre bosque, agua y resaltados.
    ctx.fillStyle='#1d3545';ctx.beginPath();ctx.moveTo(px-1,py-1);ctx.lineTo(px+1,py+33);ctx.lineTo(px+10,py+24);ctx.lineTo(px+16,py+38);ctx.lineTo(px+24,py+34);ctx.lineTo(px+16,py+20);ctx.lineTo(px+30,py+18);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff2be';ctx.beginPath();ctx.moveTo(px+3,py+4);ctx.lineTo(px+5,py+27);ctx.lineTo(px+11,py+18);ctx.lineTo(px+17,py+31);ctx.lineTo(px+20,py+29);ctx.lineTo(px+14,py+16);ctx.lineTo(px+25,py+16);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e8ac5c';ctx.fillRect(px+6,py+10,3,9);
    ctx.restore();
}
/* Motor de escenas GBA v0.5: una transición + impacto real por cada acción.
   Las reglas tácticas permanecen en perform(); este módulo sólo presenta resultados. */
const backSprites={};
function getBackSprite(id){if(!backSprites[id])backSprites[id]=loadSpriteWithFallback(id,'back');return backSprites[id]}
function hideCinematic(){$('cinematic').hidden=true;cinematicBusy=false;b3release()}
function b3release(){if(typeof B3==='undefined'||!B3)return;const b=B3;B3=null;window.__B3=null;try{b.scene.traverse(o=>{if(o.geometry)o.geometry.dispose();const m=o.material;if(m)(Array.isArray(m)?m:[m]).forEach(x=>{for(const k in x){const v=x[k];if(v&&v.isTexture)v.dispose()}x.dispose()})});b.renderer.dispose();b.renderer.forceContextLoss()}catch(e){console.warn('b3release',e)}}
function px(x,y,w,h,c){sg.fillStyle=c;sg.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function polygon(points,color){sg.fillStyle=color;sg.beginPath();sg.moveTo(points[0][0],points[0][1]);for(const pt of points.slice(1))sg.lineTo(pt[0],pt[1]);sg.closePath();sg.fill()}
function textPixel(label,x,y,size,color='#fff0cf',align='left'){
    sg.textAlign=align;sg.textBaseline='middle';sg.font=`900 ${size}px monospace`;
    sg.lineWidth=4;sg.strokeStyle='#16283e';sg.strokeText(label,x,y);sg.fillStyle=color;sg.fillText(label,x,y);
}
function pixEllipse(cx,cy,rx,ry,color,step=4){
    for(let dy=-ry;dy<ry;dy+=step){
        const mid=dy+step/2,w=Math.round(rx*Math.sqrt(Math.max(0,1-(mid/ry)*(mid/ry)))/step)*step;
        if(w>0)px(cx-w,cy+dy,w*2,step,color);
    }
}
