// Reconstruct the lowest-cost path using the same terrain/obstacle rules as reachable().
// The route is visual feedback AND the real movement animation: no fake straight-line shortcuts.
function routeTo(u,x,y){
    if(!inside(x,y)||occupied(x,y,u))return null;
    const costs=reachable(u);
    if(!Number.isFinite(costs[y][x])||!landOK(u,x,y))return null;
    const path=[{x,y}];
    let cx=x,cy=y,tries=0;
    while((cx!==u.x||cy!==u.y)&&tries++<W*H){
        const stepCost=movementCost(terrain(cx,cy),u);
        let next=null,score=Infinity;
        const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
        for(const [dx,dy] of dirs){
            let nx=cx+dx,ny=cy+dy;
            if(!inside(nx,ny))continue;
            const o=occupied(nx,ny,u);
            if(o&&o.side!==u.side)continue;
            if(Math.abs(costs[ny][nx]+stepCost-costs[cy][cx])>0.001)continue;
            // Equal-cost routes favor fewer bends for a clearer Fire Emblem-like arrow.
            let bends=path.length>1 && (path[path.length-2].x-cx!==dx||path[path.length-2].y-cy!==dy)?0.1:0;
            let s=costs[ny][nx]+bends;
            if(s<score){score=s;next={x:nx,y:ny}}
        }
        if(!next&&isLedge(cx,cy-1)&&inside(cx,cy-2)){
            const o=occupied(cx,cy-2,u);
            if(!(o&&o.side!==u.side)&&Math.abs(costs[cy-2][cx]+1+stepCost-costs[cy][cx])<0.001){path.push({x:cx,y:cy-1});next={x:cx,y:cy-2}}
        }
        if(!next)return null;
        path.push(next);cx=next.x;cy=next.y;
    }
    if(cx!==u.x||cy!==u.y)return null;
    return path.reverse();
}
function previewRoute(){
    if(phase!=='player'||locked||!selected||selected.acted||selected.moved||skill!==null||actionMenu||!hovered||(!usingKeyboard&&!mouseOnBoard))return null;
    if(hovered.x===selected.x&&hovered.y===selected.y)return null;
    return routeTo(selected,hovered.x,hovered.y);
}
// --- Pronóstico de batalla (estilo Fire Emblem): daño, acierto, crítico y contraataque antes de confirmar ---
function dmgRange(u,v,m){
 if(!m.power)return null;
 const eff=effect(m.type,base[v.id].types);
 if(eff===0)return{min:0,max:0,eff};
 const mx=damage(u,v,m,false),mn=Math.max(1,Math.floor(mx*.85)),h=m.multi||[1,1];
 return{min:mn*h[0],max:mx*h[1],eff,multi:m.multi};
}
function counterForecast(u,v,m){
 if(!m.power||v.hp<=0)return null;
 const item=v.moves.find(it=>{const cm=moveDB[it.key];return it.pp>0&&cm.power>0&&cm.shape!=='area'&&canAim(v,cm,u.x,u.y)});
 if(!item)return{none:true};
 const cm=moveDB[item.key],f=v.side==='player'?COUNTER_PLAYER:COUNTER_ENEMY,eff=effect(cm.type,base[u.id].types);
 const mx=eff===0?0:Math.max(1,Math.floor(damage(v,u,cm,false,false,true)*f)),mn=mx?Math.max(1,Math.floor(mx*.85)):0;
 return{name:cm.name,min:mn,max:mx,acc:Math.max(0,Math.min(100,cm.acc-v.accuracyDown*18)),eff};
}
function hideForecast(){const el=$('forecast');if(el&&!el.hidden){el.hidden=true;el.dataset.key='';const w=document.querySelector('.canvaswrap');if(w){w.classList.remove('fcOn');try{placePrompt()}catch(e){}}}}
function showForecast(u,m,targets){
 const el=$('forecast');if(!el)return;
 if(!targets.length){hideForecast();return}
 const eff=t=>t>1?['good','¡Supereficaz ×'+t+'!']:t===0?['none','Inmune']:t<1?['bad','Poco eficaz ×'+t]:null;
 let html='<div class="fcHead">📊 PRONÓSTICO · '+m.name.toUpperCase()+'</div>';
 const acc=Math.max(0,Math.min(100,m.acc-u.accuracyDown*18)),crit=Math.round(100*(u.critUp?(m.hcrit?1/3:1/4):(m.hcrit?1/8:1/16)));
 for(const v of targets.slice(0,3)){
  html+='<div class="fcBox"><div class="fcName">'+base[v.id].name+' Nv.'+v.level+'<span>PS '+v.hp+'/'+v.maxHp+'</span></div>';
  const r=dmgRange(u,v,m);
  if(r){
   const after=r.max>=v.hp?(r.min>=v.hp?0:'0–'+(v.hp-r.min)):(v.hp-r.max)+(r.min!==r.max?'–'+(v.hp-r.min):'');
   html+='<div class="fcRow"><b>Daño</b><span>'+(r.min===r.max?r.max:r.min+'–'+r.max)+(r.multi?' ('+r.multi[0]+(r.multi[0]!==r.multi[1]?'–'+r.multi[1]:'')+' golpes)':'')+' <i>→ PS '+after+'</i></span></div>';
   html+='<div class="fcRow"><b>Acierto · Crítico</b><span>'+acc+'% · '+(r.eff===0?'—':crit+'%')+'</span></div>';
   const e=eff(r.eff);if(e)html+='<span class="fcTag '+e[0]+'">'+e[1]+'</span> ';
   if(r.eff>0&&r.min>=v.hp)html+='<span class="fcTag good">Lo debilita</span>';else if(r.eff>0&&r.max>=v.hp)html+='<span class="fcTag good">Puede debilitarlo</span>';
   const c=counterForecast(u,v,m);
   if(c){
    html+='<div class="fcCounter">';
    if(r.eff>0&&r.min>=v.hp)html+='<div class="fcRow"><b>↩ Contraataque</b><span>No (queda debilitado)</span></div>';
    else if(c.none)html+='<div class="fcRow"><b>↩ Contraataque</b><span>No puede responder</span></div>';
    else{
     const ce=c.max===0?'Inmune':(c.min===c.max?c.max:c.min+'–'+c.max)+' · '+c.acc+'%';
     html+='<div class="fcRow"><b>↩ '+c.name+'</b><span>'+ce+(c.max?' <i>→ tus PS '+Math.max(0,u.hp-c.max)+(c.min!==c.max?'–'+Math.max(0,u.hp-c.min):'')+'</i>':'')+'</span></div>';
     if(c.max>=u.hp)html+='<span class="fcTag warn">⚠ Podría debilitarte</span>';
    }
    html+='</div>';
   }
  }else{
   html+='<div class="fcRow"><b>Efecto</b><span>'+(m.detail||'Estado')+'</span></div><div class="fcRow"><b>Acierto</b><span>'+(m.shape==='self'?'—':acc+'%')+'</span></div>';
  }
  html+='</div>';
 }
 if(targets.length>3)html+='<div class="fcRow"><i>…y '+(targets.length-3)+' objetivos más</i></div>';
 if(el.dataset.key!==html){el.innerHTML=html;el.dataset.key=html}
 el.classList.toggle('right',Math.min(...targets.map(t=>t.x))<=4);
 el.hidden=false;{const w=document.querySelector('.canvaswrap');if(w&&!w.classList.contains('fcOn')){w.classList.add('fcOn');try{placePrompt()}catch(e){}}}{const lb=$('locationLabel');const pr=$('attackPrompt'),mc=$('moveInfoCard'),co=matchMedia('(pointer:coarse)').matches;
  if(co){const b=(pr&&!pr.hidden)?pr:(mc&&!mc.hidden)?mc:lb;el.style.top=b&&b.offsetHeight?(b.offsetTop+b.offsetHeight+6)+'px':''} // táctil: bajo el aviso/ficha
  else el.style.top=(pr&&!pr.hidden&&pr.style.left==='12px')?(pr.offsetTop+pr.offsetHeight+6)+'px':lb&&lb.offsetHeight?(lb.offsetTop+lb.offsetHeight+6)+'px':''}
}
function updateTileHint(){
 hideForecast();
    if(!hovered||(!usingKeyboard&&!mouseOnBoard)||phase!=='player'||locked){$('tileHint').textContent='';return}
    let u=occupied(hovered.x,hovered.y),t=terrain(hovered.x,hovered.y);
    // v0.22: apuntar Poké Balls usa el mismo reconocimiento de blanco que un ataque.
    if(captureMode&&selected&&!selected.acted){
        const candidate=occupied(hovered.x,hovered.y);
        const valid=captureMode.itemId?!!candidate&&itemTargets(captureMode.itemId,selected).includes(candidate):candidate&&candidate.side==='enemy'&&candidate.hp>0&&distance(selected,candidate)<=CAPTURE_RANGE;
        const ballName=captureMode.itemId?ITEM_NAMES[captureMode.itemId]:BALLS[captureMode.ballId].name;
        $('tileHint').textContent=valid?'🎯 '+(captureMode.itemId?'USAR EN: ':'CAPTURAR: ')+base[candidate.id].name+' Nv.'+candidate.level+' · PS '+candidate.hp+'/'+candidate.maxHp:(captureMode.itemId?'NO SE PUEDE USAR AQUÍ':'FUERA DE ALCANCE DE CAPTURA');
        $('attackPrompt').textContent='🎯 '+ballName+' · '+(valid?'Objetivo: '+base[candidate.id].name+' Nv.'+candidate.level:(captureMode.itemId?'elige a un aliado adyacente':'apunta a un salvaje a '+CAPTURE_RANGE+' casillas'));
        return;
    }
    // Mientras apuntas un movimiento, priorizar la identificación del blanco.
    if(selected&&!selected.acted&&skill!==null){
        const m=moveDB[selected.moves[skill].key];
        const valid=canAim(selected,m,hovered.x,hovered.y);
        const targets=valid?aimTargets(selected,m,hovered.x,hovered.y).filter(q=>q.hp>0):[];
        $('tileHint').textContent=!valid?'FUERA DE ALCANCE':targets.length?'🎯 OBJETIVO: '+targets.map(q=>base[q.id].name+' Nv.'+q.level+' · PS '+q.hp+'/'+q.maxHp).join(' / '):'SELECCIONA UN ENEMIGO';
        $('attackPrompt').textContent='🎯 '+m.name+' · '+(targets.length?'Objetivo: '+targets.map(q=>base[q.id].name).join(', '):'selecciona objetivo');
        if(valid&&targets.length)showForecast(selected,m,targets);
        return;
    }
    if(u){$('tileHint').textContent=(u.side==='player'?'ALIADO · ':'ENEMIGO · ')+base[u.id].name;return}
    if(inspectedEnemy&&enemyAnalysis){let k=hovered.x+','+hovered.y;$('tileHint').textContent=enemyAnalysis.movement.has(k)?'MOVIMIENTO ENEMIGO':enemyAnalysis.danger.has(k)?'ZONA DE ATAQUE':'FUERA DE ALCANCE';return}
    if(selected&&!selected.moved&&!selected.acted&&!actionMenu){
        let p=routeTo(selected,hovered.x,hovered.y);
        $('tileHint').textContent=p?'RUTA · '+(reachable(selected)[hovered.y][hovered.x])+' PM · '+(p.length-1)+' PASOS':(t==='X'||t==='~'?'OBSTÁCULO':'FUERA DE ALCANCE');return
    }
    $('tileHint').textContent=t==='F'?'BOSQUE · COBERTURA':t==='~'?'AGUA':t==='X'?(stageId==='pallet'?'MOBILIARIO':'ROCA'):(stageId==='pallet'?'LABORATORIO':'PRADERA');
}
function analyzeEnemy(u){
    // Zona roja: casillas donde puede terminar el movimiento; ámbar: ataque posible
    // desde cualquiera de esas posiciones durante su próxima activación.
    let costs=reachableEnd(u),movement=new Set(),danger=new Set(),positions=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
        if(Number.isFinite(costs[y][x])){
            if(!occupied(x,y,u)){positions.push({x,y});movement.add(x+','+y)}
            if(x===u.x&&y===u.y)positions.push({x,y});
        }
    }
    for(const pos of positions){
        for(const mp of u.moves){
            if(mp.pp<=0)continue;
            let m=moveDB[mp.key];if(m.shape==='self')continue;
            for(let y=0;y<H;y++)for(let x=0;x<W;x++){
                if(terrain(x,y)==='X'||!canAim(u,m,x,y,pos))continue;
                if(m.shape==='area'){
                    for(let oy=-m.radius;oy<=m.radius;oy++)for(let ox=-m.radius;ox<=m.radius;ox++){
                        if(Math.abs(ox)+Math.abs(oy)>m.radius)continue;
                        let tx=x+ox,ty=y+oy;
                        if(inside(tx,ty)&&terrain(tx,ty)!=='X')danger.add(tx+','+ty);
                    }
                }else danger.add(x+','+y);
            }
        }
    }
    return {movement,danger};
}
function inspectEnemy(u){
    if(phase!=='player'||locked||actionMenu)return;
    if(inspectedEnemy!==u)playCry(u.id);
    selected=null;skill=null;actionMenu=null;inspectedEnemy=u;enemyAnalysis=analyzeEnemy(u);
    if(usingKeyboard){keyboardCursor={x:u.x,y:u.y};hovered={...keyboardCursor}}
    log('👁 Inspeccionando a '+base[u.id].name+': rojo = movimiento; ámbar = peligro al moverse y atacar.');
    updateUI();
}
function closeBattleMenu(){actionMenu=null;$('battleMenu').hidden=true;$('battleMenu').innerHTML='';updateMoveInfo();syncAttackBack()}
function syncAttackBack(){
    const targeting=phase==='player'&&!locked&&selected&&!actionMenu&&(skill!==null||!!captureMode);
    $('attackBack').hidden=!targeting;
    if(!targeting)window.__aim2=null;
    {const ab=$('attackBack'),th=$('tileHint');if(th)th.style.bottom=targeting&&!matchMedia('(pointer:coarse)').matches?(ab.offsetHeight+(parseFloat(getComputedStyle(ab).bottom)||0)+8)+'px':''}
    $('attackPrompt').hidden=!targeting||!matchMedia('(pointer:coarse)').matches; // en PC el aviso es redundante: la barra inferior ya indica el objetivo
    placePrompt();
    if(targeting){$('attackPrompt').textContent=captureMode?(captureMode.itemId?'🎯 '+ITEM_NAMES[captureMode.itemId]+' · elige a ti o a un aliado adyacente':'🎯 '+BALLS[captureMode.ballId].name+' · elige Pokémon salvaje (≤'+CAPTURE_RANGE+' casillas)'+' · menos PS, más fácil de atrapar'): '🎯 '+moveDB[selected.moves[skill].key].name+' · selecciona objetivo';$('attackBack').textContent=captureMode?'↩ Volver a objetos':'↩ Volver a movimientos'}
}
function backFromAttack(){
    if(captureMode){cancelCaptureAim();return}
    if(phase!=='player'||locked||!selected)return;
    if(skill!==null){skill=null;window.__aim2=null;if(matchMedia('(pointer:coarse)').matches)hovered=null;try{hideForecast()}catch(e){}try{$('tileHint').textContent=''}catch(e){}actionMenu='moves';menuIndex=0;updateUI();renderBattleMenu();return}
    if(actionMenu==='moves'){actionMenu='actions';menuIndex=0;renderBattleMenu()}
}
$('attackBack').addEventListener('click',backFromAttack);
function cancelSelection(){
    if(!selected||locked)return;
    closeBattleMenu();
    if(selected.moved&&!selected.acted&&selected.origin){cancelMovement();return}
    selected=null;skill=null;updateUI();
}
function menuCommands(){
    if(actionMenu==='actions')return [
        canUseMoves(selected)&&{label:'⚔ Movimientos',detail:'Elegir uno de 4 movimientos',run:()=>{actionMenu='moves';menuIndex=0;renderBattleMenu()}}, // v653: sin rival al alcance no aparece
        {label:'🎒 Objeto',detail:'Abrir la mochila de este Pokémon',run:openGameBag},
        {label:'⌛ Esperar',detail:'Terminar acción',run:wait},
        {label:'↩ Cancelar',detail:'Deshacer movimiento',run:cancelSelection}
    ].filter(Boolean);
    if(actionMenu==='moves'&&selected){
        const entries=selected.moves.map((mp,i)=>({
            label:moveDB[mp.key].name,icon:moveDB[mp.key].type,ppText:'PP '+mp.pp+'/'+moveDB[mp.key].pp,
            disabled:!moveUsable(selected,mp), // v653: sin PP, bloqueado por Otra Vez o sin objetivo al alcance
            run:()=>{closeBattleMenu();chooseSkill(i)}
        }));
        entries.push({label:'← Volver',detail:'Menú de acciones',run:()=>{actionMenu='actions';menuIndex=0;renderBattleMenu()}});
        return entries;
    }
    return [];
}
// ---- Ficha de detalle del movimiento resaltado (menú de Movimientos) ----
const MOVE_EFFECT_TXT={accuracyDown:'Baja la precisión del objetivo (−18 puntos por nivel, 2 turnos).',atkDown:'Baja el Ataque del objetivo un nivel (×2/3, 2 turnos).',atkUp10:'10 % de subir tu propio Ataque (×1,5, 2 turnos).',burn10:'10 % de quemar al objetivo.',confuse:'Desorienta al objetivo: −3 PM de movimiento, 2 turnos.',confuse10:'10 % de desorientar (−3 PM, 2 turnos).',confuse20:'20 % de desorientar (−3 PM, 2 turnos).',critUp:'Concentra energía: golpes críticos ×4 el resto del combate.',defDown:'Baja la Defensa del objetivo un nivel (2 turnos).',defDown2:'Baja mucho la Defensa del objetivo: dos niveles (2 turnos).',defUp:'Sube tu Defensa un nivel (2 turnos).',drain:'Absorbe: recuperas la mitad del daño causado.',encore:'Obliga al objetivo a repetir su último movimiento 3 turnos.',evadeUp:'Sube tu evasión (bonificación defensiva, 2 turnos).',flinch30:'30 % de amedrentar: el objetivo pierde su próxima acción.',mudsport:'Debilita los ataques de tipo Eléctrico.',paralysis:'Paraliza al objetivo (los Eléctricos son inmunes).',paralysis10:'10 % de paralizar al objetivo.',poison:'Envenena al objetivo (1/8 de sus PS por ronda).',poison20:'20 % de envenenar al objetivo.',poison30:'30 % de envenenar al objetivo.',poison40:'40 % de envenenar al objetivo.',seed:'Drenadoras: roba PS al objetivo cada ronda, 2 turnos (las Plantas son inmunes).',sleep:'Duerme al objetivo 2 turnos.',slow:'Reduce el movimiento del objetivo en 3 PM durante 2 turnos.',slow10:'10 % de reducir el movimiento (−3 PM, 2 turnos).',speedUp:'Sube tu velocidad: +2 PM de movimiento durante 2 turnos.',trap:'Atrapa al objetivo 3 turnos: no puede moverse y pierde 1/16 de sus PS por ronda.'};
const MOVE_SHAPE_TXT=m=>m.shape==='melee'?'Cuerpo a cuerpo · casilla adyacente':m.shape==='self'?'Sobre ti mismo':m.shape==='line'?'Línea recta · hasta '+m.range+' casillas':m.shape==='area'?'Área · hasta '+m.range+' casillas, radio '+(m.radius||1):'Un objetivo · hasta '+m.range+' casillas';
function moveInfoHTML(mp){
    const m=moveDB[mp.key];if(!m)return '';
    const cat=m.power?(GEN3_PHYSICAL_TYPES.has(m.type)?'Físico':'Especial'):'Estado';
    const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    let h='<div class="miHead"><span class="miType" style="background:'+(typeColors[m.type]||'#9ca4a7')+'">'+(TYPE_EMOJI[m.type]||'')+' '+esc((FE_TYPE_ES&&FE_TYPE_ES[m.type])||m.type).toLowerCase()+'</span><b>'+esc(m.name)+'</b><i>'+cat+'</i></div>';
    const tn=esc((FE_TYPE_ES&&FE_TYPE_ES[m.type])||m.type).toLowerCase();h+='<div class="miStats"><span>Tipo <b>'+tn.charAt(0).toUpperCase()+tn.slice(1)+'</b></span><span>Potencia <b>'+(m.power?(m.multi?m.power+' ×'+m.multi[0]+(m.multi[0]===m.multi[1]?'':'–'+m.multi[1]):m.power):'—')+'</b></span><span>Precisión <b>'+(m.acc?m.acc+' %':'—')+'</b></span><span>PP <b>'+mp.pp+'/'+m.pp+'</b></span></div>';
    h+='<div class="miRow">📏 '+MOVE_SHAPE_TXT(m)+'</div>';
    const ef=MOVE_EFFECT_TXT[m.effect];
    if(ef)h+='<div class="miRow">✨ '+esc(ef)+'</div>';else if(m.detail&&!m.effect){const xtra=String(m.detail).split(' · ').filter(s=>!/(casilla|adyacente|cuerpo a cuerpo|línea|objetivo a|^área)/i.test(s)).join(' · ');if(xtra)h+='<div class="miRow">ℹ️ '+esc(xtra.charAt(0).toUpperCase()+xtra.slice(1))+'</div>'} // solo detalles que aportan algo: el alcance ya aparece en la línea 📏
    return h;
}
function updateMoveInfo(){
    // La ficha es una tarjeta aparte (no está dentro del menú), para no tapar ni empujar los botones, incluido «Volver».
    let box=$('moveInfoCard');
    if(!box){const w=document.querySelector('.canvaswrap');if(!w)return;box=document.createElement('div');box.id='moveInfoCard';box.className='moveInfo';box.hidden=true;w.append(box)}
    // Móvil: no hay ficha al abrir la lista; aparece al tocar un movimiento (queda elegido) y se ve mientras apuntas al objetivo.
    // PC: la ficha sigue al movimiento resaltado.
    const touch=matchMedia('(pointer:coarse)').matches;
    const mp=locked?null:touch?(skill!==null&&selected&&phase==='player'&&selected.moves[skill]):(actionMenu==='moves'&&selected&&selected.moves[menuIndex]);
    if(!mp){box.hidden=true;placePrompt();return}
    box.innerHTML=moveInfoHTML(mp);box.hidden=false;placePrompt();
}
// El aviso «selecciona objetivo» baja justo debajo de la ficha para no taparla
function placePrompt(){const p=$('attackPrompt'),c=$('moveInfoCard');if(!p)return;
    const coarse=matchMedia('(pointer:coarse)').matches,lb=$('locationLabel');
    if(c&&lb&&lb.offsetHeight)c.style.top=(lb.offsetTop+lb.offsetHeight+6)+'px'; // la ficha del movimiento va bajo la etiqueta de lugar/rival
    if(c&&!c.hidden&&c.offsetHeight&&!p.hidden){p.style.top=(c.offsetTop+c.offsetHeight+6)+'px';p.style.left='';p.style.transform='';return}
    if(coarse&&lb&&lb.offsetHeight&&!p.hidden&&c&&!c.offsetHeight){p.style.top=(lb.offsetTop+lb.offsetHeight+6)+'px';p.style.left='';p.style.transform='';return}
    if(!coarse&&lb&&lb.offsetHeight&&!p.hidden){p.style.top=(lb.offsetTop+lb.offsetHeight+6)+'px';p.style.left='12px';p.style.transform='none';return} // PC: columna izquierda bajo la etiqueta del lugar, sin tapar nada
    p.style.top='';p.style.left='';p.style.transform=''}
