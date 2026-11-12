// Pista deseada según lo que ocurre en pantalla; se revisa cada medio segundo.
let evoPhase=null;
function musicWanted(){
 if(evoPhase==='music')return 'evolution';if(evoPhase==='hold')return null;
 if($('titleOverlay')&&!$('titleOverlay').hidden)return 'title';
 const enc=currentEncounter;
 if(enc&&phase!=='win'&&phase!=='lose'&&(units.some(u=>u.side==='enemy'&&u.hp>0)||cinematicBusy||captureBusy||motion||pendingExperience.length||pendingProgress.length||progressIsOpen)){
  const data=CAMPAIGN[enc.id];
  if(enc.kind==='main'&&data&&data.mainKind==='boss')return 'boss';
  if(enc.kind==='main'&&data&&data.mainKind==='trainer')return 'trainer';
  return 'wild';
 }
 return 'route';
}
let musicUnlocked=false;
function musicTick(){
 if(!musicOn){if(musicTrack)musicStop(.2);return}
 if(!musicUnlocked)return;
 const want=musicWanted();
 if(want===null){if(musicTrack)musicStop(.12);return}
 if(want!==musicTrack)musicStart(want);
 if(musicOut&&audioCtx){const duck=(cinematicBusy&&evoPhase!=='music')?.55:1;if(duck!==musicDuck){musicDuck=duck;musicOut.gain.linearRampToValueAtTime(.55*duck,audioCtx.currentTime+.2)}}
}
function setMusic(on){
 musicOn=on;try{localStorage.setItem('pokemon-tactics-music',on?'on':'off')}catch(e){}
 const label=on?'ACTIVADA':'DESACTIVADA';
 if($('toggleMusic'))$('toggleMusic').textContent='Música: '+label;if($('titleMusicToggle'))$('titleMusicToggle').textContent=label;
 if(on){musicUnlocked=musicUnlocked||false;musicTick()}else musicStop(.2);
}
// Los navegadores exigen un gesto del jugador antes de reproducir audio.
const musicHint=document.createElement('div');musicHint.textContent=matchMedia('(pointer:coarse)').matches?'🎵 Toca la pantalla para activar la música':'🎵 Haz clic o pulsa una tecla para activar la música';musicHint.style.cssText='position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99999;padding:9px 16px;border-radius:999px;background:rgba(10,20,36,.92);border:1px solid rgba(255,217,138,.6);color:#ffe9b0;font:800 13px/1.2 system-ui,sans-serif;pointer-events:none;box-shadow:0 6px 24px rgba(0,0,0,.45);transition:opacity .4s';musicHint.hidden=true;document.body.append(musicHint);
function musicHintUpdate(){musicHint.hidden=!(musicOn&&!musicUnlocked&&$('titleOverlay')&&!$('titleOverlay').hidden)}
const musicUnlock=()=>{if(!musicUnlocked){musicUnlocked=true;musicHintUpdate();musicTick()}};
for(const evt of ['pointerdown','mousedown','pointerup','click','touchend','keydown']){document.addEventListener(evt,musicUnlock,{capture:true})}
try{const A0=musicCtx();if(A0&&A0.state==='running')musicUnlocked=true}catch(e){}
setInterval(()=>{musicHintUpdate();musicTick()},500);musicHintUpdate();

function retryCampaignEncounter(){
 if(!currentEncounter){showCampaign();return}
 // v0.22: Repetir NUNCA recupera el backup previo a la batalla.
 // Los niveles, EXP, movimientos, objetos gastados y Pokémon capturados son progreso persistente,
 // incluso si el jugador ha perdido. beginCampaignEncounter() cura y crea rivales nuevos.
 const e={...currentEncounter};
 if(phase==='win')saveGame(true);
 window.__fish=e.fish||0;beginCampaignEncounter(e.id,e.kind);
}
$('openCampaign').onclick=()=>showCampaign();
$('campaignClose').onclick=()=>{$('campaignOverlay').hidden=true;if($('titleOverlay').classList.contains('behind')){$('titleOverlay').classList.remove('behind');return}updateUI()};
$('campTeam').onclick=()=>{$('campaignOverlay').hidden=true;openManager('team')};


