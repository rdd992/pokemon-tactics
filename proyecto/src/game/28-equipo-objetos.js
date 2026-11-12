// Después de capturar, los Pokémon se incorporan al grupo; se despliegan desde Equipo.
function deployFromReserve(u){
 if(!canPrepare()||!reserves.includes(u))return;
 const active=units.filter(q=>q.side==='player');if(active.length>=maxDeploy())return;
 const positions=stageId==='route22'?[[5,9],[6,9],[7,9],[8,9],[4,9],[9,9]]:(stageId==='nuggettrain'||stageId==='route25train')?[[3,8],[4,8],[5,8],[6,8],[3,7],[4,7]]:(stageId==='nugget'||stageId==='nuggetrocket'||stageId==='route25'||stageId==='route25b')?[[4,8],[5,8],[6,8],[7,8],[4,7],[5,7]]:stageId==='ceruleanrival'?[[5,8],[6,8],[7,8],[5,7],[6,7],[7,7]]:stageId==='route4'?[[1,8],[2,8],[3,8],[1,7],[2,7],[3,7]]:stageId==='mtmoonc'?[[4,8],[5,8],[3,8],[4,7],[5,7],[6,7]]:stageId==='mtmoon'?[[3,7],[3,8],[2,9],[2,7],[4,8],[2,6]]:[[1,7],[1,8],[2,9],[2,7],[3,8],stageId==='mtmoonj'?[3,7]:[2,6]];
 let spot=positions.find(([x,y])=>!occupied(x,y));if(!spot){log('No hay casilla libre para desplegar.');return}
 reserves.splice(reserves.indexOf(u),1);u.x=spot[0];u.y=spot[1];u.acted=false;u.moved=false;u.origin=null;
 const firstEnemy=units.findIndex(q=>q.side==='enemy');
 if(firstEnemy>=0)units.splice(firstEnemy,0,u);else units.push(u);
 managerSelected=u;log('🐾 '+base[u.id].name+' pasó a los desplegados.');updateUI();renderTeam();autoSaveSafe();
}
function swapParty(benchUnit,fieldUnit){
    if(!canPrepare()||!reserves.includes(benchUnit))return;
    const ix=units.indexOf(fieldUnit),ib=reserves.indexOf(benchUnit);
    if(ix<0||ib<0)return;
    benchUnit.x=fieldUnit.x;benchUnit.y=fieldUnit.y;benchUnit.moved=false;benchUnit.acted=false;benchUnit.origin=null;
    fieldUnit.x=-1;fieldUnit.y=-1;fieldUnit.moved=false;fieldUnit.acted=false;fieldUnit.origin=null;
    units[ix]=benchUnit;reserves[ib]=fieldUnit;
    selected=null;inspectedEnemy=null;enemyAnalysis=null;closeBattleMenu();skill=null;
    managerSelected=benchUnit;log('🔄 '+base[benchUnit.id].name+' ocupa el lugar de '+base[fieldUnit.id].name+'.');
    updateUI();renderTeam();autoSaveSafe();
}
function canUseBagNow(){
    return phase==='player'&&!locked&&!cinematicBusy&&!motion&&!progressIsOpen&&!pendingExperience.length&&!pendingProgress.length&&actionMenu==='actions'&&selected&&selected.side==='player'&&selected.hp>0&&!selected.acted;
}
function currentBagActor(){
    if(!selected||selected.acted||selected.hp<=0||selected.side!=='player')return null;
    return selected;
}
function openGameBag(){
    if(!$('gameBag').hidden){closeGameBag();return}
    if(!canUseBagNow()){log('🎒 Solo puedes usar objetos durante la acción de tu Pokémon.');return}
    if(!$('managerOverlay').hidden)return;
    $('gameBag').hidden=false;
    $('revivePicker').hidden=true;
    $('battleMenu').hidden=true;
    renderBag();
}
function closeGameBag(){
    $('revivePicker').hidden=true;
    $('gameBag').hidden=true;
    if(actionMenu)renderBattleMenu();
    updateUI();
}
function cancelBagStep(){
    if(!$('revivePicker').hidden){$('revivePicker').hidden=true;return}
    closeGameBag();
}
$('bagClose').onclick=cancelBagStep;
$('reviveCancel').onclick=()=>{$('revivePicker').hidden=true};
$('gameBag').addEventListener('click',e=>{if(e.target===$('gameBag'))cancelBagStep()});
$('revivePicker').addEventListener('click',e=>{if(e.target===$('revivePicker'))$('revivePicker').hidden=true});
let bagTab='items';
$('bagTabs').addEventListener('click',e=>{const t=e.target.closest('button[data-t]');if(!t)return;bagTab=t.dataset.t;renderBag()});
function renderBag(){
    const actor=currentBagActor();
    if(!actor){$('gameBag').hidden=true;return}
    const name=base[actor.id].name;
    $('bagSelfName').textContent=name+' · Nv. '+actor.level;
    const moveSel=$('bagMove'),oldMove=moveSel.value;
    moveSel.replaceChildren(...actor.moves.map((m,i)=>{
        let o=document.createElement('option');o.value=i;
        o.textContent=moveDB[m.key].name+' · PP '+m.pp+'/'+moveDB[m.key].pp;
        return o;
    }));
    if(oldMove!==''&&Number(oldMove)<actor.moves.length)moveSel.value=oldMove;
    const items=[
        {id:'potion',icon:'🧪',name:'Poción',desc:'Recupera 20 PS · a ti o a un aliado adyacente.'},
        {id:'superPotion',icon:'💗',name:'Superpoción',desc:'Recupera 50 PS · a ti o a un aliado adyacente.'},
        {id:'revive',icon:'✨',name:'Revivir',desc:'Elige un Pokémon debilitado del equipo (50% PS).'},
        {id:'ether',icon:'💠',name:'Éter',desc:'Recupera 10 PP del movimiento elegido del usuario.'},
        {id:'antidote',icon:'💜',name:'Antídoto',desc:'Cura el envenenamiento · a ti o a un aliado adyacente.'},
        {id:'parlyz',icon:'💛',name:'Antiparalizador',desc:'Cura la parálisis · a ti o a un aliado adyacente.'},
        {id:'thunderStone',icon:'⚡',name:'Piedra Trueno',desc:'Evoluciona a Pikachu · a ti o a un aliado adyacente. También desde 🐾 Equipo.'},
        {id:'fireStone',icon:'🔥',name:'Piedra Fuego',desc:'Piedra evolutiva · a ti o a un aliado adyacente.'},
        {id:'waterStone',icon:'💧',name:'Piedra Agua',desc:'Piedra evolutiva · a ti o a un aliado adyacente.'},
        {id:'leafStone',icon:'🍃',name:'Piedra Hoja',desc:'Piedra evolutiva · a ti o a un aliado adyacente.'},
        {id:'moonStone',icon:'🌙',name:'Piedra Lunar',desc:'Piedra evolutiva · a ti o a un aliado adyacente.'},
        {id:'pokeball',icon:'🔴',name:'Poké Ball',desc:'Captura salvajes · ratio ×1 · alcance 3'},{id:'greatball',icon:'🔵',name:'Super Ball',desc:'Captura salvajes · ratio ×1,5 · alcance 3'},{id:'ultraball',icon:'🟡',name:'Ultra Ball',desc:'Captura salvajes · ratio ×2 · alcance 3'}
    ];
    const hasFainted=partyAll().some(u=>u.hp===0);
    const list=$('inventoryList');list.replaceChildren();
    $('bagTabs').querySelectorAll('button').forEach(t=>t.classList.toggle('on',t.dataset.t===bagTab));
    for(const item of items.filter(it=>it.id!=='ether'&&(bagTab==='balls')===!!BALLS[it.id]&&itemQty(it.id)>0)){
        const num=itemQty(item.id);
        const row=document.createElement('div');row.className='inventoryItem';
        const label=document.createElement('div'),title=document.createElement('b');
        title.innerHTML=(ITEM_SPR[item.id]?itemIc(item.id,24):item.icon)+' '+item.name+' ×'+num;
        const desc=document.createElement('small');desc.style.display='block';desc.textContent=item.desc;
        label.append(title,desc);row.append(label);
        const btn=document.createElement('button');btn.textContent=item.id==='revive'?'Elegir':'Usar';
        let canUse=false;
        if(item.id==='revive')canUse=hasFainted;
        else if(BALLS[item.id])canUse=isTrainerBattle()||(captureAllowed()&&storageBox.length<BOX_CAPACITY&&units.some(u=>u.side==='enemy'&&u.hp>0));
        else canUse=itemTargets(item.id,actor).length>0;
        btn.disabled=(!num&&!(BALLS[item.id]&&isTrainerBattle()))||!canUse||!actor;
        btn.onclick=()=>{if(item.id==='revive')openRevivePicker();else if(BALLS[item.id]){if(isTrainerBattle()){const tm='¡El entrenador bloqueó la Ball! ¡No seas ladrón!';$('inventoryMessage').textContent='🚫 '+tm;log('🚫 '+tm);playSfx('error')}else startCaptureAim(item.id)}else if(ITEM_NAMES[item.id])startItemAim(item.id);else useItem(item.id,actor)};
        row.append(btn);list.append(row);
    }
    if(!list.children.length){const em=document.createElement('p');em.className='managerHint';em.textContent=bagTab==='balls'?'No tienes Poké Balls.':'No tienes objetos.';list.append(em)}
    $('inventoryMessage').textContent='⚔️ Al usar un objeto eliges el objetivo en el tablero: '+name+' o un aliado adyacente. Revivir permite elegir destinatario. '+(captureAllowed()?'🔴 Puedes lanzar Poké Balls a Pokémon salvajes a 3 casillas o menos.':'🔒 No puedes capturar los Pokémon de otros entrenadores.')+' Usar un objeto consume la acción.';
    $('bagStatus').textContent='USUARIO: '+name+' · Gastará su acción';
    $('bagBadge').textContent=captureAllowed()?'SALVAJE':'COMBATE';
    $('bagMove').disabled=!actor.moves.length;
    $('bagMove').parentElement.querySelector('.bagActorRow').hidden=true;
}
function itemWorks(id,u){
    if(!u)return false;
    if(id==='potion'||id==='superPotion')return u.hp>0&&u.hp<u.maxHp;
    if(id==='revive')return u.hp===0;
    if(id==='antidote')return u.hp>0&&!!u.poisoned;
    if(id==='parlyz')return u.hp>0&&!!u.paralyzed;
    if(STONE_BY_KEY[id])return u.hp>0&&evolutionRules[u.id]?.item===STONE_BY_KEY[id]&&!!base[evolutionRules[u.id].to];
    if(id==='ether'){
        const mp=u.moves[Number($('bagMove').value)];
        return !!mp&&mp.pp<moveDB[mp.key].pp;
    }
    return false;
}
$('bagMove').onchange=renderBag;
function openRevivePicker(){
    if(!canUseBagNow()||$('gameBag').hidden||!bag.revive)return;
    const fainted=partyAll().filter(u=>u.side==='player'&&u.hp===0);
    if(!fainted.length){renderBag();return}
    const list=$('reviveChoices');list.replaceChildren();
    for(const u of fainted){
        const b=document.createElement('button');b.type='button';b.className='reviveChoice';
        const info=document.createElement('div');
        const head=document.createElement('div');head.textContent=base[u.id].emoji+' '+base[u.id].name+' · Nv. '+u.level;
        const sub=document.createElement('small');sub.textContent=(reserves.includes(u)?'RESERVA · Permanecerá fuera del mapa':'DESPLEGADO · Volverá al mapa')+' · PS 0/'+u.maxHp;
        info.append(head,sub);b.append(info);
        const heal=document.createElement('span');heal.textContent='→ '+Math.max(1,Math.floor(u.maxHp/2))+' PS';b.append(heal);
        b.onclick=()=>useItem('revive',u);
        list.append(b);
    }
    $('revivePicker').hidden=false;
}
// Los Pokémon debilitados desaparecen visualmente del tablero (HP=0), pero
// mantienen sus coordenadas. Al revivir, restauramos la casilla si está libre;
// si un aliado o rival la ocupa, buscamos la casilla transitable más cercana.
function findRevivePosition(target,actor){
    if(!units.includes(target))return null; // Los de reserva no ocupan casillas.
    if(!inside(target.x,target.y))return null;
    const oldX=target.x,oldY=target.y;
    let candidates=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        if(!Number.isFinite(movementCost(terrain(x,y),target)))continue;
        if(occupied(x,y,target))continue;
        const steps=Math.abs(x-oldX)+Math.abs(y-oldY);
        const tieBreak=Math.abs(x-actor.x)+Math.abs(y-actor.y);
        candidates.push({x,y,steps,tieBreak});
    }
    candidates.sort((a,b)=>a.steps-b.steps||a.tieBreak-b.tieBreak||a.y-b.y||a.x-b.x);
    return candidates.length?{x:candidates[0].x,y:candidates[0].y}:null;
}
function useItem(id,target){
    if(!canUseBagNow()||$('gameBag').hidden)return;
    const actor=currentBagActor();
    if(!actor||itemQty(id)<1||actor.acted||actor.hp<=0)return;
    let revivalPosition=null;
    if(id==='revive'){
        if($('revivePicker').hidden)return;
        if(!target||!partyAll().includes(target)||target.side!=='player'||target.hp!==0)return;
        if(units.includes(target)){
            revivalPosition=findRevivePosition(target,actor);
            if(!revivalPosition){log('⚠ No existe una casilla libre para revivir a '+base[target.id].name+'.');return}
        }
    }else{
        if(!target||target.side!=='player'||target.hp<=0||distance(actor,target)>ITEM_RANGE)return;
        if(!itemWorks(id,target))return;
    }
    if(id==='potion'||id==='superPotion'){const hpBefore=target.hp;target.hp=Math.min(target.maxHp,target.hp+(id==='potion'?20:50));healEffect={u:target,from:hpBefore,to:target.hp,start:performance.now()};try{bsfx('restored')}catch(e){}}
    else if(id==='revive'){
        // Devolvemos los PS y reubicamos al desplegado ANTES de refrescar el mapa.
        target.hp=Math.max(1,Math.floor(target.maxHp/2));
        if(revivalPosition){
            target.x=revivalPosition.x;target.y=revivalPosition.y;
            // Un Pokémon resucitado puede moverse de nuevo desde la siguiente ronda.
            target.acted=true;target.moved=true;target.origin=null;target.counterUsed=true;
            reviveEffect={x:target.x,y:target.y,start:performance.now()};
        }
    }
    else if(id==='ether'){
        const mp=actor.moves[Number($('bagMove').value)];
        if(!mp||mp.pp>=moveDB[mp.key].pp)return;
        mp.pp=Math.min(moveDB[mp.key].pp,mp.pp+10);
    }
    else if(id==='antidote'){target.poisoned=false;target.src_poison=null}
    else if(id==='parlyz'){target.paralyzed=false}
    else if(STONE_BY_KEY[id]){ /* v651: piedra evolutiva desde la mochila; la piedra y la acción solo se gastan si se confirma */
        const item=STONE_BY_KEY[id],S=EVO_STONES[item],r=evolutionRules[target.id];
        let used=false;
        closeGameBag();locked=true;updateUI();
        pendingProgress.push({kind:'evolve',u:target,to:r.to,reason:S.name,stone:item,onConfirm:()=>{
            used=true;actor.acted=true;actor.moved=true;actor.origin=null;
            log('🎒 '+base[actor.id].name+' usa '+S.name+' en '+base[target.id].name+'. Acción consumida.');
        }});
        resolveProgress(()=>{locked=false;
            if(used){selected=null;inspectedEnemy=null;enemyAnalysis=null;skill=null;closeBattleMenu();updateUI();autoSaveSafe();nextIfAll()}
            else{updateUI();if(actionMenu)renderBattleMenu()}
        });
        return;
    }
    else return;
    bag[id]--;
    actor.acted=true;actor.moved=true;actor.origin=null;
    selected=null;inspectedEnemy=null;enemyAnalysis=null;skill=null;closeBattleMenu();
    let itemLog='🎒 '+base[actor.id].name+' usa '+({potion:'Poción',superPotion:'Superpoción',revive:'Revivir',ether:'Éter',antidote:'Antídoto',parlyz:'Antiparalizador'}[id])+' en '+base[target.id].name+'. Acción consumida.';
    if(id==='revive'){
        itemLog+=revivalPosition?' ✨ ¡Reapareció en el mapa con '+target.hp+' PS!':' ✨ Recuperado en reserva; no entra al mapa durante esta batalla.';
    }
    log(itemLog);
    closeGameBag();updateUI();autoSaveSafe();nextIfAll();
}
// Escape en la elección de Revivir regresa a la mochila; otro Escape regresa a las acciones.
window.addEventListener('keydown',e=>{
    if(!$('gameBag').hidden){
        if(e.code==='Escape'||e.code==='Backspace'||e.code==='KeyX'){
            cancelBagStep();e.preventDefault();e.stopImmediatePropagation();
        }else if(e.code==='KeyN'||e.code==='Enter'||e.code==='Space'||e.code==='KeyZ'){
            e.stopImmediatePropagation();
        }
    }
},true);
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!$('managerOverlay').hidden){e.stopImmediatePropagation();e.preventDefault();closeManager()}},true);
showIntro();

