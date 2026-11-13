// Cálculo y animación separados: todas las cantidades de daño que muestra la escena
// coinciden con la resolución real del tablero. No se adelanta ningún resultado visual.
async function perform(u,index,x,y){
    if(locked||cinematicBusy||u.acted||u.hp<=0)return;
    if(u.side==='player'&&moveDB[u.moves[index].key].power>0)window.__mcAttacked=true; // v652: para el tutorial móvil
    if(u.flinch){u.flinch=false;u.acted=true;u.moved=true;selected=null;closeBattleMenu();skill=null;log('😖 '+base[u.id].name+' está amedrentado y pierde su acción.');updateUI();if(u.side==='player')nextIfAll();return}
    if(u.asleep>0){u.asleep--;u.acted=true;u.moved=true;selected=null;closeBattleMenu();skill=null;log('💤 '+base[u.id].name+' sigue dormido y pierde su acción.');updateUI();if(u.side==='player')nextIfAll();return}
    {const _L=encoreLock(u);if(_L&&u.moves[index].key!==_L){if(u.side==='player'){log('🔁 '+base[u.id].name+' está bajo Otra Vez y solo puede usar '+moveDB[_L].name+'.');return}index=u.moves.findIndex(q=>q.key===_L)}}
    const mp=u.moves[index],m=moveDB[mp.key];u.lastMoveKey=mp.key;u.raging=(mp.key==='rage'||mp.key==='ragemove');
    if(!mp.pp||!canAim(u,m,x,y))return;
    const targets=aimTargets(u,m,x,y);
    if(m.shape!=='self'&&!targets.length){
        if(u.side==='player')log('✋ No hay enemigos en la zona seleccionada.');return;
    }
    playSfx(m.category==='status'?'status':'attack');locked=true;mp.pp--;syncAttackBack(); // oculta «Volver»/aviso de objetivo en cuanto empieza la acción
    let lines=[],events=[],hitCount=0,appliedStatuses=[];
    for(const v of targets){
        const before=v.hp;
        const hit=Math.random()*100<=Math.max(0,m.acc-u.accuracyDown*18);
        if(!hit){
            lines.push(base[v.id].name+' esquivó el ataque.');
            events.push({attacker:u,target:v,move:m,from:u.hp,to:u.hp,defBefore:before,defAfter:before,damage:0,critical:false,miss:true,status:m.power===0,foe:v!==u?v:(opponent(u).find(o=>o.hp>0)||null)});
        }else{
        const immunity=effect(m.type,base[v.id].types)===0;
        if(m.power){
            const crit=!immunity && Math.random()<(u.critUp?(m.hcrit?1/3:1/4):(m.hcrit?1/8:1/16));if(crit)playSfx('critical');v._critHit=crit; // v651: un crítico asegura el envenenamiento del golpe
            let points=0,nHits=1;const _hb=v.hp;
            if(m.multi){const r=Math.random();nHits=m.multi[0]===m.multi[1]?m.multi[0]:(r<.375?2:r<.75?3:r<.875?4:5);
                for(let h=0;h<nHits&&v.hp>0;h++){const p=damage(u,v,m,true,crit&&h===0);points+=p;v.hp=Math.max(0,v.hp-p);if(v.hp===0)nHits=h+1}}
            else{points=damage(u,v,m,true,crit);v.hp=Math.max(0,v.hp-points)}
            creditDamage(u,v,_hb-v.hp,1);
            hitCount++;if(v.raging&&v.hp>0&&points>0){v.atkDown=Math.max(-3,Math.min(0,v.atkDown||0)-1);startTemporaryEffect(v,'atkDown');appliedStatuses.push({unit:v,effect:'atkUp'});lines.push('😡 ¡'+base[v.id].name+' acumula furia! Ataque ↑')}
            const eff=effect(m.type,base[v.id].types);
            events.push({attacker:u,target:v,move:m,from:u.hp,to:u.hp,defBefore:before,defAfter:v.hp,damage:points,critical:crit,miss:false,eff,hits:nHits});
            lines.push((crit?'💥 ¡GOLPE CRÍTICO! ':'')+(nHits>1?'¡Golpeó '+nHits+' veces! ':'')+base[v.id].name+' recibe '+points+' PS'+(!animationEnabled?(eff>1?' (¡supereficaz!)':eff===0?' (inmune)':eff<1?' (poco eficaz)':''):'')+'.');
            if(m.effect==='drain'&&points>0){const recovered=Math.max(1,Math.floor(points/2));const healed=Math.min(u.maxHp,u.hp+recovered)-u.hp;u.hp=Math.min(u.maxHp,u.hp+recovered);events[events.length-1].heal=healed;lines.push('🌿 '+base[u.id].name+' recupera '+recovered+' PS.')}if(v.hp===0){lines.push('💫 '+base[v.id].name+' fue debilitado.');awardKO(u,v)}
        }else{
            if(immunity){lines.push(base[v.id].name+' es inmune.');continue}
            hitCount++;const noEff=m.power===0&&(grassPowderImmune(m,v)||(m.effect==='poison'&&base[v.id].types.some(t=>t==='poison'||t==='steel'))||(m.effect==='seed'&&base[v.id].types.includes('grass'))||(m.effect==='paralysis'&&(base[v.id].types.includes('electric')||(m.type==='grass'&&base[v.id].types.includes('grass')))));events.push({attacker:u,target:v,move:m,from:u.hp,to:u.hp,defBefore:before,defAfter:before,damage:0,critical:false,miss:false,status:true,noEffect:noEff,foe:v!==u?v:(opponent(u).find(o=>o.hp>0)||null)});const result=noEff?'':applyEffect(u,v,m);lines.push(noEff?'🚫 El ataque no afecta a '+base[v.id].name+'.':base[v.id].name+result);if(result&&!result.includes('Ya estaba')&&!result.includes('falló'))appliedStatuses.push({unit:v,effect:m.effect});
        }
        if(m.effect==='atkUp10'&&m.power&&!immunity&&u.hp>0&&Math.random()<.1){u.atkDown=Math.max(-3,Math.min(0,u.atkDown||0)-1);startTemporaryEffect(u,'atkDown');lines.push(' ⚔ ¡'+base[u.id].name+' sube su Ataque! (×1,5 durante 2 turnos)');appliedStatuses.push({unit:u,effect:'atkUp'})}
        if(v.hp>0&&m.power&&!immunity&&(m.effect&&m.effect!=='drain'&&m.effect!=='atkUp10')){const extra=applyEffect(u,v,m);v._critHit=false;if(extra){lines.push(extra);appliedStatuses.push({unit:v,effect:m.effect})}}
        }
        // En un RPG tactico el contraataque depende del alcance, no de que el golpe inicial acierte.
        // Un defensor vivo puede responder una vez por ronda si dispone de un ataque ofensivo con PP.
        if(m.power&&v.hp>0&&u.hp>0){ // sin límite de contraataques: responde a cada golpe si alcanza al atacante y tiene PP
            const retaliate=v.moves.find(item=>{const cm=moveDB[item.key];return item.pp>0&&cm.power>0&&cm.shape!=='area'&&canAim(v,cm,u.x,u.y)});
            if(retaliate){
                const cm=moveDB[retaliate.key];v.counterUsed=true;retaliate.pp--;
                const aliveBefore=u.hp;
                const counterHit=Math.random()*100<=Math.max(0,cm.acc-v.accuracyDown*18);
                if(counterHit){
                    const counterCrit=Math.random()<1/16;
                    const counterEff=effect(cm.type,base[u.id].types);const counterDamage=counterEff===0?0:Math.max(1,Math.floor(damage(v,u,cm,true,counterCrit,true)*(v.side==='player'?COUNTER_PLAYER:COUNTER_ENEMY)));
                    {const _cb=u.hp;u.hp=Math.max(0,u.hp-counterDamage);creditDamage(v,u,_cb-u.hp,1)}
                    events.push({attacker:v,target:u,move:cm,from:v.hp,to:v.hp,defBefore:aliveBefore,defAfter:u.hp,damage:counterDamage,critical:counterCrit,miss:false,counter:true,eff:counterEff});
                    lines.push('↩ '+base[v.id].name+' contraataca con '+cm.name+' ('+counterDamage+' PS)'+(counterCrit?' ¡CRÍTICO!':'')+(!animationEnabled?(counterEff>1?' ¡Es supereficaz!':counterEff===0?' No tiene efecto.':counterEff<1?' No es muy eficaz.':''):'')+'.');
                    if(u.hp===0){lines.push('💫 '+base[u.id].name+' fue debilitado.');awardKO(v,u)}
                }else{
                    events.push({attacker:v,target:u,move:cm,from:v.hp,to:v.hp,defBefore:aliveBefore,defAfter:aliveBefore,damage:0,critical:false,miss:true,counter:true});
                    lines.push('↩ '+base[v.id].name+' falló su contraataque.');
                }
            }
        }
    }
    // La cámara cubre el mapa hasta que terminan todas las animaciones.
    let cinematicShown=false;
    if(animationEnabled&&events.length){
        try{await showCinematic(events);cinematicShown=true}catch(err){console.error('Error en secuencia de batalla',err);hideCinematic()}
    }
    if(appliedStatuses.length){for(const a of appliedStatuses)queueStatusVisual(a.unit,a.effect);await delay(1050)}
    if(!cinematicShown)await showEffectiveness(events);
    log((u.side==='player'?'🔵 ':'🔴 ')+base[u.id].name+' usa '+m.name+'. '+lines.join(' '));
    u.acted=true;u.moved=true;selected=null;inspectedEnemy=null;enemyAnalysis=null;
    closeBattleMenu();skill=null;movedFrom=null;
    // La EXP se anima DESPUÉS de la cinemática y ANTES de ceder el turno.
    await processExperience();
    locked=false;updateUI();
    if(checkResult())return;
    if(pendingProgress.length){
        locked=true;updateUI();
        await new Promise(done=>resolveProgress(done));
        locked=false;updateUI();
    }
    if(u.side==='player')nextIfAll();
    autoSaveSafe();
}

