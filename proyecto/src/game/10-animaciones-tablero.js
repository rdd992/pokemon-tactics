// Animaciones cortas sobre el tablero para estados, bajadas y subidas de estadísticas.
const statusVisuals={
 atkUp:['⚔ ATAQUE ↑','#a0e4ac','up'],atkDown:['⚔ ATAQUE ↓','#f7a16e','down'],accuracyDown:['🎯 PRECISIÓN ↓','#edb77b','down'],
 defDown:['🛡 DEFENSA ↓','#f3ad75','down'],defUp:['🛡 DEFENSA ↑','#a0e4ac','up'],
 evadeUp:['✨ EVASIÓN ↑','#a0e4ac','up'],slow:['👣 MOVIMIENTO ↓','#f2b17c','down'],slow10:['👣 MOVIMIENTO ↓','#f2b17c','down'],paralysis10:['⚡ PARÁLISIS','#ffe184','down'],confuse10:['💫 CONFUSIÓN','#e8afed','down'],confuse20:['💫 CONFUSIÓN','#e8afed','down'],flinch30:['😖 AMEDRENTADO','#e8afed','down'],speedUp:['💨 VELOCIDAD ↑','#a0e4ac','up'],mudsport:['🟤 ELÉCTRICO ↓','#d2b48c','up'],defDown2:['🛡 DEFENSA ↓↓','#f3ad75','down'],
 encore:['🔁 OTRA VEZ','#f2b17c','down'],paralysis:['⚡ PARÁLISIS','#ffe184','down'],sleep:['💤 DORMIDO','#adb6f0','down'],
 poison:['☠ ENVENENADO','#bda0e9','down'],poison20:['☠ ENVENENADO','#bda0e9','down'],poison30:['☠ ENVENENADO','#bda0e9','down'],
 seed:['🌱 DRENADORAS','#a2e2a0','down'],confuse:['💫 CONFUSIÓN','#e8afed','down'],
 burn10:['🔥 QUEMADURA','#f0aa76','down'],missStatus:['✖ FALLÓ','#f0b4a3','down'],blockedStatus:['✖ SIN EFECTO','#d9bdd3','down'],recover:['✨ EFECTO TERMINADO','#a7e0c3','up']
};
function statusDmgFx(u,n,icon,color){if(!(n>0))return;const now=performance.now(),k=statusEffects.filter(e=>e.x===u.x&&e.y===u.y&&now-e.start<1250).length;statusEffects.push({x:u.x,y:u.y,label:icon+' −'+n+' PS',color,kind:'down',start:now+k*500})}
function queueStatusVisual(unit,eff){
 const setting=statusVisuals[eff];if(!setting)return;
 statusEffects.push({x:unit.x,y:unit.y,label:setting[0],color:setting[1],kind:setting[2],start:performance.now()});
}
function drawStatusVisuals(time){
 statusEffects=statusEffects.filter(e=>time-e.start<1250);
 try{if(window.__r3status&&window.__r3status(time))return}catch(_e){}
 for(const e of statusEffects){
   const elapsed=Math.max(0,time-e.start),progress=Math.min(1,elapsed/1150),alpha=Math.min(1,elapsed/140, (1250-elapsed)/360);
   const x=(e.x+.5)*S,y=(e.y+.55)*S;
   ctx.save();ctx.globalAlpha=Math.max(0,alpha);
   ctx.lineWidth=4;ctx.strokeStyle=e.color;
   ctx.strokeRect(e.x*S+4,e.y*S+4,S-8,S-8);
   for(let j=0;j<10;j++){
      const angle=(j/10)*Math.PI*2+elapsed/520,rad=10+progress*39;
      ctx.fillStyle=j%2?e.color:'#fff5d6';
      ctx.fillRect(x+Math.cos(angle)*rad-3,y+Math.sin(angle)*rad-3,6,6);
   }
   const floatY=e.kind==='up'?y-35-progress*30:y-35-progress*13;
   ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
   const w=ctx.measureText(e.label).width+18;
   ctx.fillStyle='#152e42e8';ctx.fillRect(x-w/2,floatY-12,w,25);
   ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.strokeRect(x-w/2,floatY-12,w,25);
   ctx.fillStyle='#fff4ce';ctx.fillText(e.label,x,floatY+1);
   ctx.restore();
 }
}
function typeMessage(eff){
 if(eff>1)return '¡ES SUPEREFICAZ! ×'+eff;
 if(eff===0)return '¡NO TIENE EFECTO!';
 if(eff<1)return 'No es muy eficaz… ×'+eff;
 return '';
}
async function showEffectiveness(events){
 const withType=events.filter(e=>!e.miss&&e.damage!==undefined&&e.move.power>0&&typeof e.eff==='number'&&e.eff!==1);
 if(!withType.length)return;
 const important=withType.find(e=>e.eff>1)||withType.find(e=>e.eff===0)||withType[0];
 const toast=$('effectivenessToast');
 toast.textContent=typeMessage(important.eff);
 toast.className='effectivenessToast'+(important.eff===0?' immune':important.eff<1?' weak':'');
 toast.hidden=false;
 try{await delay(920)}finally{toast.hidden=true}
}
// Tipo Planta: inmune a los polvos (Somnífero y Polvo Veneno), como desde la Gen VI.
function grassPowderImmune(m,v){return !!m&&(m.effect==='sleep'||m.effect==='poison')&&['powdersleep','powderpoison'].includes(fxMoveKey(m))&&base[v.id].types.includes('grass')}
function applyEffect(u,v,m){
 if(!m.effect)return '';
 if(grassPowderImmune(m,v))return ' No afecta a un Pokémon de tipo Planta.';
 if(m.effect==='paralysis'){
  if(v.paralyzed)return ' Ya estaba paralizado.';
  v.paralyzed=true;return ' ⚡ ¡Paralizado!';
 }
 if(m.effect==='burn10'){if(base[v.id].types.includes('fire')||v.burned)return '';if(Math.random()<.1){v.burned=true;v.src_burn=u;return ' 🔥 ¡Quemadura!'}return ''}
 if(m.effect==='paralysis10'){if(v.paralyzed||base[v.id].types.includes('electric')||Math.random()>=.1)return '';v.paralyzed=true;return ' ⚡ ¡Paralizado!'}
 if(m.effect==='slow10'){if(Math.random()>=.1)return '';v.slowed=true;startTemporaryEffect(v,'slow');return ' 👣 Movimiento −3 PM durante 2 turnos.'}
 if(m.effect==='confuse10'||m.effect==='confuse20'){if(Math.random()>=(m.effect==='confuse10'?.1:.2))return '';v.slowed=true;startTemporaryEffect(v,'slow');return ' 💫 ¡Desorientado! Movimiento −3 PM por 2 turnos.'}
 if(m.effect==='flinch30'){if(v.flinch||Math.random()>=.3)return '';v.flinch=true;return ' 😖 ¡Se amedrentó! Perderá su próxima acción.'}
 if(m.effect==='mudsport'){v.mudSport=true;return ' 🟤 ¡Los ataques Eléctricos se debilitan!'}
 if(m.effect==='speedUp'){v.hasted=true;startTemporaryEffect(v,'haste');return ' 💨 ¡Velocidad ↑! +2 PM durante 2 turnos.'}
 if(m.effect==='trap'){
  if(v.trapped)return '';
  v.trapped=true;v.trapBy=u;startTemporaryEffect(v,'trap');
  return ' 🪢 ¡Atrapado! No puede moverse durante '+effectTurnsTrap(v)+' turnos y pierde 1/16 de sus PS por ronda.';
 }
 if(m.effect==='critUp'){
  if(v.critUp)return ' Ya tenía la energía concentrada.';
  v.critUp=true;return ' 🎯 ¡Se concentra! Probabilidad de golpe crítico ×4 durante el combate.';
 }
 if(m.effect==='encore'){
  if(v.effectTimers&&v.effectTimers.encore>0&&v.encoreKey)return ' Ya estaba bajo Otra Vez.';
  const lk=v.lastMoveKey,lm=lk&&v.moves.find(q=>q.key===lk);
  if(!lk||ENCORE_BAD.includes(lk)||!lm||lm.pp<=0)return ' ¡Pero falló! No tiene un movimiento que repetir.';
  v.encoreKey=lk;startTemporaryEffect(v,'encore');v.effectTimers.encore=3;
  return ' 🔁 ¡Otra Vez! Está obligado a repetir '+moveDB[lk].name+' durante 3 turnos.';
 }
 if(m.effect==='slow'){
  v.slowed=true;startTemporaryEffect(v,'slow');
  return ' 👣 Movimiento −3 PM durante 2 turnos.';
 }
 if(m.effect==='atkDown'){
  v.atkDown=Math.min(3,v.atkDown+1);startTemporaryEffect(v,'atkDown');
  return ' ⚔ Ataque ↓1 nivel (×2/3) durante 2 turnos.';
 }
 if(m.effect==='accuracyDown'){
  v.accuracyDown=Math.min(3,v.accuracyDown+1);startTemporaryEffect(v,'accuracyDown');
  return ' 🎯 Precisión −18 puntos por nivel durante 2 turnos.';
 }
 if(m.effect==='defUp'){
  v.defUp=Math.min(3,v.defUp+1);startTemporaryEffect(v,'defUp');
  return ' 🛡 Defensa ↑1 nivel (×1,5) durante 2 turnos.';
 }
 if(m.effect==='defDown'||m.effect==='defDown2'){
  v.defUp=Math.max(-3,v.defUp-(m.effect==='defDown2'?2:1));startTemporaryEffect(v,'defUp');
  return ' 🛡 Defensa ↓1 nivel (×2/3) durante 2 turnos.';
 }
 if(m.effect==='poison'||m.effect==='poison20'||m.effect==='poison30'||m.effect==='poison40'){
  // Los tipos Veneno y Acero son inmunes al envenenamiento
  if(base[v.id].types.some(t=>t==='poison'||t==='steel'))return m.effect==='poison'?' No se ve afectado por el veneno.':'';
  const chance=v._critHit&&m.power?1:m.effect==='poison20'?.2:m.effect==='poison30'?.3:m.effect==='poison40'?.4:1; // v651: golpe crítico ⇒ envenena seguro (salvo tipos Veneno/Acero, ya excluidos arriba)
  if(v.poisoned)return m.effect==='poison'?' Ya estaba envenenado.':'';
  if(Math.random()<chance){v.poisoned=true;v.src_poison=u;return ' ☠️ ¡Envenenado!'}return '';
 }
 if(m.effect==='sleep'){v.asleep=2;return ' 💤 ¡Dormido!'}
 if(m.effect==='confuse'){
  v.slowed=true;startTemporaryEffect(v,'slow');
  return ' 💫 ¡Desorientado! Movimiento −3 PM por 2 turnos.';
 }
 if(m.effect==='evadeUp'){
  v.defUp=Math.min(3,v.defUp+1);startTemporaryEffect(v,'defUp');
  return ' ✨ Evasión: bonificación defensiva ↑1 nivel durante 2 turnos.';
 }
 if(m.effect==='seed'){if(base[v.id].types.includes('grass'))return ' No se ve afectado por Drenadoras.';if(v.seeded)return ' Ya tenía Drenadoras.';v.seeded=true;v.src_seed=u;startTemporaryEffect(v,'seed');return ' 🌿 Drenadoras activadas (2 turnos).'}
 return '';
}