/* ===== v3D · Escena 2.5D (Three.js) · tablero en relieve, luces y sombras; los Pokémon (SpriteCollab) son figuras que miran a la cámara ===== */
var R3=null;let R3fail=false;
function stageTheme(id){
 const T={kind:'out',a:'#5aa84a',b:'#5aa84a',path:'#f0d27a',tall:'#5aa84a',wall:'#a08a62',earth:'#8a6a47',lip:'#3f9439',tree:['#2f8a4a','#3a9c55','#46ad60'],sky:['#bfe5ff','#f4fbff'],hemi:[0xdff1ff,0x6f8f5a],hemiI:.85,sun:0xfff0d0,sunI:2.2,water:'#4fb0d8',fog:null};
 if(id==='pallet')return Object.assign(T,{kind:'lab',a:'#efecf2',b:'#e6e2ea',path:'#e6e2ea',wall:'#cfce82',earth:'#14161d',sky:['#2b4388','#1d3068'],hemi:[0xffffff,0x9aa0b0],hemiI:.95,sunI:1.7,sun:0xfff3dd});
 if(id==='gymguard'||id==='pewter')return Object.assign(T,{kind:'gym',a:'#b3aa9b',b:'#a39a8c',path:'#a39a8c',wall:'#6c645d',earth:'#4a4650',sky:['#86b6b2','#d9eee8'],hemi:[0xffffff,0x8a8074],hemiI:1.0,sunI:1.8,sun:0xffefd8});
 if(id==='cerulean'||id==='ceruleanguard')return Object.assign(T,{kind:'pool',a:'#b6d8e6',b:'#a4cbdd',path:'#e9dfc3',wall:'#58789e',earth:'#3d5876',sky:['#6a9ad8','#d4e6f8'],hemi:[0xffffff,0x7a98b8],hemiI:1.0,sunI:1.9,sun:0xe8f6ff,water:'#38a6e0'});
 if(id==='mtmoon'||id==='mtmoonj'||id==='mtmoonb'||id==='mtmoonc')return Object.assign(T,{kind:'cave',a:'#938974',b:'#938974',path:'#d9c067',wall:'#6d655b',earth:'#3b3631',sky:['#3a3f63','#12162b'],hemi:[0xc7d2ff,0x6b6050],hemiI:1.15,sunI:2.0,sun:0xcfd9ff,water:'#3f8fb5'});
 if(id==='vermilionguard'||id==='vermilion')return Object.assign(T,{kind:'gym',a:'#cfc7a6',b:'#c0b894',path:'#9aa0a8',wall:'#5d6470',earth:'#3b3f48',sky:['#86a2c8','#e6eef8'],hemi:[0xffffff,0x8a8d99],hemiI:1.0,sunI:1.8,sun:0xfff4d0});
 if(id==='route3'||id==='route3b'||id==='route4'||id==='route5'||id==='route6'||id==='vermilionrival'||id==='ceruleanrival'||id==='nugget'||id==='nuggetrocket'||id==='nuggettrain'||id==='route25'||id==='route25b'||id==='route25train')return Object.assign(T,{a:'#5aa84a',b:'#5aa84a',wall:'#b0966a',tall:'#5aa84a',lip:'#3f9439',tree:['#4a8a3e','#58a048','#66b255']});
 if(id==='camp'||id==='forest'||id==='forestdoug'||id==='forestmid'||id==='forestexit'||id==='route2in'||id==='route22'||id==='route2')return Object.assign(T,{a:'#6fb460',b:'#65a957',tall:'#4c9a45',tree:['#20703d','#2a8447','#349754'],sky:['#a9d6c4','#e1f3ea'],hemiI:.75});
 return T;
}
function shade(hex,k){const c=parseInt(hex.slice(1),16);const r=Math.round(((c>>16)&255)*k),g=Math.round(((c>>8)&255)*k),b=Math.round((c&255)*k);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}

