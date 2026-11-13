// v0.16: cada modificación temporal dura dos fases completas de la unidad afectada.
// Si el propio usuario se potencia en su fase, la fase actual no cuenta: su siguiente acción aún tendrá el efecto.
const EFFECT_KEYS=['slow','atkDown','defUp','accuracyDown','trap','seed','haste','encore'];
const ENCORE_BAD=['encore','mimic','mirrormove','sketch','struggle','transform'];
function encoreLock(u){if(!(u&&u.effectTimers&&u.effectTimers.encore>0&&u.encoreKey))return null;if(u.moves.some(q=>q.key===u.encoreKey&&q.pp>0))return u.encoreKey;u.effectTimers.encore=0;u.encoreKey=null;if(u.hp>0)log('↗ '+base[u.id].name+': a su movimiento se le agotaron los PP y termina Otra Vez.');return null}
function startTemporaryEffect(target,key){
 if(!target.effectTimers)target.effectTimers={slow:0,atkDown:0,defUp:0,accuracyDown:0,trap:0};
 target.effectTimers[key]=(target.side===phase?3:2)+(key==='trap'?1:0); // la atadura dura un turno más que otros efectos
}
function effectTurnsTrap(u){return Math.max(1,Number((u.effectTimers||{}).trap)||0)}
function effectTurnsLeft(u,key){return Math.min(2,Math.max(0,Number((u.effectTimers||{})[key])||0))}
function tickTemporaryEffects(side){
 for(const u of units.filter(v=>v.side===side)){
  if(!u.effectTimers)continue;
  for(const key of EFFECT_KEYS){
   if(!(u.effectTimers[key]>0))continue;
   u.effectTimers[key]--;
   if(u.effectTimers[key]===0){
    if(key==='slow')u.slowed=false;
    if(key==='haste')u.hasted=false;
    if(key==='atkDown')u.atkDown=0;
    if(key==='defUp')u.defUp=0;
    if(key==='accuracyDown')u.accuracyDown=0;
    if(key==='trap'){u.trapped=false;u.trapBy=null}
    if(key==='seed'){u.seeded=false;u.src_seed=null}
    if(key==='encore')u.encoreKey=null;
    if(u.hp>0){
     const name=key==='slow'||key==='haste'?'Movimiento':key==='atkDown'?'Ataque':key==='defUp'?'Defensa':key==='trap'?'Atadura':key==='seed'?'Drenadoras':key==='encore'?'Otra Vez':'Precisión';
     log('↗ '+base[u.id].name+': terminó el efecto temporal de '+name+'.');
     queueStatusVisual(u,'recover');
    }
   }
  }
 }
}
function partyRecover(){for(const u of [...partyAll(),...storageBox]){u.hp=u.maxHp;for(const m of u.moves)m.pp=moveDB[m.key].pp;u.paralyzed=false;u.burned=false;u.seeded=false;u.poisoned=false;u.trapped=false;u.trapBy=null;u.critUp=false;u.mudSport=false;u.hasted=false;u.flinch=false;u.raging=false;u.asleep=0;u.slowed=false;u.atkDown=0;u.defUp=0;u.accuracyDown=0;u.effectTimers={slow:0,atkDown:0,defUp:0,accuracyDown:0,trap:0};u.counterUsed=false;u.moved=false;u.acted=false;u.lastMoveKey=null;u.encoreKey=null}}
let leaveForced=false;
function showCampaignForce(selectIndex){leaveForced=true;try{showCampaign(selectIndex)}finally{leaveForced=false}saveGame(true);$('titleOverlay').classList.add('behind');$('titleOverlay').hidden=false;try{menuScreen('home')}catch(e){}}
let cityView=false;
let campOn=false;window.__campOn=false;
function exitCamp(){campOn=false;window.__campOn=false;for(const u of units)delete u.camp}
function campPath(sx,sy,tx,ty){const Wd=map[0].length,Hd=map.length,key=(x,y)=>y*Wd+x,prev=new Map([[key(sx,sy),null]]),q=[[sx,sy]];
 while(q.length){const [x,y]=q.shift();if(x===tx&&y===ty)break;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=Wd||ny>=Hd||map[ny][nx]==='X'||prev.has(key(nx,ny)))continue;prev.set(key(nx,ny),[x,y]);q.push([nx,ny])}}
 if(!prev.has(key(tx,ty)))return null;const out=[];let c=[tx,ty];while(c&&!(c[0]===sx&&c[1]===sy)){out.unshift({x:c[0],y:c[1]});c=prev.get(key(c[0],c[1]))}return out}