const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y),inside=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
const opponent=u=>units.filter(v=>v.side!==u.side&&v.hp>0),friends=u=>units.filter(v=>v.side===u.side&&v.hp>0),occupied=(x,y,except)=>units.find(v=>v.hp>0&&v.x===x&&v.y===y&&v!==except),terrain=(x,y)=>map[y][x];
function movementCost(t,u){if(t==='X')return Infinity;if(u&&u.side==='enemy'&&currentEncounter&&currentEncounter.fish&&base[u.id].types.includes('water'))return t==='~'?1:Infinity;if(t==='~')return base[u.id].types.includes('flying')?1:Infinity;if(t==='F')return base[u.id].types.includes('flying')?1:2;return 1}
function isLedge(x,y){if(typeof frlgChar!=='function')return false;const c=frlgChar(stageId,x,y);return c==='l'||(c==='r'&&(stageId==='route22'||stageId==='route3'||stageId==='route3b'||stageId==='route4'))}
function movementAllowance(u){return Math.max(1,base[u.id].move-(u.paralyzed?2:0)-(u.slowed?3:0)+(u.hasted?2:0))}
let _gzKey='',_gz=null;
function groundZone(){const ground=units.filter(q=>q.hp>0&&q.x>=0&&!base[q.id].types.includes('flying'));if(!ground.length)return null;
 const key=stageId+'|'+ground.map(q=>q.x+','+q.y).join(';');if(key===_gzKey)return _gz;
 const seen=new Set(),st=[];for(const q of ground){const k=q.x+','+q.y;if(!seen.has(k)){seen.add(k);st.push([q.x,q.y])}}
 while(st.length){const [cx,cy]=st.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy,k=nx+','+ny;if(!inside(nx,ny)||seen.has(k))continue;const t=terrain(nx,ny);if(t==='X'||t==='~')continue;seen.add(k);st.push([nx,ny])}}
 _gzKey=key;_gz=seen;return seen}
function landOK(u,x,y){if(!base[u.id].types.includes('flying')||(x===u.x&&y===u.y))return true;const z=groundZone();if(!z)return true;
 if(terrain(x,y)!=='~')return z.has(x+','+y);
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(z.has((x+dx)+','+(y+dy)))return true;return false}
function reachableEnd(u){const d=reachable(u);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(Number.isFinite(d[y][x])&&!landOK(u,x,y))d[y][x]=Infinity;return d}
function reachable(u){if(u.trapped){const d0=Array.from({length:H},()=>Array(W).fill(Infinity));d0[u.y][u.x]=0;return d0} // atrapado: no puede moverse
 let max=movementAllowance(u),dist=Array.from({length:H},()=>Array(W).fill(Infinity));dist[u.y][u.x]=0;const done=new Set(),jmp=new Set();for(;;){let best=null,bestCost=Infinity;for(let y=0;y<H;y++)for(let x=0;x<W;x++){let q=x+','+y;if(!done.has(q)&&dist[y][x]<bestCost){best={x,y};bestCost=dist[y][x]}}if(!best||bestCost>max)break;done.add(best.x+','+best.y);if(!jmp.has(best.x+','+best.y))for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=best.x+dx,y=best.y+dy;if(!inside(x,y))continue;let occ=occupied(x,y,u);if(occ&&occ.side!==u.side)continue;let next=bestCost+movementCost(terrain(x,y),u);if(next<dist[y][x]){dist[y][x]=next;jmp.delete(x+','+y)}}
 // v0.59: los desniveles se saltan hacia abajo (de la casilla de arriba a la de abajo), como en Rojo Fuego / Verde Hoja.
 {const jx=best.x,jy=best.y+2;if(!jmp.has(best.x+','+best.y)&&isLedge(jx,best.y+1)&&inside(jx,jy)){const occ=occupied(jx,jy,u);if(!(occ&&occ.side!==u.side)){const next=bestCost+1+movementCost(terrain(jx,jy),u);if(next<dist[jy][jx]){dist[jy][jx]=next;jmp.add(jx+','+jy)}}}}}return dist}
