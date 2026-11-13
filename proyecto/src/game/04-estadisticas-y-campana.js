function loadSpriteWithFallback(id,kind){
 const data={img:new Image(),ready:false,source:'local',attempt:0};
 const local=localSprite(id,kind);
 data.img.onload=()=>{data.ready=true;refreshAfterSprite(kind)};
 data.img.src=local;
 spriteCounters.offline++;
 try{
  const cached=localStorage.getItem(SPRITE_CACHE_VERSION+kind+'-'+id);
  if(cached){
   const saved=new Image();
   saved.onload=()=>{
    if(data.source==='local'){
     data.img=saved;data.ready=true;data.source='cached';
     spriteCounters.remote++;spriteCounters.offline=Math.max(0,spriteCounters.offline-1);
     refreshAfterSprite(kind);
    }
   };
   saved.src=cached;
  }
 }catch(e){}
 // Sprite incrustado: no necesita red. Si existe, no se intentan los espejos.
 const embeddedURI=(EMBEDDED_SPRITES[kind]||{})[id];
 if(embeddedURI){
  const emb=new Image();
  emb.onload=()=>{
   const wasLocal=data.source==='local';
   data.img=emb;data.ready=true;data.source='embedded';
   if(wasLocal){spriteCounters.remote++;spriteCounters.offline=Math.max(0,spriteCounters.offline-1)}
   refreshAfterSprite(kind);
  };
  emb.src=embeddedURI;
  return data;
 }
 // Dos espejos; el gráfico local siempre queda disponible si ambos fallan.
 function attempt(i){
  if(i>=SPRITE_MIRRORS.length)return;
  const probe=new Image();probe.crossOrigin='anonymous';
  let finished=false;
  const next=()=>{if(finished)return;finished=true;attempt(i+1)};
  probe.onload=()=>{
   if(finished)return;finished=true;
   const wasLocal=data.source==='local';data.img=probe;data.ready=true;data.source='remote';
   if(wasLocal){spriteCounters.remote++;spriteCounters.offline=Math.max(0,spriteCounters.offline-1)}
   cacheSprite(id,kind,probe);refreshAfterSprite(kind);
  };
  probe.onerror=next;
  probe.src=SPRITE_MIRRORS[i]+spriteFile(id,kind);
  setTimeout(next,2700);
 }
 attempt(0);
 return data;
}
function fetchSprite(id){if(!sprites[id])sprites[id]=loadSpriteWithFallback(id,'front');return sprites[id]}
function getMiniSprite(id){if(!miniSprites[id])miniSprites[id]=loadSpriteWithFallback(id,'mini');return miniSprites[id]}
function updateSpriteBanner(){
 const el=document.getElementById('spriteNotice');if(!el)return;el.style.display=/[?&]debug/.test(location.search)?'':'none';
 if(spriteCounters.remote>0){el.textContent='🎨 Sprites GBA: '+spriteCounters.remote+' disponibles';el.title='Se han descargado sprites originales de FireRed/LeafGreen';}
 else {el.textContent='🎨 Dibujos de respaldo';el.title='Los sprites oficiales no se están descargando en este visor. Abre el HTML fuera de la vista previa para intentar cargar los de FireRed/LeafGreen.';}
}
// Gen III: valores base canonicos + IV por ejemplar, EV 0 y naturaleza neutra (ambos se ampliaran despues).
// Los Pokemon de partidas antiguas mantienen los IV 15 con los que se calcularon originalmente.
const IV_NAMES=['hp','atk','def','spa','spd','speed'];
function normalizeIVs(value){
 const out={};for(const name of IV_NAMES){const raw=value&&Number(value[name]);out[name]=Number.isInteger(raw)&&raw>=0&&raw<=31?raw:15}return out;
}
function rollIVs(){const out={};for(const name of IV_NAMES)out[name]=Math.floor(Math.random()*32);return out}
const BADGE_BOOST={pewter:['atk'],vermilion:['speed'],fuchsia:['def'],cinnabar:['spa','spd']};
function statCalc(u){
 const b=base[u.id].stats,v=normalizeIVs(u.ivs),n=u.level;u.ivs=v;
 u.maxHp=Math.floor((2*b[0]+v.hp)*n/100)+n+10;
 u.atk=Math.floor((2*b[1]+v.atk)*n/100)+5;
 u.def=Math.floor((2*b[2]+v.def)*n/100)+5;
 u.spa=Math.floor((2*b[3]+v.spa)*n/100)+5;
 u.spd=Math.floor((2*b[4]+v.spd)*n/100)+5;
 u.speed=Math.floor((2*b[5]+v.speed)*n/100)+5;
 // v653: en el primer combate (rival en Pueblo Paleta) el rival pega un poco menos y aguanta un poco menos; PS y velocidad sin cambios
 if(u.side==='enemy'&&typeof currentEncounter!=='undefined'&&currentEncounter&&currentEncounter.id==='pallet'&&currentEncounter.kind==='main'){u.atk=Math.round(u.atk*.8);u.spa=Math.round(u.spa*.8);u.def=Math.round(u.def*.9);u.spd=Math.round(u.spd*.9)}
 if(u.side==='player'){try{for(const g in BADGE_BOOST)if(stageCleared.has(g))for(const k of BADGE_BOOST[g])u[k]=Math.floor(u[k]*1.1)}catch(e){}}
}
function unit(id,side,x,y,lvl,moves,ivs=null){let u={id,side,x,y,level:lvl,ivs:normalizeIVs(ivs),moves:moves.map(k=>({key:k,pp:moveDB[k].pp})),hp:0,moved:false,acted:false,atkDown:0,defUp:0,accuracyDown:0,effectTimers:{slow:0,atkDown:0,defUp:0,accuracyDown:0},paralyzed:false,burned:false,seeded:false,poisoned:false,trapped:false,trapBy:null,critUp:false,asleep:0,counterUsed:false,xp:0,slowed:false,lastEvoOffer:0};statCalc(u);u.hp=u.maxHp;fetchSprite(id);getMiniSprite(id);getBackSprite(id);return u}
let units=[],selected=null,inspectedEnemy=null,enemyAnalysis=null,actionMenu=null,menuIndex=0,skill=null,phase='intro',round=1,locked=false,movedFrom=null,pendingEvolutions=[],wins=0;
let hovered=null, keyboardCursor={x:1,y:7}, usingKeyboard=false, mouseOnBoard=false, motion=null, reviveEffect=null, healEffect=null, statusEffects=[];