function campInit(u,time){const free=[];for(let y=0;y<map.length;y++)for(let x=0;x<map[0].length;x++)if(map[y][x]!=='X'&&!units.some(o=>o!==u&&o.camp&&Math.round(o.camp.x)===x&&Math.round(o.camp.y)===y))free.push([x,y]);
 const c=free[Math.floor(Math.random()*free.length)]||[5,4];u.camp={x:c[0],y:c[1],dx:0,dy:1,moving:false,run:false,speed:1.3,path:[],wait:time+400+Math.random()*1800,lastT:time}}
function enterCamp(){
 if(campOn||(phase!=='win'&&currentEncounter))return;
 setupTerrain('camp');
 map[4]=map[4].slice(0,6)+'X'+map[4].slice(7); // la fogata ocupa esta casilla
 map[1]=map[1].slice(0,6)+'X'+map[1].slice(7); // la grieta de luz (acceso a ???) ocupa esta casilla
 units=units.filter(u=>u.side==='player');selected=null;inspectedEnemy=null;hovered=null;
 try{partyRecover()}catch(e){}
 for(const u of units)delete u.camp;
 campOn=true;window.__campOn=true;
}
function openLunarPrompt(){ // la grieta de luz del campamento lleva al mapa «???»
 if(!campOn||!$('modal').hidden)return;
 showModal('🌑 ???','Una grieta de luz pálida se abre en el suelo del campamento. Al otro lado hay un lugar que no figura en ningún mapa… y algo te espera.\n\nEl combate es contra Pokémon salvajes y su nivel es 10. ¿Quieres entrar?','🌑 ✨',[{text:'ENTRAR',fn:()=>{$('modal').hidden=true;beginCampaignEncounter('lunar','wild')}},{text:'QUEDARME',fn:()=>{$('modal').hidden=true}}]);
}
function campTick(time){
 if(!campOn)return;
 for(const u of units){if(u.side!=='player'||u.hp<=0)continue;if(!u.camp)campInit(u,time);const c=u.camp,dt=Math.min(.1,Math.max(0,(time-c.lastT)/1000));c.lastT=time;
  if(c.path.length){const t=c.path[0],vx=t.x-c.x,vy=t.y-c.y,d=Math.hypot(vx,vy),st=c.speed*dt;
   if(d<=st){c.x=t.x;c.y=t.y;c.path.shift();if(!c.path.length){c.moving=false;c.wait=time+1500+Math.random()*3500}}
   else{c.x+=vx/d*st;c.y+=vy/d*st;c.dx=vx;c.dy=vy;c.moving=true}}
  else if(time>=c.wait){
   const sx=Math.round(c.x),sy=Math.round(c.y);let best=null;
   for(let k=0;k<12&&!best;k++){const tx=Math.floor(Math.random()*map[0].length),ty=Math.floor(Math.random()*map.length),md=Math.abs(tx-sx)+Math.abs(ty-sy);
    if(md<2||md>7||map[ty][tx]==='X')continue;if(units.some(o=>o!==u&&o.camp&&(Math.round(o.camp.x)===tx&&Math.round(o.camp.y)===ty||o.camp.path.length&&o.camp.path[o.camp.path.length-1].x===tx&&o.camp.path[o.camp.path.length-1].y===ty)))continue;
    const p=campPath(sx,sy,tx,ty);if(p&&p.length)best=p}
   if(best){c.path=best;c.run=Math.random()<.45;c.speed=c.run?2.7:1.3}else c.wait=time+800}}
}