function checkResult(){
 const own=units.some(u=>u.side==='player'&&u.hp>0),rival=units.some(u=>u.side==='enemy'&&u.hp>0);
 if(own&&rival)return false;
 const tutorialLoss=!own&&currentEncounter&&currentEncounter.id==='pallet'&&currentEncounter.kind==='main';
 phase=(own||tutorialLoss)?'win':'lose';locked=true;
 if(own){playSfx('win');wins++;completeCampaignEncounter();saveGame(true)}
 if(tutorialLoss){
  // Igual que el primer combate de Kanto, perder este duelo de práctica no bloquea la aventura.
  stageCleared.add('pallet');
  stageUnlocked=Math.max(stageUnlocked,STAGE_ORDER.indexOf('route1'));
  campaignViewed=STAGE_ORDER.indexOf('route1');
  log('📖 El rival ganó este duelo de práctica, pero puedes continuar hacia Ruta 1.');
  saveGame(true);
 }
 updateUI();
 setTimeout(()=>{
  if(own){showVictory();return}
  if(tutorialLoss){
   showModal('¡TU AVENTURA COMIENZA!','El rival ganó este duelo de práctica. ¡No pasa nada! El Profesor Oak te anima a seguir hacia Ruta 1. Puedes volver a desafiar a tu rival si lo deseas. Tu Pokémon se recuperará antes del próximo encuentro.','📗 🌱 🔥 💧',[
    {text:'🗺️ CONTINUAR A RUTA 1',fn:()=>showCampaign(STAGE_ORDER.indexOf('route1'))},
    {text:'VOLVER A INTENTAR',fn:retryCampaignEncounter}
   ]);return;
  }
  showModal('DERROTA','Tu equipo ha quedado debilitado. Puedes reintentar el encuentro sin perder tu progreso anterior.','🔴 🪨 💧',[{text:'REINTENTAR',fn:retryCampaignEncounter},{text:'VER MAPA',fn:()=>{phase='win';showCampaign()}}]);
 },850);
 return true;
}
function showModal(title,msg,art,buttons){document.querySelectorAll('#modal .modalX').forEach(e=>e.remove());setTimeout(()=>pmdFill($('modalArt')),0);$('modalTitle').textContent=title;$('modalMessage').textContent=msg;$('modalArt').innerHTML='';if(typeof art==='string'&&art.charAt(0)==='<')$('modalArt').innerHTML=art;else $('modalArt').textContent=art;$('modalButtons').classList.remove('victoryActions');$('modalButtons').innerHTML='';for(const b of buttons){let el=document.createElement('button');el.className='rbtn main';el.textContent=b.text;el.disabled=!!b.disabled;if(b.hint)el.title=b.hint;if(!b.disabled)el.onclick=b.fn;$('modalButtons').append(el)}$('modal').hidden=false}
function showVictory(){
    resolveProgress(()=>{
       if(pendingFossil){showFossilChoice();return}
       const isStory=currentEncounter&&currentEncounter.story;
       const what=CAMPAIGN[stageId],optional=currentEncounter&&currentEncounter.optional;
       const index=STAGE_ORDER.indexOf(stageId);
       // Ruta 22 es opcional: continuar desde allí lleva al próximo tramo pendiente.
       let nextIndex=optional?Math.min(STAGE_ORDER.length-1,STAGE_ORDER.indexOf('viridian')+1):index+1;
       // Al repetir un entrenamiento opcional también ofrecemos continuar a la próxima etapa desbloqueada.
       if(!isStory&&index>=0)nextIndex=index+1;
       const nextAvailable=nextIndex>=0&&nextIndex<STAGE_ORDER.length&&nextIndex<=stageUnlocked;
       const goNext=()=>{
          if(!nextAvailable){showCampaign();return}
          // Si el siguiente entrenador ya fue derrotado (no se repite), salta al próximo desafío disponible o abre el mapa.
          let t=nextIndex;
          while(t<STAGE_ORDER.length&&t<=stageUnlocked&&trainerLocked(STAGE_ORDER[t])&&stageCleared.has(STAGE_ORDER[t]))t++;
          if(t>stageUnlocked||t>=STAGE_ORDER.length){showCampaign(Math.min(stageUnlocked,STAGE_ORDER.length-1));return}
          beginCampaignEncounter(STAGE_ORDER[t],'main');
       };
       const isBrock=stageId==='pewter'&&stageCleared.has('pewter'),isMisty=stageId==='cerulean'&&stageCleared.has('cerulean'),isSurge=stageId==='vermilion'&&stageCleared.has('vermilion');
       showModal(isBrock?'🏅 ¡CONSEGUISTE LA MEDALLA ROCA!':isMisty?'🏅 ¡CONSEGUISTE LA MEDALLA CASCADA!':isSurge?'🏅 ¡CONSEGUISTE LA MEDALLA TRUENO!':'¡VICTORIA EN '+what.name.toUpperCase()+'!',
          isStory?(isBrock?'¡Brock ha sido derrotado! Obtienes la primera medalla de Kanto: la Medalla Roca. ¡Ahora puedes llevar un cuarto Pokémon al tablero (Equipo → Desplegar)! Se abrió el camino a la Ruta 3, rumbo a Ciudad Celeste.':isMisty?'¡Misty ha sido derrotada! Obtienes la segunda medalla de Kanto: la Medalla Cascada. El camino sigue: visita a Bill en la Ruta 25 y luego baja por la Ruta 5 hacia Ciudad Carmín.':isSurge?'¡El Teniente Surge ha sido derrotado! Obtienes la tercera medalla de Kanto: la Medalla Trueno. Por ahora el viaje termina aquí; puedes regresar a entrenar y capturar.':optional?'¡Venciste a tu rival en Ruta 22! Ya puedes entrenar y capturar Pokémon salvajes en esta ruta.':'¡Desafío completado! Se desbloqueó el entrenamiento de esta zona y la siguiente ubicación.'):'¡Encuentro de entrenamiento completado! Puedes volver al mapa para elegir otro destino.',
          isBrock?'🏅 🪨 ✨':isMisty?'🏅 💧 ✨':isSurge?'🏅 ⚡ ✨':what.icon+' 🏆',[
             {text:'🗺️ VOLVER AL MAPA',fn:()=>showCampaign()},
             {text:'ETAPA SIGUIENTE',fn:goNext,disabled:!nextAvailable,hint:!nextAvailable?'El siguiente capítulo todavía no está disponible.':''},
             ...((isStory&&trainerLocked(stageId))?[]:[{text:'REPETIR',fn:retryCampaignEncounter}]),
             {text:'🐾 EDITAR EQUIPO',fn:()=>{$('modal').hidden=true;openManager('team')}}
          ]);
       if(rewardNote)$('modalMessage').textContent+=rewardNote;
       $('modalButtons').classList.add('victoryActions');
       log('🏆 Victoria en '+what.name+'.');saveGame(true);
    });
}
function rematch(){retryCampaignEncounter()}
function reachableSpots(u){let d=reachableEnd(u),spots=[{x:u.x,y:u.y,cost:0}];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d[y][x]<Infinity&&!(x===u.x&&y===u.y)&&!occupied(x,y)){spots.push({x,y,cost:d[y][x]})}return spots}
