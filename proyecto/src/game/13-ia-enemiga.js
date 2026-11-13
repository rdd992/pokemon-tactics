// IA v0.26: el objetivo se elige por oportunidad táctica, NO por daño bruto.
// Prioriza un KO, luego porcentaje de PS restantes, vulnerabilidad, cercanía y cobertura.
function aiPlan(u){
 const enemies=opponent(u).filter(v=>v.hp>0);
 if(!enemies.length)return null;
 const spots=reachableSpots(u),encL=encoreLock(u);
 const choices=[];
 for(const pos of spots){
  for(let i=0;i<u.moves.length;i++){
   const mp=u.moves[i],m=moveDB[mp.key];
   if(mp.pp<=0||m.shape==='self'||(encL&&mp.key!==encL))continue;
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!canAim(u,m,x,y,pos))continue;
    const hits=m.shape==='area'?enemies.filter(v=>Math.abs(v.x-x)+Math.abs(v.y-y)<=m.radius):enemies.filter(v=>v.x===x&&v.y===y);
    if(!hits.length)continue;
    let score=0;
    for(const v of hits){
     const close=distance(u,v);
     if(m.power){
      const expected=damage(u,v,m,false); // sin RNG para que la IA no haga trampa
      const dealt=Math.min(v.hp,expected);
      const hitChance=Math.max(.05,Math.min(1,(m.acc-u.accuracyDown*18)/100));
      // Un debilitamiento posible supera a dañar a una unidad con más PS.
      if(expected>=v.hp)score+=115*hitChance;
      // Escalamos por proporción de vida realmente quitada, no por puntos brutos.
      score+=hitChance*(45*dealt/Math.max(1,v.hp)+18*dealt/Math.max(1,v.maxHp));
      // Una unidad ya debilitada suele ser un mejor objetivo táctico.
      score+=12*(1-v.hp/Math.max(1,v.maxHp));
      // v651: la IA busca siempre explotar la debilidad del rival: prioriza los golpes supereficaces y evita los poco eficaces o inútiles.
      {const ef=effect(m.type,base[v.id].types);score+=ef===0?-60:ef>=4?48*hitChance:ef>1?34*hitChance:ef<1?-20:0}
      // Entre objetivos de valor similar, preferir al más próximo.
      score-=1.6*close;
      // v651: riesgo de la respuesta. Si el objetivo sobrevive, contraataca desde su casilla: la IA evita lanzarse contra
      // Pokémon que le hacen daño supereficaz (o que podrían debilitarla con el contraataque) y busca otro objetivo o casilla.
      if(expected<v.hp&&u.hp>0){
       const ox=u.x,oy=u.y;u.x=pos.x;u.y=pos.y;let cf=null;try{cf=counterForecast(u,v,m)}finally{u.x=ox;u.y=oy}
       if(cf&&!cf.none&&cf.max>0){const ch=cf.acc/100,r=Math.min(1,cf.max/Math.max(1,u.hp));
        score-=ch*(26*r+(cf.eff>1?22:0)+(cf.max>=u.hp?45:0))}
       // amenaza general para el turno siguiente: tiene algún ataque supereficaz contra este Pokémon
       {let th=0;for(const it of v.moves){const cm=moveDB[it.key];if(it.pp>0&&cm.power>0&&effect(cm.type,base[u.id].types)>1)th=Math.max(th,damage(v,u,cm,false)/Math.max(1,u.hp))}
        if(th>0)score-=14+30*Math.min(1,th)}
      }
     }else{
      const useful=m.effect==='paralysis'&&!v.paralyzed&&!base[v.id].types.includes('electric')&&!(m.type==='grass'&&base[v.id].types.includes('grass'))?15:m.effect==='atkDown'&&v.atkDown===0?11:m.effect==='accuracyDown'&&v.accuracyDown===0?10:m.effect==='slow'&&!v.slowed?13:m.effect==='encore'?(v.lastMoveKey&&!ENCORE_BAD.includes(v.lastMoveKey)&&!(v.effectTimers&&v.effectTimers.encore>0)?12:1):m.effect==='seed'&&!v.seeded&&!base[v.id].types.includes('grass')?11:3;
      score+=useful-1.6*close;
     }
    }
    // Un golpe de área se valora por el resultado combinado en cada objetivo.
    score+=(terrain(pos.x,pos.y)==='F'?2:0)-pos.cost*.3;
    choices.push({pos,index:i,x,y,score});
   }
  }
 }
 // Foco Energía: la IA se concentra (una vez por combate) si tiene PS suficientes y no ve un golpe claramente mejor.
 if(!u.critUp&&u.hp>u.maxHp*.4){
  const fi=u.moves.findIndex(mp=>mp.pp>0&&moveDB[mp.key].effect==='critUp');
  if(fi>=0)choices.push({pos:{x:u.x,y:u.y,cost:0},index:fi,x:u.x,y:u.y,score:32});
 }
 if(!u.moves.some(mp=>mp.pp>0&&moveDB[mp.key].power>0)&&u.defUp<2){const hi=u.moves.findIndex(mp=>mp.pp>0&&moveDB[mp.key].effect==='defUp');if(hi>=0)choices.push({pos:{x:u.x,y:u.y,cost:0},index:hi,x:u.x,y:u.y,score:8})}
 choices.sort((a,b)=>b.score-a.score);
 if(choices.length)return choices[0];
 // Si no hay ataque, avanzar hacia el enemigo accesible más cercano.
 let best=null;
 for(const pos of spots){
  const nearest=Math.min(...enemies.map(v=>distance(pos,v)));
  const score=-nearest+(terrain(pos.x,pos.y)==='F'?.4:0)-pos.cost*.04;
  if(!best||score>best.score)best={pos,score};
 }
 return best?{pos:best.pos,index:-1}:null;
}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let turnBannerTimer=null;
function showTurnBanner(text,kind){const el=$('turnBanner');if(!el)return;el.firstChild.textContent=text;el.className='turnBanner '+kind;el.hidden=false;void el.offsetWidth;el.classList.add('play');clearTimeout(turnBannerTimer);turnBannerTimer=setTimeout(()=>{el.hidden=true},1550)}
async function beginEnemy(){if(phase!=='player'||locked)return;units.forEach(q=>{if(q.side==='player')q.flinch=false});tickTemporaryEffects('player');phase='enemy';selected=null;inspectedEnemy=null;enemyAnalysis=null;closeBattleMenu();skill=null;locked=true;units.filter(u=>u.side==='enemy').forEach(u=>{u.acted=false;u.moved=false});log('🔴 ¡Comienza la fase enemiga!');updateUI();showTurnBanner('TURNO ENEMIGO','enemy');await delay(1100);let foes=units.filter(u=>u.side==='enemy'&&u.hp>0);for(const u of foes){if(phase!=='enemy')return;await delay(420);if(u.hp<=0)continue;if(u.flinch){u.flinch=false;log('😖 '+base[u.id].name+' está amedrentado y pierde su turno.');continue}if(u.asleep>0){u.asleep--;log(u.asleep>0?'💤 '+base[u.id].name+' continúa dormido.':'💤 '+base[u.id].name+' pierde su turno, pero está despertando…');continue}if(u.paralyzed&&Math.random()<.25){log('⚡ '+base[u.id].name+' no pudo moverse por parálisis.');statusEffects.push({x:u.x,y:u.y,label:'⚡ ¡No puede moverse!',color:'#ffe184',kind:'down',start:performance.now()});continue}let plan=aiPlan(u);if(!plan)continue;let aiRoute=routeTo(u,plan.pos.x,plan.pos.y);if(aiRoute&&aiRoute.length>1)await animateMove(u,aiRoute);else await delay(170);if(plan.index>=0){
  // Solo en Pueblo Paleta: el rival principiante tarda una activación en lanzar su primer ataque.
  // Conserva su nivel 5, estadísticas, movimientos y las reglas normales de contraataque.
  if(currentEncounter&&currentEncounter.id==='pallet'&&currentEncounter.kind==='main'&&false){
   currentEncounter.introHesitation=true;
   log('📘 El rival duda un instante antes de atacar. ¡Aprovecha tu turno para tomar la iniciativa!');
  }else{
   locked=false;await perform(u,plan.index,plan.x,plan.y);locked=true;
  }
 }else log('🔴 '+base[u.id].name+' se reposiciona.');await delay(370)}if(phase!=='enemy')return;for(const u of units.filter(v=>v.hp>0)){if(u.burned){let x=Math.max(1,Math.floor(u.maxHp/16));{const _b=u.hp;u.hp=Math.max(0,u.hp-x);creditDamage(u.src_burn,u,_b-u.hp,.5);statusDmgFx(u,_b-u.hp,'🔥','#f0aa76')}log('🔥 '+base[u.id].name+' pierde '+x+' PS por quemadura.')}if(u.trapped){if(u.trapBy&&u.trapBy.hp<=0){u.trapped=false;u.trapBy=null;if(u.effectTimers)u.effectTimers.trap=0;log('🪢 '+base[u.id].name+' se libera: su captor fue debilitado.')}else{let x=Math.max(1,Math.floor(u.maxHp/16));{const _b=u.hp;u.hp=Math.max(0,u.hp-x);creditDamage(u.trapBy,u,_b-u.hp,.5);statusDmgFx(u,_b-u.hp,'🪢','#d09a5a')}log('🪢 '+base[u.id].name+' pierde '+x+' PS por la atadura.')}}if(u.poisoned){let x=Math.max(1,Math.floor(u.maxHp/8));{const _b=u.hp;u.hp=Math.max(0,u.hp-x);creditDamage(u.src_poison,u,_b-u.hp,.5);statusDmgFx(u,_b-u.hp,'☠','#bda0e9')}log('☠️ '+base[u.id].name+' pierde '+x+' PS por veneno.')}if(u.seeded){let x=Math.max(1,Math.floor(u.maxHp/8));const _sb=u.hp;u.hp=Math.max(0,u.hp-x);creditDamage(u.src_seed,u,_sb-u.hp,.5);statusDmgFx(u,_sb-u.hp,'🌱','#a2e2a0');let seedOwner=(u.src_seed&&u.src_seed.hp>0&&u.src_seed.side!==u.side&&units.includes(u.src_seed))?u.src_seed:null;if(seedOwner){const _h0=seedOwner.hp;seedOwner.hp=Math.min(seedOwner.maxHp,seedOwner.hp+x);if(seedOwner.hp>_h0&&units.includes(seedOwner))statusEffects.push({x:seedOwner.x,y:seedOwner.y,label:'💚 +'+(seedOwner.hp-_h0)+' PS',color:'#7cf0a8',kind:'up',start:performance.now()+300})}log('🌱 Drenadoras absorbe '+x+' PS de '+base[u.id].name+'.')}}for(const e of units.filter(x=>x.side==='enemy'&&x.hp===0&&x.dmgBy&&!x.xpGiven)){awardKO(null,e)}try{await processExperience()}catch(_e){}if(checkResult())return;tickTemporaryEffects('enemy');round++;phase='player';locked=false;units.forEach(u=>u.counterUsed=false);units.filter(u=>u.side==='player').forEach(u=>{u.acted=false;u.moved=false});log('🔵 Ronda '+round+'. ¡Tu turno!');showTurnBanner('TURNO JUGADOR · RONDA '+round,'player');for(const q of units.filter(v=>v.side==='player'&&v.hp>0&&v.asleep>0)){q.asleep--;q.acted=true;q.moved=true;log(q.asleep>0?'💤 '+base[q.id].name+' está dormido y pierde su turno.':'💤 '+base[q.id].name+' pierde su turno, pero está despertando…')}for(const q of units.filter(v=>v.side==='player'&&v.hp>0&&v.paralyzed&&!v.acted)){if(Math.random()<.25){q.acted=true;q.moved=true;log('⚡ '+base[q.id].name+' no pudo moverse por parálisis.');statusEffects.push({x:q.x,y:q.y,label:'⚡ ¡No puede moverse!',color:'#ffe184',kind:'down',start:performance.now()+400})}}setTimeout(nextIfAll,900);updateUI();autoSaveSafe()}
