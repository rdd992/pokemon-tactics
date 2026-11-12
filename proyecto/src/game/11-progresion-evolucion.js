// Progresión: diferencia entre dos niveles de experiencia acumulada.
// Pikachu: grupo Medio Rápido. Iniciales de Kanto: Medio Lento (parabólico).
// Resto del elenco de prueba utiliza Medio Lento; ampliar por especie con PokéAPI.
function cumulativeExperience(level,id){
    const n=Math.max(1,Math.min(100,level));
    if(id===25||id===26)return n*n*n;
    return Math.max(0,Math.floor(6*n*n*n/5-15*n*n+100*n-140));
}
function xpRequired(level,id){
    if(level>=100)return 1;
    return Math.max(1,cumulativeExperience(level+1,id)-cumulativeExperience(level,id));
}
function levelUp(u){
    if(u.level>=100)return;
    const oldHp=u.maxHp;
    u.level++;
    statCalc(u);
    u.hp=Math.min(u.maxHp,u.hp+u.maxHp-oldHp);
    log('🌟 ¡'+base[u.id].name+' alcanzó el nivel '+u.level+'!');
    for(const row of (learnsets[u.id]||[])){
        if(row.level===u.level&&!u.moves.some(z=>z.key===row.key))pendingProgress.push({kind:'learn',u,key:row.key});
    }
    const evo=evolutionRules[u.id];
    if(evo&&evo.level&&u.level>=evo.level&&u.lastEvoOffer!==u.level){
        u.lastEvoOffer=u.level;
        pendingProgress.push({kind:'evolve',u,to:evo.to,reason:'Nivel '+evo.level});
    }
}
function gainExperience(u,earned){
    if(!u||u.side!=='player'||u.level>=100)return;
    u.xp+=Math.max(0,Math.floor(earned));
    log('✨ '+base[u.id].name+' gana '+earned+' EXP.');
    while(u.level<100&&u.xp>=xpRequired(u.level,u.id)){
        u.xp-=xpRequired(u.level,u.id);
        levelUp(u);
    }
    if(u.level>=100)u.xp=0;
    updateUI();
}
function creditDamage(att,v,amount,weight){
    if(!att||att.side!=='player'||!v||v.side!=='enemy'||!(amount>0))return;
    v.dmgBy=v.dmgBy||new Map();v.dmgBy.set(att,(v.dmgBy.get(att)||0)+amount*weight);
}
function awardKO(attacker,v){
    // EXP repartida a partes iguales entre los Pokémon que participaron (hicieron daño, aunque sea con un solo golpe o por estados), como en el juego original.
    if(!v||v.xpGiven)return;v.xpGiven=true;
    const map=new Map(v.dmgBy||[]);
    if(attacker&&attacker.side==='player'&&!map.size)map.set(attacker,1);
    const part=[...map.entries()].filter(([p,w])=>p.side==='player'&&p.hp>0&&p.level<100&&units.includes(p)&&w>0);
    if(!part.length)return;
    const expBase={7:66,16:55,74:60,25:82,4:65,1:64};
    const baseValue=expBase[v.id]||60;
    const trainerFight=!!currentEncounter&&currentEncounter.kind==='main'&&isTrainerKind((CAMPAIGN[currentEncounter.id]||{}).mainKind);
    const trainFight=!!currentEncounter&&currentEncounter.kind==='wild';
    const total=Math.max(1,Math.floor(baseValue*v.level/7*(trainerFight?1.5:1.25)));
    for(const e of part)e[1]=1;
    const sum=part.length;
    if(part.length>1)log('🤝 La experiencia se reparte a partes iguales: '+part.map(([p,w])=>base[p.id].name+' '+Math.round(100*w/sum)+'%').join(' · ')+'.');
    for(const [p,w] of part)pendingExperience.push({u:p,earned:Math.max(1,Math.floor(total*w/sum)),bonus:trainerFight});
}
function updateExpPanel(u,remaining){
    $('expPokemon').textContent=base[u.id].name.toUpperCase();
    $('expLevel').textContent='Nv. '+u.level;
    $('expCounter').textContent=u.xp+' / '+xpRequired(u.level,u.id);
    $('expFill').style.width=(u.level>=100?100:100*u.xp/xpRequired(u.level,u.id))+'%';
    if(remaining!==undefined)$('expEarned').textContent='+'+remaining+' EXP';
}
function expPause(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function displayExperience(u,earned,bonus){
    if(!u||u.side!=='player'||u.level>=100)return;
    const icon=$('expIcon'),img=sprites[u.id];
    icon.replaceChildren();
    icon.append(pmdAnimCanvas(u.id,52));
    $('expScene').hidden=false;
    $('expLevelMsg').textContent='';
    updateExpPanel(u,earned);
    await expPause(240);
    let remain=earned;
    log('✨ '+base[u.id].name+' gana '+earned+' EXP por derrotar a su rival'+''+'.');
    while(remain>0&&u.level<100){
        const needed=xpRequired(u.level,u.id);
        const portion=Math.min(remain,needed-u.xp);
        const startXp=u.xp;
        const endXp=startXp+portion;
        const duration=Math.min(1100,Math.max(390,portion*7));
        const t0=performance.now();
        await new Promise(resolve=>{
            function tick(now){
                const t=Math.min(1,(now-t0)/duration);
                const displayed=startXp+Math.floor(portion*t);
                $('expFill').style.width=(100*displayed/needed)+'%';
                $('expCounter').textContent=displayed+' / '+needed;
                if(t<1)requestAnimationFrame(tick);else resolve();
            }
            requestAnimationFrame(tick);
        });
        u.xp=endXp;
        remain-=portion;
        if(u.xp>=needed){
            u.xp=0;
            levelUp(u);
            $('expScene').classList.remove('levelFlash');
            void $('expScene').offsetWidth;
            $('expScene').classList.add('levelFlash');
            $('expLevelMsg').textContent='¡SUBIÓ DE NIVEL!';bsfx('levelup');
            $('expLevel').textContent='Nv. '+u.level;
            $('expFill').style.width='0%';
            $('expCounter').textContent='0 / '+xpRequired(u.level,u.id);
            updateRoster();updateLab();
            await expPause(620);
            $('expLevelMsg').textContent='';
        }
        updateExpPanel(u,earned);
    }
    if(u.level>=100)u.xp=0;
    updateRoster();updateLab();
    await expPause(540);
    $('expScene').hidden=true;
}
async function processExperience(){
    while(pendingExperience.length){
        const event=pendingExperience.shift();
        await displayExperience(event.u,event.earned,event.bonus);
    }
}
function evolvePokemon(u,to){
    const name=base[u.id].name;
    const previous=u.maxHp;
    u.id=to;
    statCalc(u);
    u.hp=Math.min(u.maxHp,u.hp+u.maxHp-previous);
    u.lastEvoOffer=u.level;
    fetchSprite(to);
    log('🌟 ¡'+name+' evolucionó a '+base[to].name+'!');
    for(const row of (learnsets[to]||[]))if(row.level<=1&&moveDB[row.key]&&!u.moves.some(z=>z.key===row.key))pendingProgress.push({kind:'learn',u,key:row.key});
    updateUI();
}
// Todas las decisiones (aprender, olvidar, evolucionar, cancelar) se resuelven antes de reanudar combate.
function resolveProgress(done){
    if(progressIsOpen)return;
    progressIsOpen=true;
    const next=()=>{
        if(!pendingProgress.length){progressIsOpen=false;$('modal').hidden=true;updateUI();if(done)done();return}
        const e=pendingProgress.shift();
        if(e.kind==='learn'){
            const m=moveDB[e.key],u=e.u;
            if(!m||u.moves.some(item=>item.key===e.key)){next();return}
            if(u.moves.length<4){u.moves.push({key:e.key,pp:m.pp});log('📖 '+base[u.id].name+' aprendió '+m.name+'.');updateUI();bsfx('levelup');
                showModal('¡'+base[u.id].name+' aprendió '+m.name+'!','','📖 ✨',[{text:'CONTINUAR',fn:next}]);return}
            const buttons=u.moves.map((old,i)=>({text:'Olvidar '+moveDB[old.key].name,fn:()=>{
                const forgotten=moveDB[u.moves[i].key].name;u.moves[i]={key:e.key,pp:m.pp};
                log('📖 '+base[u.id].name+' olvidó '+forgotten+' y aprendió '+m.name+'.');showModal('¡'+base[u.id].name+' aprendió '+m.name+'!','','📖 ✨',[{text:'CONTINUAR',fn:next}]);
            }}));
            buttons.push({text:'No aprender',fn:()=>{log('📚 '+base[u.id].name+' no aprendió '+m.name+'.');next()}});
            showModal('¡NUEVO MOVIMIENTO!',''+base[u.id].name+' puede aprender '+m.name+' (Nv. '+u.level+'). Ya conoce cuatro: ¿cuál quieres sustituir?','📖 ✨',buttons);
            return;
        }
        if(e.kind==='evolve'){
            const u=e.u;
            if(!base[e.to]||evolutionRules[u.id]?.to!==e.to){next();return}
            const old=u.id;
            const stone=e.stone||(e.reason==='Piedra Trueno'?'thunder-stone':null);
            const confirm=()=>{if(stone)spendStone(stone);if(e.onConfirm)e.onConfirm();const fromId=u.id;$('modal').hidden=true;evolvePokemon(u,e.to);if(!animationEnabled){next();return}showEvolutionScene(u,fromId,e.to).catch(err=>{console.warn(err);hideCinematic()}).then(()=>next())};
            const no=()=>{log('↩ '+base[u.id].name+' no evolucionó.');next()};
            fetchSprite(old);fetchSprite(e.to);
            showModal('¡EVOLUCIÓN DISPONIBLE!','¡'+base[u.id].name+' puede evolucionar a '+base[e.to].name+'! Requisito: '+e.reason+'.',
                '<div class="evobox"><span class="pmdSlot" data-pmd="'+old+'" data-s="84"></span><span>✨ ➜</span><span class="pmdSlot" data-pmd="'+e.to+'" data-s="84"></span></div>',
                [{text:'EVOLUCIONAR',fn:confirm},{text:'CANCELAR',fn:no}]);
            for(const ms of [400,1200,2500,5000])setTimeout(()=>{document.querySelectorAll('#modalArt img[data-evo]').forEach(im=>{const nu=spriteURL(Number(im.dataset.evo));if(nu&&im.src!==nu)im.src=nu})},ms);
            return;
        }
        next();
    };
    next();
}
function levelInLab(u,count){
    if(phase!=='player'||locked||progressIsOpen||!u)return;
    locked=true;updateUI();
    let remaining=count;
    const step=()=>{
        if(remaining<=0||u.level>=100){locked=false;updateUI();autoSaveSafe();return}
        remaining--;
        gainExperience(u,xpRequired(u.level,u.id)-u.xp);
        resolveProgress(step);
    };
    step();
}
function updateLab(){
    const el=$('labPokemon');if(!el||!units.length)return;
    const current=el.value||'0';
    const allies=units.filter(u=>u.side==='player').concat(reserves);
    el.innerHTML=allies.map((u,i)=>'<option value="'+i+'">'+base[u.id].name+' · Nv. '+u.level+'</option>').join('');
    el.value=Number(current)<allies.length?current:'0';
    const u=allies[Number(el.value)];if(!u)return;
    const xp=Math.round(Math.max(0,Math.min(100,100*u.xp/xpRequired(u.level,u.id))));
    $('labXpBar').style.width=xp+'%';
    const r=evolutionRules[u.id];
    $('labStats').textContent='PS '+u.hp+'/'+u.maxHp+' · Atq '+u.atk+' · Def '+u.def+' · At. Esp '+u.spa+' · Def. Esp '+u.spd+' · Vel '+u.speed+' · EXP '+u.xp+'/'+xpRequired(u.level,u.id)+(r?' · Evolución: '+(r.level?'Nv. '+r.level:'Piedra Trueno'):' · Evolución final');
    $('stoneCount').textContent=thunderStones;
    const canTest=phase==='player'&&!locked&&!progressIsOpen;
    $('trainOne').disabled=!canTest||u.level>=100;
    $('trainFive').disabled=!canTest||u.level>=100;
    $('useStone').disabled=!canTest||u.id!==25||thunderStones<=0;
}
$('labPokemon').addEventListener('change',updateLab);
$('trainOne').onclick=()=>levelInLab(units.filter(u=>u.side==='player').concat(reserves)[Number($('labPokemon').value)],1);
$('trainFive').onclick=()=>levelInLab(units.filter(u=>u.side==='player').concat(reserves)[Number($('labPokemon').value)],5);
$('useStone').onclick=()=>{
    if(phase!=='player'||locked||progressIsOpen||thunderStones<=0)return;
    const u=units.filter(v=>v.side==='player').concat(reserves)[Number($('labPokemon').value)];
    if(!u||u.id!==25){log('La Piedra Trueno solo sirve a Pikachu.');return}
    locked=true;
    pendingProgress.push({kind:'evolve',u,to:26,reason:'Piedra Trueno',stone:'thunder-stone'});
    resolveProgress(()=>{locked=false;updateUI();autoSaveSafe()});
};