function renderBattleMenu(){
    syncAttackBack();
    let el=$('battleMenu');
    if(!actionMenu||!selected||phase!=='player'){el.hidden=true;updateMoveInfo();return}
    let commands=menuCommands();el.innerHTML='';el.hidden=false;
    // móvil: en la lista de ataques, la opción "← Volver" se reemplaza por una ✕ en la esquina de la ventana
    const bmTouch=actionMenu==='moves'&&matchMedia('(pointer:coarse)').matches;let bmBack=null;
    if(bmTouch&&commands.length&&commands[commands.length-1].label==='← Volver'){bmBack=commands[commands.length-1];commands=commands.slice(0,-1);if(menuIndex>=commands.length)menuIndex=0}
    el.classList.toggle('bmHasClose',!!bmBack);
    const caption=document.createElement('div');caption.className='menuCaption';caption.textContent=actionMenu==='actions'?base[selected.id].name.toUpperCase():'⚔ ELEGIR ATAQUE';el.append(caption);
    commands.forEach((command,i)=>{
        let btn=document.createElement('button');btn.type='button';btn.className=i===menuIndex?'menuActive':'';
        if(actionMenu==='moves'&&command.icon){btn.classList.toggle('menuOff',!!command.disabled);if(command.disabled)btn.dataset.off='1'}else btn.disabled=!!command.disabled; // en movimientos no se usa disabled: así se puede ver su ficha aunque no se pueda usar ahora
        btn.innerHTML='<span class="menuCursor">'+(i===menuIndex?'▶':'')+'</span>';
        const line=document.createElement('span');line.className='menuline';
        const label=document.createElement('span');const touchUI=matchMedia('(pointer:coarse)').matches;label.textContent=(!touchUI&&(i<4||(actionMenu==='moves'&&i<5))?(i+1)+' · ':'')+command.label;line.append(label);
        if(command.detail){let info=document.createElement('span');info.className='menudetail';info.textContent=command.detail;line.append(info)}
        if(command.icon){const ic=document.createElement('span');ic.className='typeBadge';ic.textContent=TYPE_EMOJI[command.icon]||'⚪';ic.style.background=typeColors[command.icon]||'#9ca4a7';ic.title=command.icon;btn.append(ic)}
        btn.append(line);
        if(command.ppText){const pp=document.createElement('span');pp.className='menuPP';pp.textContent=command.ppText;btn.append(pp)}btn.onmouseenter=()=>{menuIndex=i;renderMenuHighlight()};
        // Móvil: mantener pulsado un movimiento muestra su ficha sin ejecutarlo
        let lp=null,lpDone=false;btn.addEventListener('pointerdown',e=>{if(actionMenu!=='moves'||e.pointerType==='mouse')return;lpDone=false;lp=setTimeout(()=>{lpDone=true;menuIndex=i;renderMenuHighlight()},420)});
        const lpEnd=()=>{if(lp){clearTimeout(lp);lp=null}};btn.addEventListener('pointerup',lpEnd);btn.addEventListener('pointerleave',lpEnd);btn.addEventListener('pointercancel',lpEnd);
        btn.addEventListener('contextmenu',e=>{if(actionMenu==='moves')e.preventDefault()});
        btn.onclick=()=>{if(lpDone){lpDone=false;return}
            if(command.disabled)return;menuIndex=i;command.run()};el.append(btn);
    });
    if(bmBack){const x=document.createElement('button');x.type='button';x.className='bmClose';x.textContent='✕';x.title='Volver al menú de acciones';x.setAttribute('aria-label','Volver al menú de acciones');x.onclick=e=>{e.stopPropagation();bmBack.run()};el.append(x)}
    updateMoveInfo();
    const left=selected.x>=8?(selected.x-3.2)*100/W:(selected.x+1.0)*100/W;
    const maxTop=actionMenu==='moves'?44:55;
    el.style.left=Math.max(1,Math.min(72,left))+'%';el.style.top=Math.max(2,Math.min(maxTop,(selected.y+.05)*100/H))+'%';
}
function renderMenuHighlight(){
    const buttons=[...$('battleMenu').querySelectorAll('button:not(.bmClose)')];
    buttons.forEach((b,i)=>{b.classList.toggle('menuActive',i===menuIndex);const c=b.querySelector('.menuCursor');if(c)c.textContent=i===menuIndex?'▶':''});
    updateMoveInfo();
}
function openActionMenu(){if(phase!=='player'||locked||!selected||selected.acted)return;skill=null;actionMenu='actions';menuIndex=0;updateUI();renderBattleMenu()}
function cancelTacticalAction(){
    if(captureMode){cancelCaptureAim();return}
    if(skill!==null){backFromAttack();return}
    if(actionMenu==='moves'){actionMenu='actions';menuIndex=0;renderBattleMenu();return}
    if(actionMenu==='actions'){cancelSelection();return}
    if(inspectedEnemy){inspectedEnemy=null;enemyAnalysis=null;updateUI();return}
    if(selected)cancelSelection();
}
function animateMove(u,path){playSfx('move');
    if(!path||path.length<2)return Promise.resolve();
    locked=true;updateUI();
    return new Promise(resolve=>{
        motion={u,path,start:performance.now(),duration:135,resolve};
    });
}
function lineClear(a,b){if(a.x!==b.x&&a.y!==b.y)return false;let dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y),x=a.x+dx,y=a.y+dy;while(x!==b.x||y!==b.y){if(map[y][x]==='X')return false;x+=dx;y+=dy}return true}
function canAim(u,m,x,y,pos){let p=pos||u,d=Math.abs(p.x-x)+Math.abs(p.y-y);if(m.shape==='self')return d===0;if(d===0||d>m.range)return false;if(m.shape==='line')return (p.x===x||p.y===y)&&lineClear(p,{x,y});if(m.shape==='melee')return d===1;return m.shape==='area'||m.shape==='point'}
// v653 · como en Advance Wars: un movimiento solo se ofrece si tiene a quién afectar desde donde está el Pokémon
function moveUsable(u,mp){if(!mp||mp.pp<=0)return false;const L=encoreLock(u);if(L&&mp.key!==L)return false;const m=moveDB[mp.key];if(m.shape==='self')return true;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(canAim(u,m,x,y)&&aimTargets(u,m,x,y).length)return true;return false}
function canUseMoves(u){return !!u&&u.moves.some(mp=>moveUsable(u,mp))}
function aimTargets(u,m,x,y){if(m.shape==='self')return[u];if(m.shape==='area')return opponent(u).filter(v=>Math.abs(v.x-x)+Math.abs(v.y-y)<=m.radius);const q=occupied(x,y);return q&&q.side!==u.side?[q]:[]}
function stageFactor(stage){return stage>=0?(2+stage)/2:2/(2-stage)}
function effect(type,defTypes){let m=1;for(const d of defTypes)m*=((chart[type]||{})[d]===undefined?1:chart[type][d]);return m}
// En Generacion III la categoria fisico/especial depende del tipo, no de cada movimiento.
const GEN3_PHYSICAL_TYPES=new Set(['normal','fighting','flying','poison','ground','rock','bug','ghost','steel']);
// v0.40: los contraataques son golpes de reacción: sin bono STAB y con potencia reducida.
// Antes eran x0,7 para todos con STAB; eso hacía imposible ganar duelos parejos (p. ej. Charmander Nv5 vs Rattata Nv5 ~16%).
const COUNTER_PLAYER=0.8,COUNTER_ENEMY=0.6;
function damage(u,v,m,random=true,critical=false,noStab=false){
 if(!m||!m.power)return 0;
 const physical=GEN3_PHYSICAL_TYPES.has(m.type);
 let a=physical?u.atk:u.spa,d=physical?v.def:v.spd;
 if(physical)a=Math.floor(a*stageFactor(-u.atkDown));
 d=Math.max(1,Math.floor(d*(physical?stageFactor(v.defUp):1)));
 // Formula de dano Gen III para nivel, potencia, ataque y defensa (sin clima/objetos/habilidades).
 let val=Math.floor(Math.floor((Math.floor(2*u.level/5)+2)*m.power*a/d)/50);
 if(physical&&u.burned)val=Math.floor(val/2);if(m.type==='electric'&&units.some(x=>x.hp>0&&x.mudSport))val=Math.floor(val/2);
 val+=2;
 if(critical)val*=2;
 if(random)val=Math.floor(val*(85+Math.floor(Math.random()*16))/100);
 if(!noStab&&base[u.id].types.includes(m.type))val=Math.floor(val*1.5);
 let eff=1;for(const dt of base[v.id].types){const e1=((chart[m.type]||{})[dt]===undefined?1:chart[m.type][dt]);eff*=e1;val=Math.floor(val*e1)}
 let mult=1;
 if(terrain(v.x,v.y)==='F')mult*=.85;
 if(terrain(v.x,v.y)==='^')mult*=.9;
 return Math.max(eff>0&&mult>0?1:0,Math.floor(val*mult));
}
function log(s){const e=document.createElement('div');e.textContent=s;$('log').prepend(e);while($('log').children.length>18)$('log').lastChild.remove()}
function statusSummary(u){
 const terms=[];
 if(u.atkDown>0)terms.push('⚔ Ataque ↓'+u.atkDown+' ('+effectTurnsLeft(u,'atkDown')+'T)');
 if(u.atkDown<0)terms.push('⚔ Ataque ↑'+Math.abs(u.atkDown)+' ('+effectTurnsLeft(u,'atkDown')+'T)');
 if(u.defUp<0)terms.push('🛡 Defensa ↓'+Math.abs(u.defUp)+' ('+effectTurnsLeft(u,'defUp')+'T)');
 if(u.defUp>0)terms.push('🛡 Defensa ↑'+u.defUp+' ('+effectTurnsLeft(u,'defUp')+'T)');
 if(u.accuracyDown>0)terms.push('🎯 Precisión ↓'+u.accuracyDown+' ('+effectTurnsLeft(u,'accuracyDown')+'T)');
 if(u.poisoned)terms.push('☠ Envenenado (−1/8 PS por ronda)');
 if(u.trapped)terms.push('🪢 Atrapado ('+effectTurnsTrap(u)+'T) · no puede moverse');
 if(u.critUp)terms.push('🎯 Crítico ↑');
 if(u.burned)terms.push('🔥 Quemado');
 if(u.paralyzed)terms.push('⚡ Paralizado');if(encoreLock(u))terms.push('🔁 Otra Vez: repite '+moveDB[u.encoreKey].name);
 if(u.asleep>0)terms.push('💤 Dormido');
 if(u.seeded)terms.push('🌱 Drenadoras');
 return terms.length?' · '+terms.join(' · '):'';
}
function updateRoster(){let allies=units.filter(u=>u.side==='player');$('roster').innerHTML='';for(const u of allies){let b=base[u.id],el=document.createElement('div');el.className='unitcard'+(selected===u?' selected':'')+(u.acted||u.hp<=0?' finished':'');let pr=document.createElement('div');pr.className='portrait';{const pp=porSrc(u,{sel:selected===u,win:phase==='win'});if(pp){const i=document.createElement('img');i.src=pp;i.alt=b.name;i.style.cssText='width:100%;height:100%;image-rendering:pixelated;object-fit:contain';pr.append(i)}else pr.append(pmdAnimCanvas(pkId(u),40,true))}let body=document.createElement('div');body.className='cardtext';body.innerHTML='<div class="cardtitle"><span>'+(u.shiny?'✨ ':'')+b.name+'</span><span>Nv. '+u.level+'</span></div><div class="bar"><i style="width:'+100*Math.max(0,u.hp/u.maxHp)+'%;background:'+(u.hp/u.maxHp<.3?'#e58e75':'#73d8a3')+'"></i></div><div class="hptext">PS '+u.hp+' / '+u.maxHp+(u.acted?' · LISTO':'')+(u.paralyzed?' · ⚡':'')+(u.slowed?' · 👣 '+movementAllowance(u)+'/'+base[u.id].move+' PM ('+effectTurnsLeft(u,'slow')+'T)':'')+statusSummary(u)+'</div><div class="lvlExp">EXP '+u.xp+' / '+xpRequired(u.level,u.id)+'</div><div class="rosterExp"><i style="width:'+100*Math.min(1,u.xp/xpRequired(u.level,u.id))+'%"></i></div>';el.append(pr,body);el.onclick=()=>choose(u);$('roster').append(el)}}
function updateUI(){updateMoveInfo();updateMoneyUI();dexTrack();$('openDex').style.display=dexUnlocked()?'':'none';$('abandonBtn').style.display=(currentEncounter&&(phase==='player'||phase==='enemy'))?'':'none';$('abandonBtn').disabled=phase!=='player'||locked||cinematicBusy||!!motion||progressIsOpen;
    let isPlayer=phase==='player',remaining=units.filter(u=>u.side==='player'&&u.hp>0&&!u.acted).length;
    $('remaining').textContent=remaining+' disponibles';
    $('phaseChip').textContent=phase==='player'?'FASE DEL JUGADOR · RONDA '+round:phase==='enemy'?'FASE ENEMIGA · RONDA '+round:phase==='win'?(currentEncounter?'¡VICTORIA!':'🗺️ MAPA DE KANTO'):'POKÉMON TACTICS';
    $('endTurn').disabled=!isPlayer||locked||!!captureMode;
    $('openCampaign').disabled=phase==='enemy'||cinematicBusy||motion||progressIsOpen;
    let focus=selected||inspectedEnemy;
    try{const di=$('locationLabel');if(di){const ce=currentEncounter,cd=ce&&CAMPAIGN[ce.id];
     if(window.__campOn||stageId==='camp'){di.classList.remove('duel');if(di._h!=='camp'){di._h='camp';di.textContent='⛺ CAMPAMENTO · KANTO'}}
     else if(!ce||!cd){di.classList.remove('duel')}else{
      const esc=s=>String(s).replace(/[<>&]/g,''),foes=units.filter(q=>q.side==='enemy'&&q.hp>0).map(q=>esc(base[q.id].name)+' Nv.'+q.level);
      let who;if(ce.kind==='main'&&(cd.mainKind==='trainer'||cd.mainKind==='boss')){const p=String(cd.main||'').split(' · ');who=(cd.mainKind==='boss'?'👑 ':'⚔ ')+esc(p[0]||'Entrenador')}
      else if(ce.kind==='main'&&cd.mainKind==='event')who='📦 '+esc(cd.main);
      else if(ce.kind==='practice')who='🥋 Entrenamiento de gimnasio';
      else if(ce.fish)who='🎣 Pesca';
      else who='🌿 Pokémon salvajes';
      const html='<span class="diLoc">'+esc(cd.icon+' '+String(cd.name||'').toUpperCase())+' · KANTO</span><span class="diWho">'+who+'</span>'+(foes.length?'<span class="diFoes">'+foes.join(' · ')+'</span>':'');
      if(di._h!==html||!di.querySelector('.diLoc')){di._h=html;di.innerHTML=html}di.classList.add('duel')}}}catch(e){}
    $('selection').textContent=focus?base[focus.id].name:'Sin selección';
    $('enemyInfo').classList.toggle('hide',!inspectedEnemy);
    $('enemyInfo').innerHTML=inspectedEnemy?'<b>🔴 ENEMIGO · '+(inspectedEnemy.shiny?'✨ ':'')+base[inspectedEnemy.id].name+'</b><br>Nivel '+inspectedEnemy.level+' · PS '+inspectedEnemy.hp+'/'+inspectedEnemy.maxHp+'<br>Movilidad '+movementAllowance(inspectedEnemy)+'/'+base[inspectedEnemy.id].move+' PM'+(inspectedEnemy.slowed?' · 👣 −2 ('+effectTurnsLeft(inspectedEnemy,'slow')+'T)':'')+statusSummary(inspectedEnemy)+'<div class="enTip">🟥 Rojo: casillas de movimiento.<br>🟧 Ámbar: zonas que puede atacar después de moverse.<br>Pulsa Esc para cerrar.</div>':'';
    $('moves').innerHTML='';
    if(focus){
        for(const mp of focus.moves){
            let m=moveDB[mp.key],item=document.createElement('div');item.className='move';item.style.cursor='default';
            item.style.borderLeft='4px solid '+(typeColors[m.type]||'#9ca4a7');
            item.innerHTML='<b>'+(TYPE_EMOJI[m.type]||'⚪')+' '+m.name+'</b><small>PP '+mp.pp+'/'+m.pp+'</small>';
            $('moves').append(item)
        }
    }else $('moves').innerHTML='<span class="tiny">Selecciona un Pokémon para ver sus cuatro movimientos.</span>';
    $('instruction').textContent=phase==='enemy'?'Espera la fase enemiga…':phase==='win'?(currentEncounter?'¡Encuentro completado!':'Selecciona un destino en el mapa de Kanto.'):inspectedEnemy?'Alcance de '+base[inspectedEnemy.id].name+' desde su posición actual.':'Selecciona un Pokémon aliado. '; 
    if(selected){
        if(selected.acted)$('instruction').textContent='Este Pokémon ya terminó su acción.';
        else if(captureMode)$('instruction').textContent=captureMode.itemId?'🎯 Elige a quién usar el objeto: tú o un aliado adyacente. Pulsa Volver o Esc para cancelar sin gastarlo.':'🎯 Selecciona un Pokémon salvaje a '+CAPTURE_RANGE+' casillas. Pulsa Volver o Esc para cancelar sin gastar la Poké Ball.';
        else if(skill!==null)$('instruction').textContent='🎯 '+moveDB[selected.moves[skill].key].detail+'. Selecciona un objetivo. Pulsa Volver o Esc para elegir otro ataque.';
        else if(actionMenu)$('instruction').textContent='Utiliza el menú desplegable sobre el tablero.';
        else if(selected.moved)$('instruction').textContent='Elige Movimientos, Objeto, Esperar o Cancelar.';
        else $('instruction').textContent='Selecciona una casilla azul para moverlo; confirma sobre su casilla para actuar sin moverse.';
    }
    try{window.__enemyCard&&window.__enemyCard(inspectedEnemy)}catch(_){}try{window.__tutHint&&window.__tutHint()}catch(_){}
    $('turnNote').textContent=phase==='enemy'?'Turno enemigo: observa sus movimientos.':phase==='player'?'Ronda '+round+' · '+remaining+' Pokémon por actuar':phase==='win'?(currentEncounter?'¡Encuentro completado!':'Mapa de rutas disponible'):'Derrota a los rivales.';
    $('moveinfo').textContent=inspectedEnemy?'Movilidad: '+movementAllowance(inspectedEnemy)+'/'+base[inspectedEnemy.id].move+' PM'+(inspectedEnemy.slowed?' (Disparo Demora: −2, '+effectTurnsLeft(inspectedEnemy,'slow')+'T)':'')+' · La zona ámbar incluye ataques tras el desplazamiento.':selected&&!selected.acted?'Movimiento: '+movementAllowance(selected)+'/'+base[selected.id].move+' PM'+(selected.slowed?' (ralentizado '+effectTurnsLeft(selected,'slow')+'T)':'')+' · '+(selected.moved?'En posición final':'Pendiente'):'El menú de 4 acciones aparece al confirmar la posición.';
    updateRoster();updateLab();updateTileHint();updateManagementSummary();syncAttackBack();
}
function choose(u){if(phase!=='player'||locked||captureMode||actionMenu||u.side!=='player'||u.hp<=0)return;if(selected===u&&!u.acted){openActionMenu();return}playCry(u.id);inspectedEnemy=null;enemyAnalysis=null;selected=u;skill=null;closeBattleMenu();if(usingKeyboard){keyboardCursor={x:u.x,y:u.y};hovered={...keyboardCursor}}updateUI();updateTileHint()}
function chooseSkill(i){if(phase!=='player'||!selected||selected.acted||locked)return;const m=selected.moves[i];if(m.pp<=0)return;{const _L=encoreLock(selected);if(_L&&m.key!==_L){log('🔁 '+base[selected.id].name+' está bajo Otra Vez y solo puede usar '+moveDB[_L].name+'.');return}}skill=(skill===i?null:i);    if(skill!==null&&moveDB[m.key].shape==='self'){perform(selected,i,selected.x,selected.y);return}updateUI();syncAttackBack();updateTileHint();updateMoveInfo()}
function cancelMovement(){if(phase!=='player'||!selected||!selected.moved||selected.acted||!selected.origin||locked)return;selected.x=selected.origin.x;selected.y=selected.origin.y;selected.moved=false;selected.origin=null;skill=null;log('↩ Movimiento cancelado.');updateUI();updateTileHint()}
function wait(){if(!selected||phase!=='player'||locked||selected.acted)return;closeBattleMenu();selected.acted=true;selected.moved=true;if(selected.asleep>0)selected.asleep--;selected.flinch=false;log('⏳ '+base[selected.id].name+' espera.');selected=null;skill=null;nextIfAll();updateUI();updateTileHint();autoSaveSafe()}
function nextIfAll(){if(phase==='player'&&units.filter(u=>u.side==='player'&&u.hp>0).every(u=>u.acted)){selected=null;skill=null;setTimeout(beginEnemy,650)}}