function renderCityPanel(){ // v651: panel de la Ruta 22
 const d=CAMPAIGN.route22,cleared=stageCleared.has('viridian'),beatRival=optionalCleared.has('route22'),rec=d.recommended||[8,10];
 $('routeDetail').innerHTML='<div class="routeBadge">RUTA OPCIONAL</div><h3 class="routeTitle">'+d.icon+' Ruta 22</h3><p class="routeDesc">'+d.desc+'</p><div class="routeWild"><b>⭐ Nivel recomendado: '+rec[0]+'–'+rec[1]+'</b></div><div class="routeWild"><b>🌿 Pokémon salvajes</b><div>'+d.wild.map(p=>base[p.id].name).join(' · ')+'</div></div>';
 const panel=$('routeActions');panel.replaceChildren();
 if(!cleared&&!DEVU){panel.innerHTML='<div class="routeNoAccess">🔒 Primero entrega el paquete al Profesor Oak en Ciudad Verde.</div>';return}
 const add=(icon,title,desc,kind,on)=>{const b=document.createElement('button');b.type='button';b.className='routeChoice'+(on?'':' trainingLocked');b.disabled=!on;b.innerHTML='<span class="choiceIcon">'+icon+'</span><span><strong>'+title+'</strong><small>'+desc+'</small></span>';if(on)b.onclick=()=>beginCampaignEncounter('route22',kind);panel.append(b)};
 add(beatRival?'✅':'⚔️','Duelo opcional · Rival',beatRival?'Rival derrotado · no se puede repetir':'Duelo opcional: Pidgey Nv. 9 y su inicial Nv. 9','main',DEVU||!beatRival);
 add(beatRival?'🌿':'🔒','Entrenar en esta zona',beatRival?'Combate contra Pokémon salvajes y captura nuevos compañeros':'Gana el duelo contra tu rival para desbloquearlo','wild',beatRival||DEVU);
 const rl=rodLevel();add(rl>0?'🎣':'🔒','Pescar',rl>0?'Usa la '+ROD_NAMES[rl]+' en el agua: Pokémon acuáticos para combatir y capturar':'Necesitas una caña de pescar (Vieja, Buena o Super)','fish',rl>0);
}
function showCampaign(selectIndex){cityView=false;
 if(phase==='enemy'||cinematicBusy||captureBusy||captureMode||motion||progressIsOpen||pendingExperience.length||pendingProgress.length||!$('gameBag').hidden)return;
  if(!leaveForced&&phase==='player'&&currentEncounter&&!locked&&(round>1||units.some(u=>u.side==='player'&&(u.moved||u.acted)||u.hp<u.maxHp)||units.some(u=>u.side==='enemy'&&u.hp<u.maxHp))){
   // Combate en curso: pedir confirmación y abandonar restaurando el equipo a como estaba antes del encuentro.
   closeBattleMenu();
   showModal('¿ABANDONAR EL COMBATE?','Saldrás al mapa de Kanto y se perderá el progreso de este combate (EXP, PS, PP y objetos usados vuelven a como estaban antes de empezar).','🏃',[
     {text:'ABANDONAR',fn:()=>{$('modal').hidden=true;captureMode=null;phase='player';showCampaignForce(selectIndex)}},
     {text:'SEGUIR LUCHANDO',fn:()=>{$('modal').hidden=true}}
   ]);
   return;
 }
 if(phase==='player'&&currentEncounter){ // abandonar antes del primer movimiento
   if(battleBackup){units=battleBackup.party.map((snap,i)=>{let p=restoreUnit(snap,'player');p.x=[1,1,2,2][i];p.y=[6,7,8,6][i];return p});reserves=battleBackup.reserves.map(r=>restoreUnit(r,'player'));bag={...battleBackup.bag};storageBox=(battleBackup.box||[]).map(r=>restoreUnit(r,'player'));thunderStones=battleBackup.thunderStones}
   phase='win';locked=true;currentEncounter=null;
 }
 $('modal').hidden=true;$('managerOverlay').hidden=true;closeBattleMenu();selected=null;skill=null;enterCamp();
 campaignViewed=Math.max(0,Math.min(DEVU?STAGE_ORDER.length-1:stageUnlocked,selectIndex===undefined?campaignViewed:selectIndex));
 $('campaignOverlay').hidden=false;renderCampaign();updateUI();
}

const BADGES=[['Roca','Brock','Ciudad Plateada','Roca','Ataque +10 % · +1 Pokémon en el tablero (hasta 4) · +5 % de daño con ataques Roca.','pewter'],['Cascada','Misty','Ciudad Celeste','Agua','Sin efecto en combate (en FRLG: obediencia por nivel y poder usar Corte).','cerulean'],['Trueno','Teniente Surge','Ciudad Carmín','Eléctrico','Velocidad +10 %.','vermilion'],['Arcoíris','Erika','Ciudad Azulona','Planta','Sin efecto en combate (en FRLG: obediencia por nivel y Fuerza).',''],['Alma','Koga','Ciudad Fucsia','Veneno','Defensa +10 %.','fuchsia'],['Pantano','Sabrina','Ciudad Azafrán','Psíquico','Sin efecto en combate (en FRLG: obediencia por nivel).',''],['Volcán','Blaine','Isla Canela','Fuego','Ataque Esp. y Defensa Esp. +10 %.','cinnabar'],['Tierra','Giovanni','Ciudad Verde','Tierra','Todos los Pokémon te obedecen (sin efecto en combate).','']];