async function selectCell(x,y){
    if(phase!=='player'||locked||!inside(x,y))return;
    if(actionMenu)return;
    let target=occupied(x,y);
    if(captureMode&&captureMode.itemId){aimItemOn(target);return}
    if(captureMode){await throwCaptureBall(captureMode.actor,target,captureMode.ballId);return}
    if(selected&&!selected.acted&&skill!==null){
        let m=moveDB[selected.moves[skill].key];
        if(canAim(selected,m,x,y)){
            // táctil: el primer toque muestra el pronóstico y el segundo, sobre la misma casilla, confirma el ataque
            if(matchMedia('(pointer:coarse)').matches){const q=window.__aim2;if(!(q&&q.x===x&&q.y===y&&q.sk===skill&&q.u===selected)){window.__aim2={x,y,sk:skill,u:selected};try{$('attackPrompt').textContent='🎯 '+m.name+' · toca de nuevo para atacar'}catch(e){}return}window.__aim2=null}
            perform(selected,skill,x,y);return}
        log('El objetivo no está en el rango de '+m.name+'.');return;
    }
    if(target&&target.side==='enemy'){
        inspectEnemy(target);return;
    }
    if(target&&target.side==='player'){
        if(target===selected&&!target.acted){openActionMenu();return}
        choose(target);return;
    }
    if(selected&&!selected.moved&&!selected.acted&&!target){
        let path=routeTo(selected,x,y);
        if(path&&path.length>1){
            let u=selected;u.origin={x:u.x,y:u.y};
            await animateMove(u,path);
            log('🔵 '+base[u.id].name+' avanza a ('+(x+1)+','+(y+1)+').');
            if(usingKeyboard){keyboardCursor={x:u.x,y:u.y};hovered={...keyboardCursor}}
            openActionMenu();return;
        }
    }
    if(inspectedEnemy){
        // Cambiar inspección clicando otro enemigo, o seleccionar un aliado.
        log('Puedes examinar otros enemigos o seleccionar un Pokémon de tu equipo.');return;
    }
    if(!selected)log('Selecciona uno de tus Pokémon azules o un enemigo para ver su alcance.');
    else log('Selecciona una casilla azul válida o confirma sobre tu Pokémon para abrir el menú.');
}
function cellAt(ev){
    let r=canvas.getBoundingClientRect();
    return {x:Math.floor((ev.clientX-r.left)/r.width*W),y:Math.floor((ev.clientY-r.top)/r.height*H)};
}
