// ===== v0.8: Guardado seguro y administración =====
function maxDeploy(){return 3+(stageCleared.has('pewter')?1:0)} // la Medalla Roca permite desplegar un miembro más
function partyAll(){return units.filter(u=>u.side==='player').concat(reserves)}
function canPrepare(){
    if(progressIsOpen||cinematicBusy||captureBusy||captureMode||motion||actionMenu||pendingExperience.length||pendingProgress.length)return false;
    if(phase==='win')return true;
    return phase==='player'&&!locked&&round===1&&units.filter(u=>u.side==='player').every(u=>!u.acted&&!u.moved);
}
function canSave(){
    return (phase==='win'||(phase==='player'&&!locked&&!motion&&!cinematicBusy&&!progressIsOpen&&!pendingExperience.length&&!pendingProgress.length&&!actionMenu&&!captureMode&&!captureBusy&&skill===null&&(!selected||!selected.moved)&&units.some(u=>u.side==='player'&&u.hp>0&&!u.acted)));
}
function autoSaveSafe(){if(canSave())saveGame(true)}
function unitSnapshot(u){
    return {shiny:!!u.shiny,id:u.id,side:u.side,x:u.x,y:u.y,level:u.level,ivs:{...normalizeIVs(u.ivs)},hp:u.hp,xp:u.xp,
        moves:u.moves.map(m=>({key:m.key,pp:m.pp})),moved:!!u.moved,acted:!!u.acted,
        atkDown:u.atkDown||0,defUp:u.defUp||0,accuracyDown:u.accuracyDown||0,effectTimers:{...(u.effectTimers||{})},
        paralyzed:!!u.paralyzed,burned:!!u.burned,seeded:!!u.seeded,poisoned:!!u.poisoned,asleep:u.asleep||0,
        slowed:!!u.slowed,trapped:!!u.trapped,critUp:!!u.critUp,counterUsed:!!u.counterUsed,lastEvoOffer:u.lastEvoOffer||0,
        caughtAt:u.caughtAt||null,caughtLevel:u.caughtLevel||null};
}
function restoreUnit(data,side){
    if(!data||!base[data.id]||!Array.isArray(data.moves))throw new Error('Pokémon inválido');
    const level=Math.max(1,Math.min(100,Math.floor(Number(data.level)||1)));
    const keys=data.moves.slice(0,4).filter(m=>m&&moveDB[m.key]).map(m=>m.key);
    if(!keys.length)throw new Error('Movimientos inválidos');
    // Reparación de partidas anteriores: Metapod/Kakuna que solo conocían Fortaleza reciben un ataque para poder combatir
    if((data.id===11||data.id===14)&&keys.length<4&&!keys.some(k=>moveDB[k]&&moveDB[k].power>0))keys.push(data.id===11?'tackle':'poisonsting');
    let x=Number.isInteger(data.x)?data.x:-1,y=Number.isInteger(data.y)?data.y:-1;
    const u=unit(data.id,side,x,y,level,keys,normalizeIVs(data.ivs));
    u.moves=keys.map((key,i)=>{const sv=data.moves[i];return {key,pp:sv&&sv.key===key?Math.max(0,Math.min(moveDB[key].pp,Math.floor(Number(sv.pp)||0))):moveDB[key].pp}});
    u.hp=Math.max(0,Math.min(u.maxHp,Math.floor(Number(data.hp)||0)));u.asleep=Math.max(0,Math.min(4,Math.floor(Number(data.asleep)||0)));
    u.xp=Math.max(0,Math.min(xpRequired(u.level,u.id)-1,Math.floor(Number(data.xp)||0)));
    ['moved','acted','paralyzed','burned','seeded','poisoned','slowed','trapped','critUp','counterUsed'].forEach(k=>u[k]=!!data[k]);
    ['atkDown','accuracyDown','lastEvoOffer'].forEach(k=>u[k]=Math.max(0,Math.min(100,Math.floor(Number(data[k])||0))));u.defUp=Math.max(-3,Math.min(3,Math.floor(Number(data.defUp)||0)));u.atkDown=Math.max(-3,Math.min(3,Math.floor(Number(data.atkDown)||0)));
    const oldTimers={slow:u.slowed?2:0,atkDown:u.atkDown?2:0,defUp:u.defUp?2:0,accuracyDown:u.accuracyDown?2:0,trap:u.trapped?2:0,seed:u.seeded?2:0};
    u.effectTimers={};for(const k of EFFECT_KEYS){
      const raw=data.effectTimers&&Number(data.effectTimers[k]);
      u.effectTimers[k]=Number.isFinite(raw)?Math.max(0,Math.min(5,Math.floor(raw))):oldTimers[k];
    }
    if(!u.effectTimers.slow)u.slowed=false;
    if(!u.effectTimers.trap)u.trapped=false;
    if(!u.effectTimers.atkDown)u.atkDown=0;
    if(!u.effectTimers.defUp)u.defUp=0;
    if(!u.effectTimers.accuracyDown)u.accuracyDown=0;
    // Los guardados antiguos no contienen estos metadatos; son opcionales.
    u.shiny=!!data.shiny;
    u.caughtAt=typeof data.caughtAt==='string'?data.caughtAt.slice(0,70):null;
    u.caughtLevel=Number.isInteger(data.caughtLevel)?Math.max(1,Math.min(100,data.caughtLevel)):null;
    return u;
}
function makeSave(){
    return {schema:15,starterChoice,game:'pokemon-tactics-gba',savedAt:new Date().toISOString(),
        chapter:stageId,unlocked:stageUnlocked,cleared:[...stageCleared],optionalCleared:[...optionalCleared],dexSeen:[...dexSeen],dexCaught:[...dexCaught],encounter:currentEncounter,phase,round,wins,thunderStones,money,moneyPaid:[...moneyPaid],bag:{...bag},fm:1,rod:fishRods,ro:1,r3:1,mj:1,mc:1,cr:1,nb:1,r25:1,r6:1,fo:fossilChoice||'',fr:fossilRevived?1:0,tc:window.__tutCT||0,animationEnabled,
        storageBox:storageBox.map(unitSnapshot),
        party:units.filter(u=>u.side==='player').map(unitSnapshot),
        reserves:reserves.map(unitSnapshot),
        enemies:units.filter(u=>u.side==='enemy').map(unitSnapshot)};
}
function readSave(){try{const v=localStorage.getItem(SAVE_KEY);return v?JSON.parse(v):null}catch(e){return null}}
function saveGame(silent=false){
    if(!canSave()){if(!silent)notifySave('Termina primero la animación, el movimiento o la fase actual.');return false}
    try{const payload=makeSave();localStorage.setItem(SAVE_KEY,JSON.stringify(payload));lastSaveStamp=payload.savedAt;$('saveStatus').textContent='✓ Partida guardada · '+new Date(payload.savedAt).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});updateManagementSummary();if(!silent)notifySave('✓ Partida guardada en este navegador.');return true}
    catch(e){if(!silent)notifySave('No se pudo guardar localmente. Usa Exportar JSON.');return false}
}
function notifySave(message){$('saveStatus').textContent=message;let p=$('saveDetails');if(p)p.textContent=message;log('💾 '+message)}
function updateManagementSummary(){
    if(!$('partyCount'))return;
    $('partyCount').textContent=partyAll().length+'/6 · '+storageBox.length+' en Caja';
    $('quickSave').disabled=!canSave();
    $('exportSave').disabled=!canSave();
    if(managerTab==='team'&&!$('managerOverlay').hidden)renderTeam();
    
}
function validateSave(data){
    if(!data||![8,9,10,11,12,13,14,15].includes(data.schema)||data.game!=='pokemon-tactics-gba'||!Array.isArray(data.party)||(data.party.length<1||data.party.length>4)||!Array.isArray(data.reserves)||data.reserves.length>3||!Array.isArray(data.enemies)||data.enemies.length>4||(data.schema>=12&&(!Array.isArray(data.storageBox)||data.storageBox.length>BOX_CAPACITY))||!['player','win'].includes(data.phase))throw new Error('Archivo de guardado incompatible.');
    if(data.party.length+data.reserves.length>6)throw new Error('Equipo demasiado grande.');
    const friends=data.party.map(row=>restoreUnit(row,'player'));
    const foes=data.enemies.map(row=>restoreUnit(row,'enemy'));
    const bench=data.reserves.map(row=>restoreUnit(row,'player'));
    const captured=(data.storageBox||[]).map(row=>restoreUnit(row,'player'));
    for(const u of captured){u.x=-1;u.y=-1}
    // v0.51: los mapas nuevos tienen bordes de árboles; si un guardado antiguo deja a alguien sobre un obstáculo, se le acerca a la casilla libre más cercana.
    {const used=new Set([...friends,...foes].filter(u=>u.hp>0&&inside(u.x,u.y)&&terrain(u.x,u.y)!=='X').map(u=>u.x+','+u.y));
     for(const u of [...friends,...foes]){
        if(inside(u.x,u.y)&&terrain(u.x,u.y)==='X'){
          let best=null,bd=1e9;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(terrain(x,y)==='X'||terrain(x,y)==='~'||used.has(x+','+y))continue;const d=Math.abs(x-u.x)+Math.abs(y-u.y);if(d<bd){bd=d;best={x,y}}}
          if(best){u.x=best.x;u.y=best.y;used.add(best.x+','+best.y)}}}}
    if(friends.some(u=>!inside(u.x,u.y))||foes.some(u=>!inside(u.x,u.y))||friends.some(u=>terrain(u.x,u.y)==='X')||foes.some(u=>terrain(u.x,u.y)==='X'))throw new Error('Casillas del guardado inválidas.');
    // Si dos Pokémon quedaron en la misma casilla (guardado dañado), se reubica al segundo en la casilla libre más cercana en vez de rechazar la partida.
    const loc=new Set();for(const u of [...friends,...foes].filter(u=>u.hp>0)){let k=u.x+','+u.y;
        if(loc.has(k)){let best=null,bd=1e9;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tt=terrain(x,y);if(tt==='X'||tt==='~'||loc.has(x+','+y))continue;const d=Math.abs(x-u.x)+Math.abs(y-u.y);if(d<bd){bd=d;best={x,y}}}
            if(!best)throw new Error('Dos Pokémon comparten casilla.');u.x=best.x;u.y=best.y;k=u.x+','+u.y}
        loc.add(k)}
    return {friends,foes,bench,captured};
}
function restoreSave(data){exitCamp();window.__tutCT=data&&data.tc!=null?data.tc:undefined;if(data&&!data.ro){if(data.chapter==='route2')data.chapter='route2in';if(data.encounter&&data.encounter.id==='route2')data.encounter=Object.assign({},data.encounter,{id:'route2in'})}
    setupTerrain(data.schema>=9&&CAMPAIGN[data.chapter]?data.chapter:'forest');
    const restored=validateSave(data);
    units=[...restored.friends,...restored.foes];reserves=restored.bench;storageBox=restored.captured;starterChoice=data.schema>=14&&[1,4,7].includes(data.starterChoice)?data.starterChoice:null;
    if(data.schema<10){for(const u of [...units,...reserves])u.moves=movesForLevel(u.id,u.level).map(key=>({key,pp:moveDB[key].pp}));}
    bag={potion:0,superPotion:0,revive:0,ether:0,antidote:0,parlyz:0,pokeball:0,greatball:0,ultraball:0};
    for(const k of Object.keys(bag))bag[k]=Math.max(0,Math.min(99,Math.floor(Number((data.bag||{})[k])||0)));
    if(data.schema<12){bag.pokeball=18;bag.greatball=6;bag.ultraball=3}
    fossilChoice=['helix','dome'].includes(data.fo)?data.fo:null;fossilRevived=!!data.fr;fishRods=Math.max(0,Math.min(3,data.rod|0));pendingFossil=false;
    thunderStones=Math.max(0,Math.min(99,Math.floor(Number(data.thunderStones)||0)));
    money=Math.max(0,Math.min(999999,Math.floor(Number(data.money)||0)));moneyPaid=new Set((Array.isArray(data.moneyPaid)?data.moneyPaid:[]).filter(id=>CAMPAIGN[id]));
    if(data.schema>=13){
      stageCleared=new Set((data.cleared||[]).filter(id=>STAGE_ORDER.includes(id)));
      optionalCleared=new Set((data.optionalCleared||[]).filter(id=>id==='route22'));
      dexSeen=new Set((Array.isArray(data.dexSeen)?data.dexSeen:[]).map(Number));dexCaught=new Set((Array.isArray(data.dexCaught)?data.dexCaught:[]).map(Number));
      stageUnlocked=Math.max(0,Math.min(STAGE_ORDER.length-1,Math.floor(Number(data.unlocked)||0)));
      // Guardados anteriores a v0.26: Gymguard (indice 5) y Brock (indice 6)
      // pasan a indices 6 y 7. Respetar progreso; no obligar a repetir partes superadas.
      if(data.schema<15){
        const oldGymIndex=5;
        if(stageUnlocked>=oldGymIndex)stageUnlocked=Math.min(STAGE_ORDER.length-1,stageUnlocked+1);
        if(stageCleared.has('forest')&&(stageUnlocked>=STAGE_ORDER.indexOf('gymguard')||stageCleared.has('gymguard')||stageCleared.has('pewter'))){
          stageCleared.add('forestexit');
        }
      }
      if(!data.fm&&stageCleared.has('forestexit')){stageCleared.add('forestdoug');stageUnlocked=Math.min(STAGE_ORDER.length-1,stageUnlocked+1)}
      if(!data.mj){if(stageCleared.has('mtmoon'))stageCleared.add('mtmoonj');stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.mc){if(stageCleared.has('mtmoonb'))stageCleared.add('mtmoonc');stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.r6){if(stageCleared.has('route6')){stageCleared.add('route6b');stageCleared.add('route6c')}stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.r25){stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.nb){stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.cr){if(stageCleared.has('ceruleanguard')||stageCleared.has('cerulean'))stageCleared.add('ceruleanrival');stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.r3){if(stageCleared.has('route3'))stageCleared.add('route3b');stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
      if(!data.ro){if(stageCleared.has('route2')){stageCleared.add('route2in');if(!stageCleared.has('forestexit'))stageCleared.delete('route2')}stageUnlocked=0;while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++}
    }else{
      // Compatibilidad: v0.19 comenzaba en Ruta 1 y aún no tenía Pueblo Paleta, Ciudad Verde ni Campista Liam.
      const oldCleared=new Set(Array.isArray(data.cleared)?data.cleared:[]);
      stageCleared=new Set(['pallet','viridian',...([...oldCleared].filter(id=>STAGE_ORDER.includes(id)))]);
      if(oldCleared.has('forest')||oldCleared.has('pewter'))stageCleared.add('gymguard');
      if(oldCleared.has('forest')||oldCleared.has('gymguard')||oldCleared.has('pewter'))stageCleared.add('forestexit');
      if(stageCleared.has('forestexit')){stageCleared.add('forestdoug')}
      if(stageCleared.has('route2')){stageCleared.add('route2in');if(!stageCleared.has('forestexit'))stageCleared.delete('route2')}
      optionalCleared=new Set();
      stageUnlocked=0;
      while(stageUnlocked<STAGE_ORDER.length-1&&stageCleared.has(STAGE_ORDER[stageUnlocked]))stageUnlocked++;
      if(data.unlocked>=3)stageUnlocked=Math.max(stageUnlocked,STAGE_ORDER.indexOf('gymguard'));
    }
    if(stageCleared.has('pewter'))stageUnlocked=Math.max(stageUnlocked,STAGE_ORDER.indexOf('route3'));
    campaignViewed=Math.max(0,Math.min(DEVU?STAGE_ORDER.length-1:stageUnlocked,STAGE_ORDER.indexOf(stageId)<0?0:STAGE_ORDER.indexOf(stageId)));
    updateBadgeUI();
    currentEncounter=data.schema>=9&&data.encounter?data.encounter:{id:'forest',kind:'main',story:true,name:'Bosque Verde'};battleBackup=null;map=frlgTerrain(stageId)||map;
    round=Math.max(1,Math.min(9999,Math.floor(Number(data.round)||1)));
    wins=Math.max(0,Math.min(9999,Math.floor(Number(data.wins)||0)));
    animationEnabled=data.animationEnabled!==false;
    $('toggleAnimations').textContent='Animaciones: '+(animationEnabled?'ACTIVADAS':'DESACTIVADAS');
    phase=data.phase;locked=phase==='win';selected=null;inspectedEnemy=null;enemyAnalysis=null;
    closeBattleMenu();skill=null;captureMode=null;captureBusy=false;$('captureScene').hidden=true;hovered=null;usingKeyboard=false;mouseOnBoard=false;motion=null;reviveEffect=null;
    pendingProgress=[];pendingExperience=[];progressIsOpen=false;
    hideCinematic();$('expScene').hidden=true;$('modal').hidden=true;$('managerOverlay').hidden=true;$('gameBag').hidden=true;managerTab=null;
    $('log').replaceChildren();log('📂 Partida recuperada. '+CAMPAIGN[stageId].name+' · Ronda '+round+'.');
    log('🐾 Equipo recuperado: '+partyAll().length+' Pokémon · '+wins+' victoria(s).');
    lastSaveStamp=data.savedAt||null;
    updateUI();
    if(phase==='win'){currentEncounter=null;showCampaign(campaignViewed)}
    if($('titleOverlay'))$('titleOverlay').hidden=true;
    return true;
}
function loadGame(){
    const data=readSave();if(!data){notifySave('No hay un guardado local. Prueba Importar JSON.');return}
    try{restoreSave(data)}catch(e){notifySave('No se pudo cargar: '+e.message)}
}
function exportGame(){
    if(!canSave()){notifySave('Solo puedes exportar cuando la batalla está en una pausa segura.');return}
    try{
        const data=JSON.stringify(makeSave(),null,2);
        const url=URL.createObjectURL(new Blob([data],{type:'application/json;charset=utf-8'}));
        const a=document.createElement('a');a.href=url;a.download='pokemon-tactics-partida-v26.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
        notifySave('✓ Copia de seguridad JSON preparada.');
    }catch(e){notifySave('No se pudo exportar: '+e.message)}
}
function importGame(){
    if(locked||progressIsOpen||motion||cinematicBusy||actionMenu){notifySave('Espera al final de esta acción para importar.');return}
    $('saveUpload').value='';$('saveUpload').click();
}
$('saveUpload').addEventListener('change',async e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    try{
        if(file.size>500000)throw new Error('Archivo demasiado grande.');
        const data=JSON.parse(await file.text());validateSave(data);
        const doImport=()=>{try{restoreSave(data);saveGame(true);notifySave('✓ Partida importada desde JSON.')}catch(err){notifySave('Error al importar: '+err.message)}};
        if(phase!=='intro'){askConfirm('¿CARGAR PARTIDA?','Se sustituirá la sesión actual por la partida importada.','SÍ, CARGAR',doImport);return}
        doImport();
    }catch(err){notifySave('Error al importar: '+err.message)}
});

