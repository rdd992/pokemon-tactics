// v0.18 · Identificación visual del blanco (mouse y teclado).
// El objetivo se ilumina al pasar por él; en ataques de área marca a todos los afectados.
function drawAttackTargetMarkers(time){
 window.__r3lab=null;
    if(phase!=='player'||locked||!selected||selected.acted||!hovered||(!usingKeyboard&&!mouseOnBoard))return;
    const x=hovered.x,y=hovered.y;
    let targets=[];
    if(captureMode){
        // Las Poké Balls muestran exactamente la misma mira, nombre y nivel que los ataques.
        const u=occupied(x,y);
        if(captureMode.itemId){if(u&&itemTargets(captureMode.itemId,selected).includes(u))targets=[u]}else if(u&&u.side==='enemy'&&u.hp>0&&distance(selected,u)<=CAPTURE_RANGE)targets=[u];
    }else if(skill!==null){
        const slot=selected.moves[skill];if(!slot||!moveDB[slot.key])return;
        const m=moveDB[slot.key];if(!canAim(selected,m,x,y))return;
        targets=aimTargets(selected,m,x,y).filter(u=>u.hp>0);
    }
    if(!targets.length)return;
    ctx.save();
    for(const u of targets){
        const px=u.x*S,py=u.y*S,pulse=.5+.5*Math.sin(time/140);
        // Fondo rojo suave para distinguir el blanco incluso sobre bosques.
        ctx.fillStyle='rgba(236,90,73,'+(.12+.12*pulse)+')';ctx.fillRect(px+3,py+3,S-6,S-6);
        const inset=4,length=15;
        const x0=px+inset,y0=py+inset,x1=px+S-inset,y1=py+S-inset;
        ctx.lineWidth=6;ctx.strokeStyle='#182e40';ctx.beginPath();
        for(const [cx,cy,dx,dy] of [[x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1]]){
            ctx.moveTo(cx+dx*length,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx,cy+dy*length);
        }
        ctx.stroke();ctx.strokeStyle=pulse>.4?'#ffe89a':'#ffad73';ctx.lineWidth=4;ctx.stroke();
        // Flecha de objetivo que palpita sobre la criatura.
        const cy=py+2-Math.round(pulse*4);
        ctx.fillStyle='#20394a';ctx.beginPath();ctx.moveTo(px+22,cy-13);ctx.lineTo(px+38,cy-13);ctx.lineTo(px+30,cy+2);ctx.closePath();ctx.fill();
        ctx.fillStyle='#ffe58c';ctx.beginPath();ctx.moveTo(px+25,cy-11);ctx.lineTo(px+35,cy-11);ctx.lineTo(px+30,cy-2);ctx.closePath();ctx.fill();
        // Etiqueta en pixel-art: permite identificar especie y nivel antes de pulsar.
        if(window.__r3d){(window.__r3lab=window.__r3lab||new Set()).add(u);window.__r3cap=!!captureMode&&!captureMode.itemId;continue}
        const label=(captureMode&&!captureMode.itemId?'CAPTURAR · ':'')+base[u.id].name.toUpperCase()+' · NV.'+u.level;
        ctx.font='bold 11px monospace';ctx.textAlign='center';
        const w=Math.max(104,Math.ceil(ctx.measureText(label).width)+16);
        const left=Math.max(2,Math.min(720-w,px+S/2-w/2));
        const top=py>=65?py-38:py+S+3;
        ctx.fillStyle='#162c3b';ctx.fillRect(left,top,w,32);
        ctx.strokeStyle='#ffdd93';ctx.lineWidth=2;ctx.strokeRect(left+1,top+1,w-2,30);
        ctx.fillStyle='#fff2bc';ctx.fillText(label,left+w/2,top+15);
        // Barra de PS del objetivo
        {const bw=w-18,bx=left+9,by=top+20,ratio=Math.max(0,Math.min(1,u.hp/u.maxHp));
         ctx.fillStyle='#0b1822';ctx.fillRect(bx-1,by-1,bw+2,9);
         ctx.fillStyle='#3a4b57';ctx.fillRect(bx,by,bw,7);
         ctx.fillStyle=ratio>.5?'#58c46b':ratio>.2?'#e8c545':'#e0524a';ctx.fillRect(bx,by,Math.max(ratio>0?2:0,Math.round(bw*ratio)),7);
         ctx.fillStyle='#ffffff55';ctx.fillRect(bx,by,Math.max(ratio>0?2:0,Math.round(bw*ratio)),2);}
    }
    ctx.restore();
}
function gameErr(where,e){try{console.error(where,e);if(window.__gerr)return;window.__gerr=1;const d=document.createElement('div');d.id='gameErrBox';d.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:2147483647;background:#5a1020;color:#fff;font:12px/1.4 monospace;padding:10px 12px;border-radius:10px;white-space:pre-wrap;word-break:break-word;box-shadow:0 4px 18px #0008';d.textContent='⚠ '+where+': '+((e&&(e.stack||e.message))||e)+'\n(toca para cerrar · haz captura y envíala)';d.onclick=()=>d.remove();document.body.appendChild(d)}catch(_){}}
addEventListener('error',ev=>gameErr('Error',ev.error||ev.message));addEventListener('unhandledrejection',ev=>{const r=ev.reason;if(r&&/fullscreen|permission/i.test(String(r.message||r)))return;gameErr('Promesa',r)});
function draw(time){
    requestAnimationFrame(draw);try{drawFrame(time)}catch(e){gameErr('Bucle de dibujo',e)}
}
function drawFrame(time){
    if(!(skill!==null&&phase==='player'&&!locked&&selected))hideForecast();
    if(motion&&time>=motion.start+(motion.path.length-1)*motion.duration){
        const m=motion,end=m.path[m.path.length-1];motion=null;
        m.u.x=end.x;m.u.y=end.y;m.u.moved=true;
        locked=m.u.side==='enemy';updateUI();
        m.resolve();
    }
    ctx.clearRect(0,0,720,600);
    if(!window.__r3d&&!gbaDrawBackground()){for(let y=0;y<H;y++)for(let x=0;x<W;x++)drawTile(x,y,terrain(x,y),time);}
    if(inspectedEnemy&&enemyAnalysis&&phase==='player'){
        for(let y=0;y<H;y++)for(let x=0;x<W;x++){
            const key=x+','+y;
            if(enemyAnalysis.danger.has(key)){
                drawTileMark(x,y,'rgba(240,150,60,.24)','#ffc66e',3,time);
            }
            if(enemyAnalysis.movement.has(key)){
                drawTileMark(x,y,'rgba(214,70,100,.32)','#ffb2b7',5,time);
            }
        }
    }
    if(selected&&phase==='player'&&!selected.acted){
        if(!captureMode&&skill===null&&!selected.moved&&!actionMenu){
            let d=reachableEnd(selected);
            for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[y][x]<Infinity&&!occupied(x,y)&&!(x===selected.x&&y===selected.y)){
                drawTileMark(x,y,'rgba(24,72,220,.62)','#cfe6ff',3,time);
            }
            // Se ilumina también la casilla inicial para indicar el rango al primer clic.
            drawTileMark(selected.x,selected.y,'rgba(255,235,150,.20)','#fff0a8',2,time,true);
            if(!motion)drawRoute(previewRoute(),time);
        }else if(captureMode){
            for(const foe of (captureMode.itemId?itemTargets(captureMode.itemId,selected):units.filter(v=>v.side==='enemy'&&v.hp>0&&distance(selected,v)<=CAPTURE_RANGE))){
                ctx.fillStyle='#f8c6619e';ctx.fillRect(foe.x*S+4,foe.y*S+4,S-8,S-8);
                ctx.strokeStyle='#fff6ad';ctx.lineWidth=4;ctx.strokeRect(foe.x*S+4,foe.y*S+4,S-8,S-8);
            }
        }else if(skill!==null){
            const m=moveDB[selected.moves[skill].key];
            for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(canAim(selected,m,x,y)){
                drawTileMark(x,y,'rgba(205,90,10,.5)','#ffe4a0',4,time);
            }
        }
    }
    if(!window.__r3d)for(const u of units.filter(v=>v.hp>0).sort((a,b)=>a.y-b.y))drawUnit(u,time);
    drawAttackTargetMarkers(time);
    drawStatusVisuals(time);
    if(healEffect){
        // v0.179 · barra de PS sobre el Pokémon curado: la parte nueva se rellena hasta el valor final
        const he=healEffect,el=time-he.start;
        if(el>=2400||!units.includes(he.u))healEffect=null;
        else{
            if(window.__r3active&&window.__r3active()){if(!he.q){he.q=1;statusEffects.push({x:he.u.x,y:he.u.y,label:'💚 +'+Math.round(he.to-he.from)+' PS',color:'#7cf0a8',kind:'up',start:performance.now()})}}else{
            const bw=50,bx=he.u.x*S+5,by=he.u.y*S+1,max=he.u.maxHp;
            const k=Math.min(1,Math.max(0,(el-250)/750)),e=1-Math.pow(1-k,3);
            const cur=he.from+(he.to-he.from)*e,a=el>1900?1-(el-1900)/500:1;
            ctx.save();ctx.globalAlpha=a;
            ctx.fillStyle='#0b1822';ctx.fillRect(bx-2,by-2,bw+4,11);
            ctx.fillStyle='#24384a';ctx.fillRect(bx,by,bw,7);
            ctx.fillStyle='#2f9a5c';ctx.fillRect(bx,by,Math.round(bw*he.from/max),7);
            ctx.fillStyle=cur/max>.5?'#7cf0a8':cur/max>.25?'#f4dc6a':'#f0705c';
            ctx.fillRect(bx+Math.round(bw*he.from/max),by,Math.max(0,Math.round(bw*cur/max)-Math.round(bw*he.from/max)),7);
            ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(bx,by,Math.round(bw*cur/max),2);
            ctx.fillStyle='#fff';ctx.fillRect(bx+Math.round(bw*cur/max)-1,by-2,2,11);
            ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillStyle='#b8ffd2';ctx.strokeStyle='#0b1822';ctx.lineWidth=3;
            const label='+'+Math.round(he.to-he.from)+' PS',ly=by-6-Math.min(10,el/60);
            ctx.strokeText(label,bx+bw/2,ly);ctx.fillText(label,bx+bw/2,ly);
            ctx.restore();
        }}
    }
    if(reviveEffect){
        const elapsed=time-reviveEffect.start;
        if(elapsed>=1250)reviveEffect=null;
        else{
            if(window.__r3active&&window.__r3active()){if(!reviveEffect.q){reviveEffect.q=1;statusEffects.push({x:reviveEffect.x,y:reviveEffect.y,label:'✨ ¡REVIVIÓ!',color:'#fff3ad',kind:'up',start:performance.now()})}}else{
            const centerX=(reviveEffect.x+.5)*S,centerY=(reviveEffect.y+.5)*S;
            ctx.save();ctx.globalAlpha=Math.max(0,1-elapsed/1250);
            ctx.strokeStyle='#fff3ad';ctx.lineWidth=4;
            ctx.strokeRect(reviveEffect.x*S+3,reviveEffect.y*S+3,S-6,S-6);
            for(let i=0;i<8;i++){
                const a=i*Math.PI/4+elapsed/280,rad=14+elapsed/75;
                ctx.fillStyle=i%2?'#f8e9ad':'#a7ffcd';
                ctx.fillRect(centerX+Math.cos(a)*rad-3,centerY+Math.sin(a)*rad-3,6,6);
            }
            ctx.fillStyle='#fff2b9';ctx.font='bold 13px monospace';ctx.textAlign='center';
            ctx.fillText('¡REVIVIÓ!',centerX,reviveEffect.y*S-8-elapsed/85);
            ctx.restore();}
        }
    }
    campTick(time);drawCursor(time);
    try{render3D(time)}catch(e){if(!window.__r3err){window.__r3err=1;console.error('3D',e);gameErr('Tablero 3D',e)}}
}
function reset(fresh=true,chosenStarter=1){exitCamp();
    // La nueva partida empieza en el mapa de campaña y no en el Bosque Verde.
    starterChoice=[1,4,7].includes(chosenStarter)?chosenStarter:1;
    units=[unit(starterChoice,'player',1,7,5,movesForLevel(starterChoice,5))];
    reserves=[];storageBox=[];captureMode=null;captureBusy=false;
    money=0;moneyPaid=new Set();dexSeen=new Set();dexCaught=new Set();dexSel=null;setupTerrain('pallet');stageUnlocked=0;stageCleared=new Set();optionalCleared=new Set();campaignViewed=0;currentEncounter=null;battleBackup=null;
    selected=null;inspectedEnemy=null;enemyAnalysis=null;closeBattleMenu();skill=null;phase='win';round=1;locked=true;hovered=null;keyboardCursor={x:1,y:7};usingKeyboard=false;mouseOnBoard=false;motion=null;reviveEffect=null;statusEffects=[];movedFrom=null;pendingProgress=[];pendingExperience=[];progressIsOpen=false;thunderStones=1;
    hideCinematic();$('captureScene').hidden=true;$('expScene').hidden=true;$('modal').hidden=true;$('managerOverlay').hidden=true;$('gameBag').hidden=true;$('log').innerHTML='';
    if(fresh){bag={potion:4,superPotion:1,revive:1,ether:1,antidote:0,parlyz:0,pokeball:0,greatball:0,ultraball:0};wins=0}
    managerSelected=units[0];log('🌟 El Profesor Oak te entregó a '+base[starterChoice].name+'. ¡Tu aventura comienza con un solo Pokémon!');updateUI();saveGame(true);showCampaign(0)
}
// v0.51: confirmaciones dentro del juego (window.confirm queda bloqueado en vistas previas y marcos aislados, y la partida nueva no arrancaba).
function askConfirm(title,msg,yesText,onYes){
 const modal=$('modal');modal.style.zIndex='300';
 const close=()=>{modal.style.zIndex='';modal.hidden=true};
 showModal(title,msg,'⚠️',[{text:yesText,fn:()=>{close();onYes()}},{text:'CANCELAR',fn:close}]);
}
function newGame(){
 if(readSave())askConfirm('¿NUEVA PARTIDA?','Se reemplazará el guardado local anterior. Exporta antes el guardado si deseas conservarlo.','SÍ, EMPEZAR',chooseStarterScreen);
 else chooseStarterScreen();
}
$('startBtn').onclick=()=>newGame();
async function loadPokeAPI(){let got=0;for(const id of [25,4,1,7,16,74]){try{let controller=new AbortController();let timeout=setTimeout(()=>controller.abort(),4800);let res=await fetch('https://pokeapi.co/api/v2/pokemon/'+id+'/',{signal:controller.signal});clearTimeout(timeout);if(!res.ok)continue;let data=await res.json();if(!data.stats||data.stats.length!==6)continue;let byName={};data.stats.forEach(s=>{byName[s.stat.name]=s.base_stat});base[id].stats=['hp','attack','defense','special-attack','special-defense','speed'].map(k=>byName[k]);base[id].types=data.types.map(z=>z.type.name);
      if(Array.isArray(data.moves)){
          const remotely=[];
          for(const entry of data.moves){
              const key=pokeMoveKeys[entry.move.name];if(!key||!moveDB[key])continue;
              for(const detail of entry.version_group_details||[]){
                  if(detail.version_group.name==='firered-leafgreen'&&detail.move_learn_method.name==='level-up'&&detail.level_learned_at>0){
                      remotely.push({level:detail.level_learned_at,key});
                  }
              }
          }
          if(remotely.length){
              const known=new Map((learnsets[id]||[]).map(e=>[e.key,e]));
              for(const entry of remotely)known.set(entry.key,entry);
              learnsets[id]=[...known.values()].sort((a,b)=>a.level-b.level);
          }
      }
      got++;if(phase==='player'&&units.length&&round===1){for(const u of units.filter(z=>z.id===id)){let old=u.maxHp;statCalc(u);u.hp=Math.max(1,Math.min(u.maxHp,u.hp+u.maxHp-old))}updateUI()}}catch(e){/* offline: included canonical stats remain available */}}$('apiStatus').textContent=got===6?'✓ Estadísticas base verificadas con PokéAPI':got?'✓ PokéAPI: '+got+'/6 especies · resto con datos locales':'✓ Modo sin conexión: estadísticas locales'}