function pxaLabWall(){return pxaCanvas(16,48,(P)=>{for(let y=0;y<48;y++)for(let x=0;x<16;x++){let c;if(y<3)c='#f3efcf';else if(y<5)c='#e2dca8';else if(y<30)c=pxaHash(x,y>>2,3)>.93?'#d3d28a':'#cfce82';else if(y<32)c='#f3efcf';else c=(x>>1)%2?'#a3a24e':'#b6b55f';if(y===47)c='#8f8e3f';P(x,y,c)}})}
function pxaGymGreen(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=(x>>1)%2?'#c4d684':'#d3e298';if(y<2)c='#8a9a5a';else if(y>13)c='#6c7a46';P(x,y,c)}})}
function pxaPoolWall(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=x%4===0?'#2e4a84':'#3a5a9a';if(y<2)c='#5a7cbc';else if(y>13)c='#243a6c';P(x,y,c)}})}
function pxaPlank(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=(y>>2)%2?'#a78458':'#b99569';if(y%4===3)c='#7a5c38';if(pxaHash(x,y,5)>.9)c='#8e6e44';P(x,y,c)}})}
function pxaSlab(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=(y>>2)%2?'#bfc2cb':'#b3b6c0';if(y%4===3)c='#8e929f';if(pxaHash(x,y,9)>.92)c='#a2a6b2';P(x,y,c)}})}
function pxaGranite(){return pxaCanvas(16,16,(P)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c='#b9bbc3';const n=pxaHash(x,y,3);if(n>.8)c='#a1a4ae';else if(n<.12)c='#cfd1d8';P(x,y,c)}})}
function pxaWindow(){return pxaCanvas(12,14,(P)=>{for(let y=0;y<14;y++)for(let x=0;x<12;x++){let c;const fr=x<1||x>10||y<1||y>12;if(fr)c='#e9edf2';else if(x===5||x===6||y===6)c='#e9edf2';else c=y<5?'#a9d3ec':'#6fa6c8';if(y===13)c='#b4bac4';P(x,y,c)}})}
function pxaWall(base,seed){return pxaCanvas(32,32,(P)=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const row=y>>3,off=(row%2)*8,bx=(x+off)%16;let c=pxaHash(x>>2,y>>2,seed)>.7?pxaShade(base,1.08):base;if(y%8===7||bx===15)c=pxaShade(base,.74);else if(y%8===0)c=pxaShade(base,1.14);P(x,y,c)}})}
/* ===== Arte pixel procedural: texturas de suelo, árboles, rocas y fondo (estilo coherente con los sprites) ===== */
const PXA={cache:{}};
function pxaShade(h,k){const c=pxaRGB(h);return '#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v*k))).toString(16).padStart(2,'0')).join('')}
function pxaRGB(h){const c=parseInt(h.slice(1),16);return [(c>>16)&255,(c>>8)&255,c&255]}
function pxaHash(a,b,c){const s=Math.sin(a*127.1+b*311.7+(c||0)*74.7)*43758.5453;return s-Math.floor(s)}
function pxaCanvas(w,h,draw){
 const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h);
 const P=(px,py,col,a)=>{px|=0;py|=0;if(px<0||py<0||px>=w||py>=h)return;const i=(py*w+px)*4,r=pxaRGB(col);im.data[i]=r[0];im.data[i+1]=r[1];im.data[i+2]=r[2];im.data[i+3]=a===undefined?255:a};
 draw(P,w,h);x.putImageData(im,0,0);return c}