// --- CAMPAÑA v0.13: lugares de Kanto, encuentros por lugar y opciones de ruta ---
// Listas locales de especies fieles a FireRed / LeafGreen; probabilidades adaptadas al prototipo.
const FOREST_GRID=['............','..F...X...F.','.F....X.....','...F.....F..','.....~~.....','..F..~~..F..','..F......F..','........X...','...F........','............'];
const CAMPAIGN={
 pallet:{recommended:[5,5],name:'Pueblo Paleta',icon:'🔬',desc:'El comienzo de la aventura. Duelo de práctica con tu rival: ganar es posible, pero perder tampoco te impide viajar a Ruta 1.',terrain:[
 '............','..F......F..','............','....XX......','............','.........F..','..F.........','............','.....F......','............'],wild:[],main:'Tu primer duelo con el rival',mainKind:'trainer',team:[{id:7,level:5}]},
 route1:{recommended:[5,6],name:'Ruta 1',icon:'🌾',desc:'La senda desde Pueblo Paleta hasta Ciudad Verde. Aquí viven Pidgey y Rattata.',terrain:[
 '............','...F....F...','............','....F.......','............','.......F....','..F.........','............','....F.......','............'],wild:[{id:16,w:50,min:2,max:5},{id:19,w:50,min:2,max:4}],main:'Cruzar la Ruta 1',mainKind:'wild'},
 viridian:{recommended:[5,7],name:'Ciudad Verde',icon:'🏙️',desc:'Ciudad al norte de Pueblo Paleta. Visita su Tienda Poké, recoge el paquete y entrégaselo al Profesor Oak. Al oeste se abre la Ruta 22, donde te espera tu rival.',terrain:[
 '............','...X....X...','............','..F.........','............','.....X......','...F.....F..','............','............','............'],wild:[],main:'Entregar el paquete al Profesor Oak',mainKind:'event'},
 route2in:{recommended:[6,7],name:'Ruta 2 · Entrada',icon:'🌲',desc:'Camino al norte de Ciudad Verde que lleva a la entrada del Bosque Verde. Sus hierbas esconden Pidgey, Rattata, Caterpie y Weedle.',terrain:['.FF..FF.....','.FF...FFFFF.','............','............','............','............','............','............','............','............'],wild:[{id:16,w:45,min:2,max:5},{id:19,w:45,min:2,max:5},{id:10,w:5,min:4,max:5},{id:13,w:5,min:4,max:5}],main:'Atravesar la Ruta 2 (entrada)',mainKind:'wild'},
 route2:{recommended:[8,9],name:'Ruta 2 · Salida',icon:'🌲',desc:'Tramo al norte del Bosque Verde que lleva a Ciudad Plateada. Sus hierbas esconden Pidgey, Rattata, Caterpie y Weedle.',terrain:[
 '............','..F.X...F...','...F....F...','......F.....','..F......F..','.....XX.....','..F....F....','.....F......','..F.........','............'],wild:[{id:16,w:45,min:4,max:6},{id:19,w:45,min:4,max:6},{id:10,w:5,min:5,max:6},{id:13,w:5,min:5,max:6}],main:'Atravesar la Ruta 2 (salida)',mainKind:'wild'},
 forest:{recommended:[7,9],name:'Bosque Verde 1',icon:'🌳',desc:'El laberinto de los Cazabichos. Caterpie y Weedle son habituales; Pikachu es poco frecuente.',terrain:FOREST_GRID,wild:[{id:10,w:40,min:3,max:5},{id:13,w:40,min:3,max:5},{id:11,w:5,min:4,max:6},{id:14,w:10,min:4,max:6},{id:25,w:5,min:3,max:5}],main:'Cazabichos Rick',mainKind:'trainer',team:[{id:13,level:6},{id:10,level:6}]},
 forestdoug:{recommended:[7,9],name:'Bosque Verde · Sendero',icon:'🌳',desc:'Más Cazabichos acechan entre los árboles del bosque.',terrain:FOREST_GRID,wild:[],main:'Cazabichos Doug · Weedle, Kakuna y Weedle Nv. 7',mainKind:'trainer',team:[{id:13,level:7},{id:14,level:7},{id:13,level:7}]},
 forestexit:{recommended:[8,10],name:'Bosque Verde 2',icon:'🍃',desc:'Último desafío antes de Ciudad Plateada. El Cazabichos Charlie usa Metapod y Caterpie de nivel 7, como en Rojo Fuego / Verde Hoja. Puedes volver al Bosque Verde para entrenar.',terrain:[
 '............','..F..F..F...','.....F......','..F......F..','.....X......','...F....F...','......F.....','..F.....F...','.....F......','............'],wild:[],main:'Cazabichos Charlie · Metapod, Caterpie y Metapod Nv. 7',mainKind:'trainer',team:[{id:11,level:7},{id:10,level:7},{id:11,level:7}]},
 gymguard:{recommended:[10,12],name:'Gimnasio de Ciudad Plateada',icon:'🚪',desc:'Antes de enfrentarte al líder, supera al campista Liam dentro del gimnasio.',terrain:[
 '............','..X......X..','............','....X.......','............','..X......X..','............','....X.......','............','............'],wild:[],main:'Campista Liam · combate previo',mainKind:'trainer',team:[{id:74,level:10,moves:['tackle','curl']},{id:27,level:11,moves:['scratch','curl','sand']}]},
 pewter:{recommended:[12,14],name:'Ciudad Plateada · Brock',icon:'🪨',desc:'Combate final del capítulo. Brock es especialista en Roca y Tierra. ¡Gana la primera medalla de Kanto y un lugar más en tu equipo de batalla!',terrain:[
 '............','...X....X...','............','..X.........','......X.....','..X......X..','............','...X........','............','............'],wild:[],main:'Líder Brock · Medalla Roca',mainKind:'boss',team:[{id:74,level:12,moves:['tackle','curl']},{id:95,level:14,moves:['tackle','screech','bind','rocktomb']}]},
 route22:{recommended:[8,10],name:'Ruta 22',icon:'🌾',desc:'Camino al oeste de Ciudad Verde que lleva hacia la Calle Victoria. Aquí te espera tu rival para un duelo opcional, y en su hierba aparecen Mankey, Spearow, Rattata y Nidoran.',terrain:[
 '............','..F....F....','............','....X.......','............','..F....X....','............','......F.....','............','............'],wild:[{id:21,w:35,min:3,max:5},{id:19,w:25,min:2,max:5},{id:56,w:20,min:2,max:5},{id:29,w:10,min:2,max:4},{id:32,w:10,min:2,max:4}],main:'Rival · Ruta 22',mainKind:'trainer',team:[{id:16,level:9},{id:7,level:9}]},
 // Los datos originales de las etapas siguientes se mantienen para reconocer guardados v0.19.
 route3:{recommended:[11,14],name:'Ruta 3',icon:'⛰️',desc:'El camino entre Ciudad Plateada y el Monte Moon, lleno de entrenadores y salientes rocosos. Aquí viven Spearow, Pidgey, Jigglypuff, Mankey y Nidoran.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:21,w:35,min:6,max:8},{id:16,w:30,min:6,max:7},{id:29,w:8,min:6,max:7},{id:32,w:8,min:6,max:7},{id:39,w:9,min:3,max:7},{id:56,w:10,min:7,max:7}],main:'Joven Ben · Ruta 3',mainKind:'trainer',team:[{id:19,level:10},{id:23,level:10},{id:21,level:10}]},
 route3b:{recommended:[11,14],name:'Ruta 3 · Sendero',icon:'⛰️',desc:'Otra entrenadora vigila el paso hacia el Monte Moon.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Chica Robin · Jigglypuff Nv. 14',mainKind:'trainer',team:[{id:39,level:14}]},
 lunar:{recommended:[10,10],name:'???',icon:'🌑',desc:'Un lugar que no figura en ningún mapa.',terrain:[
 'XXXXXXXXXXXX','XX........XX','X..X....X..X','X..........X','X...XX.....X','X..........X','X.....X....X','X..........X','XX.......X.X','XXXXXXXXXXXX'],wild:[{id:725,w:50,min:10,max:10},{id:443,w:50,min:10,max:10}],main:'???',mainKind:'wild'},
 camp:{recommended:[11,14],name:'Campamento',icon:'⛺',desc:'Zona de descanso del equipo.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'',mainKind:'trainer',team:[]},
 mtmoonj:{recommended:[11,13],name:'Monte Moon',icon:'🌙',desc:'La cueva que cruza la montaña. Está llena de Zubat, Geodude y Paras, y de entrenadores que cuidan sus túneles. Con suerte, verás un Clefairy.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:41,w:60,min:7,max:10},{id:74,w:25,min:7,max:9},{id:46,w:10,min:8,max:8},{id:35,w:5,min:8,max:8}],main:'Super Nerd Jovan · Magnemite y Voltorb Nv. 11',mainKind:'trainer',team:[{id:81,level:11},{id:100,level:11}]},
 mtmoon:{recommended:[12,15],name:'Monte Moon · Galería',icon:'🌙',desc:'La cueva que cruza la montaña. Está llena de Zubat, Geodude y Paras, y de entrenadores que cuidan sus túneles. Con suerte, verás un Clefairy.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Montañero Marcos · Monte Moon',mainKind:'trainer',team:[{id:74,level:10},{id:74,level:10},{id:95,level:10}]},
 mtmoonb:{recommended:[13,16],name:'Monte Moon · Subsuelo',icon:'🕳️',desc:'El fondo de la cueva, donde la Team Rocket busca los fósiles. Cuidado con los Zubat y los reclutas que patrullan.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:41,w:45,min:8,max:11},{id:74,w:30,min:9,max:10},{id:35,w:5,min:10,max:10},{id:46,w:20,min:10,max:12}],main:'Reclutas Rocket · Monte Moon',mainKind:'trainer',team:[{id:27,level:12},{id:19,level:13},{id:41,level:13}]},
 mtmoonc:{recommended:[13,16],name:'Monte Moon · Subsuelo II',icon:'🕳️',desc:'El fondo de la cueva, donde la Team Rocket busca los fósiles. Cuidado con los Zubat y los reclutas que patrullan.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:41,w:45,min:8,max:11},{id:74,w:30,min:9,max:10},{id:35,w:5,min:10,max:10},{id:46,w:20,min:10,max:12}],main:'Super Nerd Miguel · Grimer, Voltorb y Koffing Nv. 12',mainKind:'trainer',team:[{id:88,level:12},{id:100,level:12},{id:109,level:12}]},
 route4:{recommended:[14,17],name:'Ruta 4',icon:'🌾',desc:'Al oeste de Ciudad Celeste, bajo la sombra del Monte Moon. Es zona de Spearow, Rattata, Ekans y algún Mankey. ¡Ya se huele el agua de Celeste!',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:21,w:25,min:8,max:12},{id:19,w:25,min:8,max:12},{id:23,w:25,min:6,max:12},{id:56,w:5,min:10,max:12}],main:'Cruzar la Ruta 4',mainKind:'wild'},
 nugget:{recommended:[14,18],name:'Ruta 24 · Chica Ali',icon:'🌉',desc:'Al norte de Ciudad Celeste, la Ruta 24 y su Puente Pepita están llenos de entrenadores que desafían a quien lo cruza. La primera es Ali, con tres Pokémon.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:16,w:30,min:8,max:12},{id:43,w:20,min:12,max:14},{id:69,w:20,min:12,max:14},{id:10,w:10,min:7,max:8},{id:13,w:10,min:7,max:8},{id:63,w:10,min:8,max:12}],main:'Chica Ali · Pidgey, Oddish y Bellsprout Nv. 12',mainKind:'trainer',team:[{id:16,level:12},{id:43,level:12},{id:69,level:12}]},
 nuggetrocket:{recommended:[14,18],name:'Ruta 24 · Recluta Rocket',icon:'🅡',desc:'Al final del puente espera un miembro del Team Rocket. Si lo derrotas, te regala una Pepita antes de huir.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Recluta Rocket · Ekans y Zubat Nv. 15',mainKind:'trainer',team:[{id:23,level:15},{id:41,level:15}]},
 route25train:{recommended:[15,19],name:'Ruta 25 · Hierba alta',icon:'🌿',desc:'Hierba alta bajo el acantilado, con la playa al sur.',terrain:[
 'XXXXXXXXXXXX','............','............','............','............','XXXXX..XXXXX','............','............','............','............'],wild:[{id:43,w:22,min:12,max:14},{id:69,w:22,min:12,max:14},{id:10,w:16,min:8,max:8},{id:13,w:16,min:7,max:8},{id:16,w:12,min:11,max:13},{id:63,w:12,min:9,max:12}],main:'Entrenar',mainKind:'wild'},
 route25:{recommended:[15,19],name:'Ruta 25 · Montañista Nob',icon:'⛰️',desc:'La Ruta 25 bordea la costa al norte de Ciudad Celeste, rumbo a la casa de Bill. El primer entrenador es Nob, un montañista con cuatro Pokémon.',terrain:[
 'XXXXXXXXXXXX','...X...X....','...X...X....','............','....X.X.X...','..XX....X.XX','....X...X...','.X......X...','.X......X.X.','....X....X..'],wild:[{id:43,w:22,min:12,max:14},{id:69,w:22,min:12,max:14},{id:10,w:16,min:8,max:8},{id:13,w:16,min:7,max:8},{id:16,w:12,min:11,max:13},{id:63,w:12,min:9,max:12}],main:'Montañista Nob · Geodude x3 y Machop Nv. 13',mainKind:'trainer',team:[{id:74,level:13},{id:74,level:13},{id:66,level:13},{id:74,level:13}]},
 route25b:{recommended:[15,19],name:'Ruta 25 · Chica Haley',icon:'🌼',desc:'Más adelante, cerca de la costa, la Chica Haley te reta con su equipo de plantas y un pajarito.',terrain:[
 'XXXXXXXXXXXX','...X...X....','...X...X....','............','....X.X.X...','..XX....X.XX','....X...X...','.X......X...','.X......X.X.','....X....X..'],wild:[],main:'Chica Haley · Oddish, Pidgey y Oddish Nv. 13',mainKind:'trainer',team:[{id:43,level:13},{id:16,level:13},{id:43,level:13}]},
 bill:{recommended:[15,19],name:'Casa de Bill',icon:'🎫',desc:'Al final de la Ruta 25 vive Bill, un coleccionista de Pokémon. Algo salió mal con su máquina.',terrain:[
 'XXXXXXXXXXXX','...X...X....','...X...X....','............','....X.X.X...','..XX....X.XX','....X...X...','.X......X...','.X......X.X.','....X....X..'],wild:[],main:'Visitar a Bill · Boleto S.S.',mainKind:'event'},
 nuggettrain:{recommended:[14,18],name:'Ruta 24 · Hierba alta',icon:'🌿',desc:'Franja de hierba alta junto al río, al oeste del Puente Pepita.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:16,w:30,min:8,max:12},{id:43,w:20,min:12,max:14},{id:69,w:20,min:12,max:14},{id:10,w:10,min:7,max:8},{id:13,w:10,min:7,max:8},{id:63,w:10,min:8,max:12}],main:'Entrenar',mainKind:'wild'},
 ceruleanrival:{recommended:[16,19],name:'Ciudad Celeste · Rival',icon:'⚔️',desc:'Al llegar a Ciudad Celeste, tu rival te intercepta frente al puente de la Ruta 24. Ya ha evolucionado a su inicial y trae un equipo variado.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Tu rival · Pidgeotto, Abra, Rattata e inicial Nv. 15-18',mainKind:'trainer',team:[{id:17,level:18},{id:63,level:17},{id:19,level:15},{id:4,level:18}]},
 ceruleanguard:{recommended:[15,18],name:'Gimnasio de Ciudad Celeste',icon:'🚪',desc:'Antes de enfrentarte a Misty, supera a los nadadores y campistas de su piscina: Luis y Diana te ponen a prueba.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Luis y Diana · combate previo',mainKind:'trainer',team:[{id:116,level:16},{id:90,level:16},{id:118,level:19}]},
 cerulean:{recommended:[18,22],name:'Ciudad Celeste · Misty',icon:'💧',desc:'Combate final del capítulo. Misty es especialista en Agua. ¡Gana la Medalla Cascada!',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Líder Misty · Medalla Cascada',mainKind:'boss',team:[{id:120,level:18,moves:['tackle','harden','waterpulse','bubble']},{id:121,level:21,moves:['swift','waterpulse','tackle','rapidspin']}]},
 route5:{recommended:[16,19],name:'Ruta 5 · Campista Ron',icon:'🌾',desc:'Al sur de Ciudad Celeste, el camino que baja hacia Ciudad Carmín. Hierba alta con Pidgey, Oddish, Bellsprout y algún Mankey. Ron, un campista, te cierra el paso.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:16,w:30,min:13,max:16},{id:43,w:20,min:13,max:15},{id:69,w:20,min:13,max:15},{id:56,w:15,min:13,max:15},{id:19,w:15,min:12,max:14}],main:'Campista Ron · Mankey, Rattata y Mankey Nv. 14',mainKind:'trainer',team:[{id:56,level:14},{id:19,level:13},{id:56,level:14}]},
 route6:{recommended:[17,20],name:'Ruta 6 · Cazabichos Nate',icon:'🌲',desc:'Último tramo antes de Ciudad Carmín, entre árboles y un pequeño estanque. El Cazabichos Nate cuida su colección de bichos.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[{id:16,w:30,min:14,max:17},{id:43,w:20,min:14,max:16},{id:69,w:20,min:14,max:16},{id:56,w:15,min:14,max:16},{id:10,w:15,min:10,max:12}],main:'Cazabichos Nate · Kakuna, Butterfree y Kakuna Nv. 15',mainKind:'trainer',team:[{id:14,level:14},{id:12,level:15},{id:14,level:14}]},
 vermilionrival:{recommended:[19,22],name:'Ciudad Carmín · Rival en el S.S. Anne',icon:'🚢',desc:'En el muelle de Ciudad Carmín, junto al S.S. Anne, tu rival te desafía de nuevo. Sus Pokémon ya evolucionaron.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Tu rival · Pidgeotto, Raticate, Abra e inicial Nv. 17-20',mainKind:'trainer',team:[{id:17,level:19},{id:20,level:17},{id:63,level:19},{id:5,level:20}]},
 vermilionguard:{recommended:[19,22],name:'Gimnasio de Ciudad Carmín',icon:'🚪',desc:'Antes de enfrentarte al Teniente Surge, supera a los entrenadores que custodian el gimnasio: un marinero y un rockero con Pokémon eléctricos.',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Marinero Dwayne y Rockero Jim · combate previo',mainKind:'trainer',team:[{id:81,level:18},{id:100,level:19},{id:25,level:20}]},
 vermilion:{recommended:[22,26],name:'Ciudad Carmín · Teniente Surge',icon:'⚡',desc:'Combate final del capítulo. El Teniente Surge es un especialista en tipo Eléctrico. ¡Gana la Medalla Trueno!',terrain:[
 '............','..X..X......','....X.......','..X....X....','............','....X....X..','..X.........','......X.....','..X.........','............'],wild:[],main:'Teniente Surge · Medalla Trueno',mainKind:'boss',team:[{id:100,level:21,moves:['tackle','screech','shock','wave']},{id:25,level:18,moves:['quick','wave','shock','doubleteam']},{id:26,level:24,moves:['bolt','slam','quick','wave']}]}
};
const DEVU=true; // MODO PRUEBA: todas las etapas habilitadas (poner false para desactivar)
if(!DEVU)document.querySelectorAll('.devOnly').forEach(e=>{e.style.display='none'});
const SHOP_STAGES=new Set(['pewter','cerulean','vermilion']);
const STAGE_ORDER=['pallet','route1','viridian','route2in','forest','forestdoug','forestexit','route2','gymguard','pewter','route3','route3b','mtmoonj','mtmoon','mtmoonb','mtmoonc','route4','ceruleanrival','ceruleanguard','cerulean','nugget','nuggetrocket','route25','route25b','bill','route5','route6','vermilionrival','vermilionguard','vermilion'];
let optionalCleared=new Set();
let stageId='route1',stageUnlocked=0,stageCleared=new Set(),campaignViewed=0,currentEncounter=null,battleBackup=null;

const BALLS={pokeball:{name:'Poké Ball',icon:'🔴',bonus:1},greatball:{name:'Super Ball',icon:'🔵',bonus:1.5},ultraball:{name:'Ultra Ball',icon:'🟡',bonus:2}};
// Offline species values, mirrored from the Pokédex; verified at runtime with PokéAPI species.capture_rate when online.
const CAPTURE_RATES={725:45,443:45,60:255,61:120,129:255,130:45,98:225,54:190,79:190,66:180,43:255,69:255,63:200,138:45,140:45,88:190,81:190,100:190,27:255,24:90,28:90,30:120,33:120,42:90,47:75,57:75,110:60,117:75,119:60,120:225,121:60,118:225,116:225,90:190,1:45,4:45,7:45,10:255,11:120,13:255,14:120,16:255,19:255,21:255,23:255,25:190,29:235,32:235,35:150,39:170,41:255,46:190,56:190,74:255,95:45,109:190};
const captureRateCache={...CAPTURE_RATES};const captureFetchInFlight=new Set();
function fetchCaptureRate(id){
 if(captureFetchInFlight.has(id))return;
 captureFetchInFlight.add(id);
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),3600);
 fetch('https://pokeapi.co/api/v2/pokemon-species/'+id+'/',{signal:controller.signal})
 .then(r=>{if(!r.ok)throw new Error('PokéAPI '+r.status);return r.json()})
 .then(spec=>{if(Number.isInteger(spec.capture_rate)&&spec.capture_rate>=1&&spec.capture_rate<=255)captureRateCache[id]=spec.capture_rate})
 .catch(()=>{})
 .finally(()=>{clearTimeout(timeout);captureFetchInFlight.delete(id)});
}
function isTrainerBattle(){return !!currentEncounter&&!(currentEncounter.kind==='wild'||currentEncounter.kind==='practice'||(currentEncounter.kind==='main'&&(CAMPAIGN[currentEncounter.id]||{}).mainKind==='wild'))}
function captureAllowed(){return !!currentEncounter&&!isTrainerBattle()&&phase==='player'}
// Generación III: la tasa modificada se redondea por pasos; cuatro comprobaciones (0..65535).
function calculateCapture(enemy,ballId,random=()=>Math.random()){
 const rate=captureRateCache[enemy.id]||45,ball=BALLS[ballId];
 const status=enemy.asleep>0?2:(enemy.paralyzed||enemy.poisoned||enemy.burned?1.5:1);
 const max=Math.max(1,enemy.maxHp),hp=Math.max(1,enemy.hp);
 const adjusted=Math.max(1,Math.floor(Math.floor(rate*ball.bonus)*(3*max-2*hp)/(3*max)*status));
 if(adjusted>=255)return {success:true,shakes:3,rate,adjusted,status};
 const first=Math.floor(16711680/adjusted);
 const second=Math.max(1,Math.floor(Math.sqrt(first)));
 const third=Math.max(1,Math.floor(Math.sqrt(second)));
 const threshold=Math.max(0,Math.min(65535,Math.floor(1048560/third)));
 let shakes=0;for(let i=0;i<4;i++){if(Math.floor(random()*65536)>=threshold)break;shakes++}
 return {success:shakes===4,shakes,rate,adjusted,status};
}
const ITEM_RANGE=1,ITEM_NAMES={potion:'Poción',superPotion:'Superpoción',antidote:'Antídoto',parlyz:'Antiparalizador',thunderStone:'Piedra Trueno',fireStone:'Piedra Fuego',waterStone:'Piedra Agua',leafStone:'Piedra Hoja',moonStone:'Piedra Lunar'};
function itemTargets(id,actor){return units.filter(u=>u.side==='player'&&u.hp>0&&distance(actor,u)<=ITEM_RANGE&&itemWorks(id,u))}
function startItemAim(id){
 if(!canUseBagNow()||itemQty(id)<1)return;
 const actor=currentBagActor();if(!actor)return;
 $('gameBag').hidden=true;captureMode={actor,ballId:null,itemId:id};actionMenu=null;$('battleMenu').hidden=true;
 skill=null;syncAttackBack();updateUI();log('🎯 '+base[actor.id].name+' prepara '+ITEM_NAMES[id]+'. Elige a quién usarlo: a sí mismo o a un aliado adyacente.');
}
function aimItemOn(target){
 const cm=captureMode;if(!cm||!cm.itemId)return;const a=cm.actor;
 if(!target||!itemTargets(cm.itemId,a).includes(target)){log('⚠ Elige a un Pokémon propio, tú o un aliado adyacente, al que le sirva '+ITEM_NAMES[cm.itemId]+'.');return}
 captureMode=null;actionMenu='actions';selected=a;$('gameBag').hidden=false;useItem(cm.itemId,target);
}
function startCaptureAim(ballId){
 if(!canUseBagNow()||!captureAllowed()||!BALLS[ballId]||(bag[ballId]||0)<1||storageBox.length>=BOX_CAPACITY)return;
 const actor=currentBagActor();if(!actor)return;
 $('gameBag').hidden=true;captureMode={actor,ballId};actionMenu=null;$('battleMenu').hidden=true;
 skill=null;syncAttackBack();updateUI();log('🎯 '+base[actor.id].name+' prepara '+BALLS[ballId].name+'. Selecciona un Pokémon salvaje a '+CAPTURE_RANGE+' casillas o menos.');
}
function cancelCaptureAim(){
 if(!captureMode||captureBusy)return;
 const actor=captureMode.actor;captureMode=null;selected=actor;skill=null;actionMenu='actions';menuIndex=Math.max(0,menuCommands().findIndex(c=>c.run===openGameBag));
 updateUI();renderBattleMenu();openGameBag();
}
async function showCaptureSequence(enemy,ballId,result,actor){
 if(actor&&battleStyle==='face'&&animationEnabled){try{await showCaptureFE(actor,enemy,ballId,result);return}catch(e){console.warn('Captura FE',e);hideCinematic()}}
 const stage=$('captureScene'),ball=$('captureBall'),target=$('captureTarget');
 $('captureTitle').textContent='CAPTURA · '+base[enemy.id].name.toUpperCase()+' · NV. '+enemy.level;
 target.classList.remove('caught');target.replaceChildren();
 let sp=sprites[enemy.id];if(sp&&sp.ready){let img=document.createElement('img');img.alt=base[enemy.id].name;if(enemy.shiny&&SHINY_FR[enemy.id])img.src='data:image/png;base64,'+SHINY_FR[enemy.id];else if(enemy.shiny){const nrm=sp.img.src,urls=SPRITE_MIRRORS.map(m=>m+SPRITE_PATH+'firered-leafgreen/shiny/'+enemy.id+'.png');let k=0;img.onerror=()=>{k++;if(k<urls.length)img.src=urls[k];else{img.onerror=null;img.src=nrm}};img.src=urls[0]}else img.src=sp.img.src;target.append(img)}else{const f=document.createElement('span');f.className='captureFallback';f.textContent=base[enemy.id].emoji;target.append(f)}
 ball.innerHTML=ITEM_SPR[ballId]?itemIc(ballId,72):BALLS[ballId].icon;ball.className='captureBall throw';$('captureMessage').textContent='¡'+BALLS[ballId].name+' lanzada!';stage.hidden=false;
 await delay(720);target.classList.add('caught');$('captureMessage').textContent='…';await delay(460);ball.className='captureBall';
 const visibleShakes=result.success?3:Math.min(result.shakes,3);
 for(let i=0;i<visibleShakes;i++){
   ball.className='captureBall shake';$('captureMessage').textContent=['Uno…','Dos…','Tres…'][i];
   await delay(530);ball.className='captureBall';await delay(190);
 }
 if(result.success){ball.className='captureBall success';$('captureMessage').textContent='¡Capturado! '+base[enemy.id].name+' se unió a tu colección.';}
 else{target.classList.remove('caught');$('captureMessage').textContent='¡Oh, no! ¡Se ha escapado!';}
 await delay(result.success?950:800);stage.hidden=true;
}
async function throwCaptureBall(actor,enemy,ballId){
 if(!captureMode||captureBusy||locked||!captureAllowed()||selected!==actor)return;
 if(!enemy||enemy.side!=='enemy'||enemy.hp<=0||!units.includes(enemy)){
    log('⚠ Selecciona un Pokémon salvaje que siga en pie.');return;
 }
 if(distance(actor,enemy)>CAPTURE_RANGE){log('⚠ '+base[enemy.id].name+' está demasiado lejos (máximo '+CAPTURE_RANGE+' casillas).');return}
 if(!bag[ballId]||storageBox.length>=BOX_CAPACITY){cancelCaptureAim();return}
 captureBusy=true;locked=true;bag[ballId]--;let result=calculateCapture(enemy,ballId);
 if(window.__capTutSure&&window.__capTutSure())result={...result,success:true,shakes:4}; // v653: en el tutorial, la primera captura no falla
 captureMode=null;syncAttackBack();updateUI();
 try{await showCaptureSequence(enemy,ballId,result,actor)}catch(e){console.warn('Animación de captura',e);$('captureScene').hidden=true}
 if(result.success){playSfx('capture');
  // Clonar el Pokémon concreto encontrado, no generar uno nuevo desde su especie.
  // Así conserva nivel, PS al capturarlo, movimientos/PP, estados y estadísticas.
  const capturedSnapshot=unitSnapshot(enemy);
  capturedSnapshot.x=-1;capturedSnapshot.y=-1;
  capturedSnapshot.moved=false;capturedSnapshot.acted=false;capturedSnapshot.counterUsed=false;
  capturedSnapshot.caughtAt=(CAMPAIGN[currentEncounter.id]||{}).name||'Encuentro salvaje';
  capturedSnapshot.caughtLevel=enemy.level;
  const newPokemon=restoreUnit(capturedSnapshot,'player');
  newPokemon.origin=null;
  const detail=base[enemy.id].name+' Nv. '+newPokemon.level+' · PS '+newPokemon.hp+'/'+newPokemon.maxHp;
  if(partyAll().length<6){reserves.push(newPokemon);log('🔴 ¡Capturaste a '+detail+'! Se añadió a las reservas.');}
  else{storageBox.push(newPokemon);log('🔴 ¡Capturaste a '+detail+'! Se envió a la Caja Pokémon ('+storageBox.length+'/'+BOX_CAPACITY+').');}
  enemy.hp=0; // El salvaje desaparece del tablero. Capturar NO otorga EXP en la generación III.
 }else {playSfx('error');log('🔴 '+base[enemy.id].name+' escapó de '+BALLS[ballId].name+'. Sacudidas: '+result.shakes+'.');}
 actor.acted=true;actor.moved=true;actor.origin=null;selected=null;inspectedEnemy=null;enemyAnalysis=null;closeBattleMenu();skill=null;
 captureBusy=false;locked=false;updateUI();
 if(checkResult())return;
 nextIfAll();autoSaveSafe();
}

function pickWild(pool){let total=pool.reduce((sum,p)=>sum+p.w,0);let r=Math.random()*total;for(const p of pool){r-=p.w;if(r<0)return {id:p.id,level:p.min+Math.floor(Math.random()*(p.max-p.min+1))}}let p=pool[pool.length-1];return{id:p.id,level:p.min}}
/* ===== v0.51 · Rutas al estilo Rojo Fuego / Verde Hoja =====
   Un solo mapa ASCII por escenario dibuja el paisaje y define el terreno táctico:
   t árbol (obstáculo) · F pino (bosque, coste 2) · l saliente rocoso · r roca · s cartel · f valla · h casa (obstáculos)
   p camino · T hierba alta · o flores rojas · ~ agua · . césped */
const FRLG_VIS={"pallet": ["............", "CMM...kkk...", "CMM...kkk...", "............", "BBBB....BBBB", "BBBB....BBBB", "............", "............", "............", "P..........P"], "route1": ["tttttppttttt", "t....pp....t", "t.oTTpp..TTt", "t..TTpp..TTt", "t.lll.pp.llt", "t..TTTpp...t", "t..TT.pp.o.t", "t..TT.pp...t", "t...soppp..t", "tttttppttttt"], "viridian": ["tttttppttttt", "t..h.pp....t", "t....pp...ot", "t....pp.h..t", "tppppppppppt", "t....pp....t", "t.h..pp.o..t", "t....pp....t", "t...opp.ff.t", "tttttppttttt"], "route2in": ["tWWppWWttttt", "twwpppwwwwwt", "t.oppp.....t", "to.ppp.....t", "tlllllll...t", "t.ppTTTTTT.t", "toppTTTTTT.t", "t.ppTTTTTT.t", "toppTTTTTT.t", "toppTTTTTT.t"], "route2": ["ttttpppttttt", "ttttpppttttt", "TTTTpppwwwww", "TTTTppp.....", "TTTTppp..oo.", "TTTTppp.o...", "TTTTppp....o", "TTTTppp...WW", "TTTTppp..WWW", "TTTTppp.sWWW"], "forest": ["t.TTTTtt...t", "t.TTTTtt...t", "t.TTTTtt...t", "t.TTTTtt..ot", "t.TTTT...o.t", "t.TTT.....ot", "t.TT....o.ot", "t.TT.....o.t", "t.TT...ttttt", "t.TT...ttttt"], "forestdoug": [".pp.....tttt", ".pp.....tttt", ".pp........t", ".pp........t", ".pp..oo.o..t", ".pps..oo.o.t", ".pp.....o..t", ".pppp......t", "TTTT.......t", "TTTTtt.....t"], "forestexit": ["WWwttttttttt", "WWwttttttttt", "WW..........", "WW.pppppppp.", "WW.pppppppp.", "WW.pp....pp.", "t..pp....pp.", "t.....t.....", "t.....t.....", "t.....t....."], "route22": ["rrrrrrrrrrrt", "r..........t", "r.....lllllt", "rTTTTTlllllt", "rTTTTTlllllt", "rTTTTTlllllt", "rTTTTT.....t", ".TTTTT.....t", "...........t", "rrrrrrrrrrrr"], "gymguard": ["WWWWWWWWWWWW", "W..........W", "W....r.r...W", "W...r...r..W", "W..........W", "W..........W", "W..r.r.r.r.W", "W..........W", "W...r...r..W", "W..........W"], "pewter": ["WWWWWWWWWWWW", "W..........W", "W....r.r...W", "W...r...r..W", "W..........W", "W..........W", "W..r.r.r.r.W", "W..........W", "W...r...r..W", "W..........W"]};
Object.assign(FRLG_VIS,{"mtmoonc": ["WWWWW...WWWW", "..W........W", "..W........W", "r.W........W", "..W........W", ".rWWWW..WW.W", "..r~~....W.W", "..........W.W", "..........WWW", "...........r"]});
Object.assign(FRLG_VIS,{"mtmoonj": ["WW.WWWW...WW", "WW.WWWW...WW", "WW.~~.....WW", "WWr.......WW", "WWrr......WW", "WWrr........", "WWr.........", "W...........", "............", "WW........WW"]});
Object.assign(FRLG_VIS,{"route3": ["WWWWWWWWWWWW", "WWWWWWWWWWWW", "WWWWWWWWWWWW", "WWWWWWWWWWWW", "WWpppppppppp", "Wppppppppppp", "Wppppp.....p", "W...........", "W.......RR..", "Wlll.lllRRll"], "camp": ["tttttttttttt", "tt........tt", "t..o.....o.t", "t...ppppp..t", "t..pppppppot", "to..ppppp..t", "t..o.....o.t", "t.TT....ww.t", "tt........tt", "tttttttttttt"], "route3t": ["WWW....WWWWW", "WWWll..WWWWW", "WWW....TTTWW", "W...wwsTTTTW", ".....TTTTTTW", ".....TTTTTTW", "....TTTTTTTW", "....TTTTTTTW", "....TTTTTWWW", "WWWWWWWWWWWW"], "route3b": ["...WWWW.....", "...WWWWllll.", "............", "TTTTTT......", "TTTTTTTTTTTW", "TTTTTTTTTTTW", "W.TTTTTTTTTW", "W.TTTTTTTTTW", "W....TTTTTTW", "WWWWW......W"], "mtmoon": ["WWpp......pW", "WWpp......pW", "WWpp......pW", "WWp.......pW", "WWp.......pW", "WWp.......pW", "WWp.......pW", "WWp.......pW", "WWp.......pW", "WWp.......pW"], "mtmoonb": ["WWWWWWWWWWWW", "WW...k.....W", "W..WW......W", "W...W..k...W", "W......WW..W", "W..WW......W", "W...W..k..WW", "W......WW..W", "W..k....W..W", "WWW.....WWWW"], "route4": ["tttttttttttt", "t..TTT.....t", "t..TTT..rr.t", "t......ppp.t", "tppp...pp..t", "t.pp.TTT...t", "t..p.TTT.rrt", "t..pp....r.t", "tr.pppp....t", "tttppttttttt"], "cerulean": ["WWWWWWWWWWWW", "WWWWWWWWWWWW", "W..........W", "W.~~~.~~~..W", "W.~~~.~~~..W", "W.~~~.~~~..W", "W..........W", "W..........W", "W..ppp.pp..W", "WW.pppppp.WW"], "ceruleanguard": ["WWWWWWWWWWWW", "WWWWWWWWWWWW", "W..........W", "W.~~~.~~~..W", "W.~~~.~~~..W", "W.~~~.~~~..W", "W..........W", "W..........W", "W..ppp.pp..W", "WW.pppppp.WW"]});
Object.assign(FRLG_VIS,{"route4":["t........ttt","tllllllllttt","tTTTTTTTTttt","tTTTTTTTTttt","tTTTTTTTTTTt","tTTTTTTTTTTt","tTTTTTTTTTTt","tTTTTTTTTT.t","tTTTTTTTT..t","tWWWWWWWWW.t"]});
Object.assign(FRLG_VIS,{"ceruleanrival":["~~~~.DDDllf~","~~~~.DDD..f~","~~~~.DDD..f~","~~~~.DDD..ff","fffff..t..fp","oooo...t..fp","oooo...t..fp","ffff......fp","hhhht.....hh","hhhht.....hh"]});
Object.assign(FRLG_VIS,{"route25train":["WWWWWWWWWWWW","...TTTTTTTT.","...TTTTTTTT.","............","............","lllllpplllll","pppppppp~~~~","pppppppp~~~~","pppppppp~~~~","pppppppp~~~~"]});
Object.assign(FRLG_VIS,{"route25":["WWWWWWWWWWWW","...t...t....","...t...t....","............","....t.t.t...","..tt....t.tt","p...t...t...","pt......t...","pt......t.t.","p...t....t.."]});
FRLG_VIS.route25b=FRLG_VIS.route25;
Object.assign(FRLG_VIS,{"nuggettrain":["WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD","WWWTTTT~~DDD"],"nugget":["TT~~DDDD.WWW","TT~~DDDD.WWW","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f","TT~~DDDD...f"]});
FRLG_VIS.nuggetrocket=FRLG_VIS.nugget;
Object.assign(FRLG_VIS,{"cerulean":["WWWWWWWWWWWW","W~~~~..~~~~W","W~~~~..~~~~W","W~~......~~W","W~~~~..~~~~W","W~~~~..~~~~W","W..........W","W..........W","W..~~~~~~..W","WW~~~~~~~~WW"],"ceruleanguard":["WWWWWWWWWWWW","W~~~~..~~~~W","W~~~~..~~~~W","W~~......~~W","W~~~~..~~~~W","W~~~~..~~~~W","W..........W","W..........W","W..~~~~~~..W","WW~~~~~~~~WW"]});
Object.assign(FRLG_VIS,{"lunar":["rrrrrrrrrrrr","rr........rr","r..r....r..r","r..........r","r...rr.....r","r..........r","r.....r....r","r..........r","rr.......r.r","rrrrrrrrrrrr"]});
Object.assign(FRLG_VIS,{"route22":["pppppppppptt","pppppppppptt","WWWW......tt","WWWWll..lltt","WWWWTTTTTTtt","WWWWTTTTTTtt","WWWWTTTTTTtt","WWWWTTTTTTtt","WWWWTTTTTTtt","WWWW........"]});
const FRLG_BLOCK=new Set('tlrsfhFWBMkPCvwR');
function visKey(id){return id==='route3'&&currentEncounter&&currentEncounter.kind==='wild'&&currentEncounter.id==='route3'?'route3t':id}
Object.assign(FRLG_VIS,{"route5":["tttttppttttt","t..TTpp..TTt","t..TTpp..TTt","t....pp....t","tr...ppp...t","t.TT..pp...t","t.TT..pp.r.t","t.....ppp..t","t..r..pp...t","tttttppttttt"],"route6":["tttttppttttt","t~~..pp..TTt","t~~..pp..TTt","t....pp..TTt","t.TT.ppp...t","t.TT.pp..r.t","t....pp....t","t.r..ppp.TTt","t....pp..TTt","tttttppttttt"],"vermilionrival":["~~~~~~~~~~~~","~~DDDDDDDD~~","~~DDDDDDDD~~","~~DDDDDDDD~~","ff........ff","............","....pp......","......pp....","hh.t..pp.t.h","hh....pp..hh"],"vermilionguard":["WWWWWWWWWWWW","W..........W","W.WW....WW.W","W..........W","W...WWWW...W","W..........W","W..........W","W.WW....WW.W","W...pppp...W","WW..pppp..WW"],"vermilion":["WWWWWWWWWWWW","W..........W","W..WW..WW..W","W..........W","W.W......W.W","W..........W","W..........W","W..WW..WW..W","W...pppp...W","WW..pppp..WW"]});
const _pondBak={};function pondFix(id){const k=visKey(id);for(const b in _pondBak){if(b!==k||!(currentEncounter&&currentEncounter.fish)){FRLG_VIS[b]=_pondBak[b];delete _pondBak[b]}}const v=FRLG_VIS[k];if(!v||!(currentEncounter&&currentEncounter.fish)||_pondBak[k]||v.join('').includes('~'))return;const ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&'.pTo'.includes(v[y][x]);let best=null;for(const [w,h] of [[4,3],[3,3],[3,2]]){for(let x=W-w;x>=3&&!best;x--)for(let y=2;y<=6&&!best;y++){let g=true;for(let a=0;a<w&&g;a++)for(let c=0;c<h&&g;c++)if(!ok(x+a,y+c))g=false;if(g)best={x,y,w,h}}if(best)break}if(!best)return;_pondBak[k]=v;FRLG_VIS[k]=v.map((r,y)=>[...r].map((c,x)=>x>=best.x&&x<best.x+best.w&&y>=best.y&&y<best.y+best.h?'~':c).join(''))}
function frlgTerrain(id){pondFix(id);const v=FRLG_VIS[visKey(id)];if(!v)return null;return v.map(row=>[...row].map(c=>FRLG_BLOCK.has(c)?'X':c==='F'?'F':c==='~'?'~':'.').join(''))}
function frlgChar(id,x,y){const v=FRLG_VIS[visKey(id)];return v&&v[y]?(v[y][x]||'.'):null}
function setupTerrain(which){stageId=(which==='nugget'&&currentEncounter&&currentEncounter.kind==='wild')?'nuggettrain':(which==='route25'&&currentEncounter&&currentEncounter.kind==='wild')?'route25train':CAMPAIGN[which]?which:'route1';map=frlgTerrain(stageId)||[...CAMPAIGN[stageId].terrain];$('locationLabel').textContent=CAMPAIGN[stageId].icon+' '+CAMPAIGN[stageId].name.toUpperCase()+(stageId==='lunar'?'':' · KANTO')}
