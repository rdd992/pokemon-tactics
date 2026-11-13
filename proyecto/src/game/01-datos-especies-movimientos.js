// Especies encontrables en las primeras rutas de Kanto, con estadísticas base de Gen III.
Object.assign(base,{
52:{name:'Meowth',types:['normal'],stats:[40,45,35,40,40,90],emoji:'🐱',move:3},
725:{name:'Litten',types:['fire'],stats:[45,65,40,60,40,70],emoji:'🐈‍⬛',move:4},
443:{name:'Gible',types:['dragon','ground'],stats:[58,70,45,40,45,42],emoji:'🦈',move:4},
19:{name:'Rattata',types:['normal'],stats:[30,56,35,25,35,72],emoji:'🐭',move:5},
10:{name:'Caterpie',types:['bug'],stats:[45,30,35,20,20,45],emoji:'🐛',move:3},
13:{name:'Weedle',types:['bug','poison'],stats:[40,35,30,20,20,50],emoji:'🐛',move:3},
11:{name:'Metapod',types:['bug'],stats:[50,20,55,25,25,30],emoji:'🟢',move:2},
14:{name:'Kakuna',types:['bug','poison'],stats:[45,25,50,25,25,35],emoji:'🟡',move:2},
12:{name:'Butterfree',types:['bug','flying'],stats:[60,45,50,80,80,70],emoji:'🦋',move:5},
15:{name:'Beedrill',types:['bug','poison'],stats:[65,80,40,45,80,75],emoji:'🐝',move:5},
20:{name:'Raticate',types:['normal'],stats:[55,81,60,50,70,97],emoji:'🐀',move:5},
22:{name:'Fearow',types:['normal','flying'],stats:[65,90,65,61,61,100],emoji:'🦅',move:6},
41:{name:'Zubat',types:['poison','flying'],stats:[40,45,35,30,40,55],emoji:'🦇',move:5},
138:{name:'Omanyte',types:['water','rock'],stats:[35,40,100,90,55,35],emoji:'🐚',move:3},
140:{name:'Kabuto',types:['rock','water'],stats:[30,80,90,55,45,55],emoji:'🦀',move:3},
63:{name:'Abra',types:['psychic'],stats:[25,20,15,105,55,90],emoji:'🔮',move:3},
43:{name:'Oddish',types:['grass','poison'],stats:[45,50,55,75,65,30],emoji:'🌿',move:2},
69:{name:'Bellsprout',types:['grass','poison'],stats:[50,75,35,70,30,40],emoji:'🌱',move:3},
60:{name:'Poliwag',types:['water'],stats:[40,50,40,40,40,90],emoji:'🌀',move:3},
61:{name:'Poliwhirl',types:['water'],stats:[65,65,65,50,50,90],emoji:'🌀',move:3},
129:{name:'Magikarp',types:['water'],stats:[20,10,55,15,20,80],emoji:'🐟',move:2},
130:{name:'Gyarados',types:['water','flying'],stats:[95,125,79,60,100,81],emoji:'🐉',move:4},
99:{name:'Kingler',types:['water'],stats:[55,130,115,50,50,75],emoji:'🦀',move:3},
98:{name:'Krabby',types:['water'],stats:[30,105,90,25,25,50],emoji:'🦀',move:3},
55:{name:'Golduck',types:['water'],stats:[80,82,78,95,80,85],emoji:'🦆',move:3},
54:{name:'Psyduck',types:['water'],stats:[50,52,48,65,50,55],emoji:'🦆',move:3},
80:{name:'Slowbro',types:['water','psychic'],stats:[95,75,110,100,80,30],emoji:'🦛',move:2},
79:{name:'Slowpoke',types:['water','psychic'],stats:[90,65,65,40,40,15],emoji:'🦛',move:2},
66:{name:'Machop',types:['fighting'],stats:[70,80,50,35,35,35],emoji:'💪',move:3},
88:{name:'Grimer',types:['poison'],stats:[80,80,50,40,50,25],emoji:'🟣',move:3},
81:{name:'Magnemite',types:['electric'],stats:[25,35,70,95,55,45],emoji:'🧲',move:3},
100:{name:'Voltorb',types:['electric'],stats:[40,30,50,55,55,100],emoji:'🔴',move:5},
46:{name:'Paras',types:['bug','grass'],stats:[35,70,55,45,55,25],emoji:'🍄',move:3},
35:{name:'Clefairy',types:['normal'],stats:[70,45,48,60,65,35],emoji:'🌙',move:3},
21:{name:'Spearow',types:['normal','flying'],stats:[40,60,30,31,31,70],emoji:'🐦',move:5},
29:{name:'Nidoran♀',types:['poison'],stats:[55,47,52,40,40,41],emoji:'🟣',move:4},
32:{name:'Nidoran♂',types:['poison'],stats:[46,57,40,40,40,50],emoji:'🟣',move:4},
39:{name:'Jigglypuff',types:['normal'],stats:[115,45,20,45,25,20],emoji:'🎵',move:3},
56:{name:'Mankey',types:['fighting'],stats:[40,80,35,35,45,70],emoji:'🥊',move:4},
95:{name:'Onix',types:['rock','ground'],stats:[35,45,160,30,45,70],emoji:'🪨',move:4},
23:{name:'Ekans',types:['poison'],stats:[35,60,44,40,54,55],emoji:'🐍',move:4},
109:{name:'Koffing',types:['poison'],stats:[40,65,95,60,45,35],emoji:'☁️',move:3}
});
Object.assign(moveDB,{
poisonsting:{name:'Picotazo Veneno',type:'poison',power:15,category:'physical',acc:100,pp:35,shape:'point',range:2,effect:'poison30',detail:'30% de envenenar · 2 casillas'},
stringshot:{name:'Disparo Demora',type:'bug',power:0,category:'status',acc:95,pp:40,shape:'line',range:3,effect:'slow',detail:'Reduce movilidad en línea'},
harden:{name:'Fortaleza',type:'normal',power:0,category:'status',acc:100,pp:30,shape:'self',range:0,effect:'defUp',detail:'Aumenta Defensa'},
bite:{name:'Mordisco',type:'dark',power:60,category:'physical',acc:100,pp:25,shape:'melee',range:1,detail:'Ataque a casilla adyacente'},
sing:{name:'Canto',type:'normal',power:0,category:'status',acc:55,pp:15,shape:'point',range:2,effect:'sleep',detail:'Duerme al objetivo'},
karate:{name:'Golpe Karate',type:'fighting',power:50,category:'physical',acc:100,pp:25,shape:'melee',range:1,detail:'Ataque adyacente'},
});

// Movimientos adicionales que permiten respetar los sets iniciales de FireRed / LeafGreen.
Object.assign(moveDB,{
 tailwhip:{name:'Látigo',type:'normal',power:0,category:'status',acc:100,pp:30,shape:'point',range:2,effect:'defDown',detail:'Baja Defensa del objetivo'},
 leer:{name:'Malicioso',type:'normal',power:0,category:'status',acc:100,pp:30,shape:'point',range:2,effect:'defDown',detail:'Baja Defensa del objetivo'},
 metalclaw:{name:'Garra Metal',type:'steel',power:50,category:'physical',acc:95,pp:35,shape:'melee',range:1,effect:'atkUp10',detail:'Ataque físico a una casilla · 10% de subir tu Ataque'},
 doubleteam:{name:'Doble Equipo',type:'normal',power:0,category:'status',acc:100,pp:15,shape:'self',range:0,effect:'evadeUp',detail:'Aumenta evasión'},
 powderpoison:{name:'Polvo Veneno',type:'poison',power:0,category:'status',acc:75,pp:35,shape:'point',range:2,effect:'poison',detail:'Envenena al enemigo'},
 powdersleep:{name:'Somnífero',type:'grass',power:0,category:'status',acc:75,pp:15,shape:'point',range:2,effect:'sleep',detail:'Duerme al enemigo'},
 mudsport:{name:'Chapoteolodo',type:'ground',power:0,category:'status',acc:100,pp:15,shape:'self',range:0,effect:'defUp',detail:'Mejora Defensa (adaptación táctica)'},
 leechlife:{name:'Chupavidas',type:'bug',power:20,category:'physical',acc:100,pp:15,shape:'melee',range:1,effect:'drain',detail:'Recupera parte del daño causado'},
 astonish:{name:'Impresionar',type:'ghost',power:30,category:'physical',acc:100,pp:15,shape:'melee',range:1,detail:'Ataque adyacente'},
 supersonic:{name:'Supersónico',type:'normal',power:0,category:'status',acc:55,pp:20,shape:'point',range:2,effect:'confuse',detail:'Desorienta al objetivo'},
 stunspore:{name:'Paralizador',type:'grass',power:0,category:'status',acc:75,pp:30,shape:'point',range:2,effect:'paralysis',detail:'Paraliza a un enemigo'},
 lowkick:{name:'Patada Baja',type:'fighting',power:40,category:'physical',acc:100,pp:20,shape:'melee',range:1,detail:'Potencia adaptada al peso del rival'},
 pound:{name:'Destructor',type:'normal',power:40,category:'physical',acc:100,pp:35,shape:'melee',range:1,detail:'Una casilla adyacente'},
 encore:{name:'Otra Vez',type:'normal',power:0,category:'status',acc:100,pp:5,shape:'point',range:2,effect:'slow',detail:'Control táctico: reduce movilidad'},
 doubleslap:{name:'Doble Bofetón',type:'normal',power:15,category:'physical',acc:85,pp:10,shape:'melee',range:1,multi:[2,5],detail:'Golpea de 2 a 5 veces'},
 wrap:{name:'Constricción',type:'normal',power:15,category:'physical',acc:90,pp:20,shape:'melee',range:1,effect:'trap',detail:'Atrapa: no puede moverse varios turnos'},
 bind:{name:'Atadura',type:'normal',power:15,category:'physical',acc:75,pp:20,shape:'melee',range:1,effect:'trap',detail:'Atrapa: no puede moverse varios turnos'},
 screech:{name:'Chirrido',type:'normal',power:0,category:'status',acc:85,pp:40,shape:'point',range:2,effect:'defDown',detail:'Baja Defensa del enemigo'},
 poisongas:{name:'Gas Venenoso',type:'poison',power:0,category:'status',acc:55,pp:40,shape:'area',range:2,radius:1,effect:'poison',detail:'Envenena enemigos en un área'},
 smog:{name:'Polución',type:'poison',power:20,category:'physical',acc:70,pp:20,shape:'point',range:2,effect:'poison20',detail:'Puede envenenar'},
 tackleold:{name:'Placaje',type:'normal',power:35,category:'physical',acc:95,pp:35,shape:'melee',range:1,detail:'Una casilla adyacente'},
 bugbite:{name:'Picadura',type:'bug',power:20,category:'physical',acc:100,pp:15,shape:'melee',range:1,detail:'Movimiento de contacto'},
 focus:{name:'Foco Energía',type:'normal',power:0,category:'status',acc:100,pp:30,shape:'self',range:0,effect:'critUp',detail:'Aumenta la probabilidad de golpe crítico'},
 ragemove:{name:'Furia',type:'normal',power:20,category:'physical',acc:100,pp:20,shape:'melee',range:1,detail:'Ataque adyacente'},
 smokescreen:{name:'Pantalla de Humo',type:'normal',power:0,category:'status',acc:100,pp:20,shape:'point',range:2,effect:'accuracyDown',detail:'Baja precisión'},
}
);
Object.assign(moveDB,{
 furyattack:{name:'Ataque Furia',type:'normal',power:15,category:'physical',acc:85,pp:20,shape:'melee',range:1,multi:[2,5],detail:'Golpea de 2 a 5 veces'},
 twineedle:{name:'Doble Ataque',type:'bug',power:25,category:'physical',acc:100,pp:20,shape:'point',range:2,multi:[2,2],effect:'poison20',detail:'Golpea 2 veces · 20% de envenenar'},
 pursuit:{name:'Persecución',type:'dark',power:40,category:'physical',acc:100,pp:20,shape:'melee',range:1,detail:'Ataque adyacente'},
 pinmissile:{name:'Pin Misil',type:'bug',power:45,category:'physical',acc:85,pp:20,shape:'point',range:3,detail:'Lluvia de agujas a 3 casillas'},
 agility:{name:'Agilidad',type:'psychic',power:0,category:'status',acc:100,pp:30,shape:'self',range:0,effect:'evadeUp',detail:'Aumenta evasión'},
 confusion:{name:'Confusión',type:'psychic',power:50,category:'special',acc:100,pp:25,shape:'point',range:3,detail:'Onda psíquica a 3 casillas'},
 psybeam:{name:'Psicorrayo',type:'psychic',power:65,category:'special',acc:100,pp:20,shape:'line',range:3,detail:'Rayo psíquico en línea'}
});
// Ajustes a valores reales de los movimientos de generación III (alcance sigue siendo táctico).
Object.assign(moveDB.tackle,{power:35,acc:95});
Object.assign(moveDB.vine,{power:35,category:'special',pp:10});
Object.assign(moveDB.bubble,{power:20});
Object.assign(moveDB.gust,{category:'physical'});
Object.assign(moveDB.bite,{category:'special'});
Object.assign(base,{27:{name:'Sandshrew',types:['ground'],stats:[50,75,85,20,30,40],emoji:'🟡',move:3}});
Object.assign(base,{
120:{name:'Staryu',types:['water'],stats:[30,45,55,70,55,85],emoji:'⭐',move:4},
121:{name:'Starmie',types:['water','psychic'],stats:[60,75,85,100,85,115],emoji:'🌟',move:4},
118:{name:'Goldeen',types:['water'],stats:[45,67,60,35,50,63],emoji:'🐟',move:4},
116:{name:'Horsea',types:['water'],stats:[30,40,70,70,25,60],emoji:'🐴',move:3},
90:{name:'Shellder',types:['water'],stats:[30,65,100,45,25,40],emoji:'🐚',move:3}
});
Object.assign(base,{
24:{name:'Arbok',types:['poison'],stats:[60,85,69,65,79,80],emoji:'🐍',move:4},
28:{name:'Sandslash',types:['ground'],stats:[75,100,110,45,55,65],emoji:'🦔',move:3},
30:{name:'Nidorina',types:['poison'],stats:[70,62,67,55,55,56],emoji:'🟣',move:4},
33:{name:'Nidorino',types:['poison'],stats:[61,72,57,55,55,65],emoji:'🟣',move:4},
42:{name:'Golbat',types:['poison','flying'],stats:[75,80,70,65,75,90],emoji:'🦇',move:5},
47:{name:'Parasect',types:['bug','grass'],stats:[60,95,80,60,80,30],emoji:'🍄',move:3},
57:{name:'Primeape',types:['fighting'],stats:[65,105,60,60,70,95],emoji:'🥊',move:4},
110:{name:'Weezing',types:['poison'],stats:[65,90,120,85,70,60],emoji:'☁️',move:3},
117:{name:'Seadra',types:['water'],stats:[55,65,95,95,45,85],emoji:'🐉',move:3},
119:{name:'Seaking',types:['water'],stats:[80,92,65,65,80,68],emoji:'🐠',move:4}
});
moveDB.waterpulse={name:'Hidropulso',type:'water',power:60,category:'special',acc:100,pp:20,shape:'point',range:3,detail:'Pulso de agua a 3 casillas'};
moveDB.hornattack={name:'Cornada',type:'normal',power:65,category:'physical',acc:100,pp:25,shape:'melee',range:1,detail:'Embestida con el cuerno, adyacente'};
moveDB.rapidspin={name:'Giro Rápido',type:'normal',power:20,category:'physical',acc:100,pp:40,shape:'melee',range:1,detail:'Giro veloz, adyacente'};
moveDB.rocktomb={name:'Tumba Rocas',type:'rock',power:50,category:'physical',acc:80,pp:10,shape:'point',range:2,effect:'slow',detail:'Alcance 2 · -3 PM durante 2 turnos'};
const encounterMoves={
24:['wrap','poisonsting','bite','screech'],28:['scratch','slash','sand','curl'],30:['scratch','bite','poisonsting','tailwhip'],33:['peck','furyattack','poisonsting','focus'],42:['bite','wing','leechlife','supersonic'],47:['scratch','leechlife','slash','stunspore'],57:['karate','lowkick','scratch','rage'],110:['smog','tackle','poisongas','smoke'],117:['bubble','water','smokescreen','leer'],119:['hornattack','peck','supersonic','tailwhip'],
120:['tackle','harden','bubble'],121:['swift','waterpulse','tackle'],118:['peck','tailwhip','supersonic'],116:['bubble','smokescreen','leer'],90:['tackle','withdraw','supersonic'],
19:['tackle','quick'],10:['tackle','stringshot'],13:['poisonsting','stringshot'],11:['harden','tackle'],14:['harden','poisonsting'],
41:['gust','bite','poisonsting'],46:['scratch','seed','tackle'],35:['sing','tackle','growl'],21:['peck','quick','sand'],
29:['scratch','poisonsting','growl'],32:['peck','poisonsting','tackle'],39:['sing','tackle','growl'],56:['scratch','karate','growl'],
95:['rock','tackle','curl'],23:['poisonsting','bite','growl'],109:['smoke','tackle','poisonsting'],
16:['gust','quick','tackle'],74:['rock','tackle','curl'],25:['shock','quick','wave'],7:['bubble','water','tackle']
};
moveDB.peck={name:'Picotazo',type:'flying',power:35,category:'physical',acc:100,pp:35,shape:'melee',range:1,detail:'Picotazo adyacente'};
// Reglas de evolución del grupo del prototipo. Otras condiciones se integrarán por especie.
const evolutionRules={
  1:{to:2,level:16},2:{to:3,level:32},4:{to:5,level:16},5:{to:6,level:36},
  7:{to:8,level:16},8:{to:9,level:36},16:{to:17,level:18},17:{to:18,level:36},
  74:{to:75,level:25},25:{to:26,item:'thunder-stone'},
  10:{to:11,level:7},11:{to:12,level:10},13:{to:14,level:7},14:{to:15,level:10},19:{to:20,level:20},129:{to:130,level:20},60:{to:61,level:25},21:{to:22,level:20},
  23:{to:24,level:22},27:{to:28,level:22},29:{to:30,level:16},32:{to:33,level:16},41:{to:42,level:22},46:{to:47,level:24},56:{to:57,level:28},109:{to:110,level:35},116:{to:117,level:32},118:{to:119,level:33},98:{to:99,level:28},54:{to:55,level:33},79:{to:80,level:37}
};
// v651: piedras evolutivas. La Piedra Trueno usa el contador histórico thunderStones (compatibilidad con guardados);
// el resto se guarda en la mochila (bag[key]). Para añadir una especie basta con {to,item:'fire-stone'} en evolutionRules.
const EVO_STONES={
  'thunder-stone':{key:'thunderStone',name:'Piedra Trueno',icon:'⚡'},
  'fire-stone':{key:'fireStone',name:'Piedra Fuego',icon:'🔥'},
  'water-stone':{key:'waterStone',name:'Piedra Agua',icon:'💧'},
  'leaf-stone':{key:'leafStone',name:'Piedra Hoja',icon:'🍃'},
  'moon-stone':{key:'moonStone',name:'Piedra Lunar',icon:'🌙'}
};
function stoneQty(item){const S=EVO_STONES[item];if(!S)return 0;return item==='thunder-stone'?thunderStones:(bag[S.key]||0)}
function spendStone(item){const S=EVO_STONES[item];if(!S)return;if(item==='thunder-stone')thunderStones=Math.max(0,thunderStones-1);else bag[S.key]=Math.max(0,(bag[S.key]||0)-1)}
const STONE_BY_KEY=Object.fromEntries(Object.entries(EVO_STONES).map(([item,S])=>[S.key,item]));
function itemQty(id){return STONE_BY_KEY[id]?stoneQty(STONE_BY_KEY[id]):(bag[id]||0)}
function useEvoStone(u){
  const r=u&&evolutionRules[u.id],S=r&&EVO_STONES[r.item];
  if(!S||!base[r.to]||stoneQty(r.item)<=0||!canPrepare())return;
  const wasLocked=locked;locked=true;
  $('managerOverlay').hidden=true;
  pendingProgress.push({kind:'evolve',u,to:r.to,reason:S.name,stone:r.item});
  resolveProgress(()=>{locked=wasLocked;managerSelected=u;autoSaveSafe();openManager('team')});
}
// Tabla local FireRed / LeafGreen para los Pokémon del primer arco (incluye cada nivel inicial).
// Cada fila corresponde a un aprendizaje por nivel. No hay ataques adelantados por comodidad.
const learnsets={
 52:[[1,'scratch'],[1,'growl'],[11,'bite'],[41,'slash']],
 725:[[1,'scratch'],[1,'ember'],[1,'growl'],[4,'leer'],[7,'bite'],[16,'slash'],[28,'flame']],
 443:[[1,'tackle'],[3,'sand'],[7,'dragonrage'],[23,'slash'],[28,'dragonclaw'],[34,'rock']],
 25:[[1,'growl'],[1,'shock'],[6,'tailwhip'],[8,'wave'],[11,'quick'],[15,'doubleteam'],[20,'slam'],[26,'bolt']],
 4:[[1,'growl'],[1,'scratch'],[7,'ember'],[13,'metalclaw'],[19,'smoke'],[25,'scary'],[31,'flame'],[37,'slash']],
 1:[[1,'tackle'],[4,'growl'],[7,'seed'],[10,'vine'],[15,'powderpoison'],[15,'powdersleep'],[20,'razor']],
 7:[[1,'tackle'],[4,'tailwhip'],[7,'bubble'],[10,'withdraw'],[13,'water'],[18,'bite']],
 16:[[1,'tackle'],[5,'sand'],[9,'gust'],[13,'quick'],[25,'wing']],
 74:[[1,'tackle'],[1,'curl'],[6,'mudsport'],[11,'rock']],
 19:[[1,'tackle'],[1,'tailwhip'],[7,'quick']],
 10:[[1,'tackle'],[1,'stringshot']],
 13:[[1,'poisonsting'],[1,'stringshot']],
 11:[[1,'tackle'],[1,'stringshot'],[1,'harden']],14:[[1,'poisonsting'],[1,'stringshot'],[1,'harden']], // Metapod/Kakuna salvajes también conocen un ataque: si no, al capturarlos no podrían atacar ni ganar experiencia
 
 12:[[1,'stringshot'],[12,'confusion'],[15,'powderpoison'],[16,'stunspore'],[17,'powdersleep'],[21,'supersonic'],[32,'gust'],[38,'psybeam']],15:[[1,'furyattack'],[1,'focus'],[20,'twineedle'],[25,'rage'],[30,'pursuit'],[35,'pinmissile'],[40,'agility']],20:[[1,'tackle'],[1,'tailwhip'],[1,'quick'],[1,'bite']],22:[[1,'peck'],[1,'growl'],[1,'leer'],[1,'wing']],
 41:[[1,'leechlife'],[6,'astonish'],[11,'supersonic'],[16,'bite'],[21,'wing']],
 138:[[1,'water'],[1,'withdraw'],[10,'bubble'],[13,'bite']],
 140:[[1,'scratch'],[1,'harden'],[10,'leer'],[13,'bite']],
 63:[[1,'confusion'],[8,'swift']],
 43:[[1,'absorb'],[5,'powderpoison'],[9,'stunspore'],[12,'powdersleep']],
 69:[[1,'vine'],[1,'tackle'],[6,'wrap'],[11,'powderpoison'],[14,'powdersleep']],
 60:[[1,'bubble'],[1,'tackle'],[7,'water'],[13,'doubleslap']],
 61:[[1,'bubble'],[1,'water'],[1,'doubleslap'],[1,'tackle']],
 129:[[1,'tackle']],
 130:[[1,'tackle'],[1,'bite'],[1,'leer'],[25,'water']],
 98:[[1,'bubble'],[1,'leer'],[15,'harden'],[20,'slam']],
 99:[[1,'bubble'],[1,'leer'],[1,'harden'],[1,'slam']],
 54:[[1,'scratch'],[1,'tailwhip'],[5,'water'],[10,'confusion']],
 55:[[1,'scratch'],[1,'tailwhip'],[1,'water'],[1,'confusion'],[39,'psybeam']],
 79:[[1,'tackle'],[1,'growl'],[6,'water'],[13,'confusion']],
 80:[[1,'tackle'],[1,'growl'],[1,'water'],[1,'confusion'],[43,'psybeam']],
 66:[[1,'karate'],[1,'leer'],[7,'lowkick']],
 88:[[1,'tackle'],[1,'poisongas'],[8,'harden'],[12,'smog']],
 81:[[1,'tackle'],[6,'supersonic'],[8,'wave'],[11,'shock']],
 100:[[1,'tackle'],[9,'screech'],[11,'shock']],
 46:[[1,'scratch'],[7,'stunspore'],[13,'powderpoison'],[19,'leechlife']],
 35:[[1,'pound'],[1,'growl'],[5,'encore'],[9,'sing'],[13,'doubleslap']],
 21:[[1,'peck'],[1,'growl'],[7,'leer']],
 29:[[1,'growl'],[1,'scratch'],[8,'tailwhip']],
 32:[[1,'leer'],[1,'peck'],[8,'focus']],
 39:[[1,'sing'],[4,'curl'],[9,'pound']],
 56:[[1,'leer'],[1,'scratch'],[6,'lowkick'],[11,'karate']],
 27:[[1,'scratch'],[3,'curl'],[7,'sand']],
 24:[[1,'wrap'],[1,'leer'],[1,'poisonsting'],[13,'bite'],[27,'screech']],
 28:[[1,'scratch'],[1,'curl'],[1,'sand'],[24,'slash']],
 30:[[1,'growl'],[1,'scratch'],[1,'tailwhip'],[12,'bite'],[23,'poisonsting']],
 33:[[1,'leer'],[1,'peck'],[1,'focus'],[12,'furyattack'],[23,'poisonsting']],
 42:[[1,'leechlife'],[1,'astonish'],[1,'supersonic'],[1,'bite'],[26,'wing']],
 47:[[1,'scratch'],[1,'stunspore'],[1,'powderpoison'],[1,'leechlife'],[27,'slash']],
 57:[[1,'leer'],[1,'scratch'],[1,'lowkick'],[1,'karate'],[28,'rage']],
 110:[[1,'poisongas'],[1,'tackle'],[1,'smog'],[25,'smoke']],
 117:[[1,'bubble'],[1,'smokescreen'],[1,'leer'],[22,'water'],[32,'waterpulse']],
 119:[[1,'peck'],[1,'tailwhip'],[1,'supersonic'],[1,'hornattack'],[24,'water']],
 120:[[1,'tackle'],[1,'harden'],[7,'bubble'],[13,'water'],[19,'swift']],
 121:[[1,'tackle'],[1,'water'],[1,'swift'],[1,'waterpulse'],[1,'rapidspin']],
 118:[[1,'peck'],[1,'tailwhip'],[5,'supersonic'],[10,'hornattack']],
 116:[[1,'bubble'],[8,'smokescreen'],[15,'leer'],[22,'water']],
 90:[[1,'tackle'],[1,'withdraw'],[8,'supersonic'],[15,'bubble']],
 95:[[1,'screech'],[1,'tackle'],[8,'bind'],[12,'rock'],[19,'harden']],
 23:[[1,'wrap'],[1,'leer'],[8,'poisonsting'],[13,'bite']],
 109:[[1,'poisongas'],[1,'tackle'],[9,'smog'],[25,'smoke']],
 2:[[1,'tackle'],[1,'growl'],[7,'seed'],[10,'vine'],[15,'powderpoison'],[15,'powdersleep'],[22,'razor']],
 3:[[1,'tackle'],[1,'growl'],[7,'seed'],[10,'vine'],[15,'powderpoison'],[15,'powdersleep'],[22,'razor']],
 5:[[1,'growl'],[1,'scratch'],[7,'ember'],[13,'metalclaw'],[20,'smoke'],[27,'scary'],[34,'flame'],[41,'slash']],
 6:[[1,'growl'],[1,'scratch'],[7,'ember'],[13,'metalclaw'],[20,'smoke'],[27,'scary'],[34,'flame'],[36,'wing'],[44,'slash']],
 8:[[1,'tackle'],[4,'tailwhip'],[7,'bubble'],[10,'withdraw'],[13,'water'],[19,'bite']],
 9:[[1,'tackle'],[4,'tailwhip'],[7,'bubble'],[10,'withdraw'],[13,'water'],[19,'bite']],
 17:[[1,'tackle'],[5,'sand'],[9,'gust'],[13,'quick'],[27,'wing']],
 18:[[1,'tackle'],[5,'sand'],[9,'gust'],[13,'quick'],[27,'wing']],
 75:[[1,'tackle'],[1,'curl'],[6,'mudsport'],[11,'rock']],
 26:[[1,'growl'],[1,'shock'],[1,'tailwhip'],[1,'quick']]
};
for(const id of Object.keys(learnsets))learnsets[id]=learnsets[id].filter(([level,key])=>!!moveDB[key]).map(([level,key])=>({level,key}));
const pokeMoveKeys={'growl':'growl','thunder-shock':'shock','tail-whip':'tailwhip','thunder-wave':'wave',
 'quick-attack':'quick','double-team':'doubleteam','slam':'slam','thunderbolt':'bolt',
 'scratch':'scratch','ember':'ember','metal-claw':'metalclaw','smokescreen':'smoke','scary-face':'scary','flamethrower':'flame',
 'slash':'slash','tackle':'tackle','leech-seed':'seed','vine-whip':'vine','poison-powder':'powderpoison',
 'sleep-powder':'powdersleep','razor-leaf':'razor','bubble':'bubble','withdraw':'withdraw','water-gun':'water',
 'bite':'bite','sand-attack':'sand','gust':'gust','wing-attack':'wing','defense-curl':'curl','mud-sport':'mudsport',
 'rock-throw':'rock','rock-tomb':'rocktomb','string-shot':'stringshot','poison-sting':'poisonsting','harden':'harden',
 'leech-life':'leechlife','stun-spore':'stunspore','astonish':'astonish','supersonic':'supersonic','pound':'pound','encore':'encore',
 'sing':'sing','double-slap':'doubleslap','peck':'peck','leer':'leer','focus-energy':'focus',
 'low-kick':'lowkick','karate-chop':'karate','bind':'bind','screech':'screech','wrap':'wrap',
 'poison-gas':'poisongas','smog':'smog'};
// El jugador aprende un movimiento nuevo al nivel exacto; los rivales se crean con los últimos 1 a 4 aprendidos.
function movesForLevel(id,level){
    const rows=(learnsets[id]||[]).filter(row=>row.level<=level&&moveDB[row.key]);
    const distinct=[];
    for(const row of rows){const old=distinct.indexOf(row.key);if(old>=0)distinct.splice(old,1);distinct.push(row.key)}
    return distinct.slice(-4).length?distinct.slice(-4):['tackle'];
}
let fossilChoice=null,fossilRevived=false,pendingFossil=false;
let fishRods=0;const ROD_TEST=true; // ROD_TEST: todas las cañas disponibles para revisar la pesca (poner en false para volver a la progresión por historia)
const rodLevel=()=>(DEVU||ROD_TEST)?3:fishRods;const ROD_NAMES=['','Caña Vieja','Caña Buena','Supercaña'];
const FISH_POOLS={c1:[{id:129,w:100,min:5,max:5}],c2:[{id:129,w:30,min:5,max:12},{id:98,w:40,min:8,max:15},{id:116,w:30,min:8,max:15}],c3:[{id:98,w:34,min:15,max:22},{id:116,w:34,min:15,max:22},{id:54,w:11,min:20,max:25},{id:79,w:11,min:20,max:25},{id:130,w:10,min:15,max:20}],a1:[{id:129,w:100,min:5,max:5}],a2:[{id:129,w:50,min:5,max:10},{id:60,w:50,min:5,max:12}],a3:[{id:60,w:60,min:12,max:20},{id:61,w:40,min:18,max:24}],b1:[{id:129,w:100,min:5,max:5}],b2:[{id:129,w:50,min:5,max:10},{id:118,w:50,min:8,max:15}],b3:[{id:118,w:60,min:15,max:22},{id:119,w:40,min:20,max:26}]};const FISH_REG={route22:'a',route4:'b',ceruleanrival:'b'};const fishPool=(id,r)=>FISH_POOLS[(FISH_REG[id]||'c')+r];
let money=0,moneyPaid=new Set(),rewardNote='',thunderStones=1,pendingProgress=[],progressIsOpen=false,pendingExperience=[];
let reserves=[],storageBox=[],bag={potion:4,superPotion:2,revive:2,ether:2,antidote:0,parlyz:0,pokeball:18,greatball:6,ultraball:3},managerSelected=null,managerTab=null,lastSaveStamp=null;
let captureMode=null,captureBusy=false;const BOX_CAPACITY=30,CAPTURE_RANGE=3;
const SAVE_KEY="pokemon-tactics-gba-v08-save";
let starterChoice=null; // La elección de la nueva partida se guarda; los guardados antiguos no se modifican.

Object.assign(moveDB.encore,{effect:'encore',detail:'Obliga al objetivo a repetir su último movimiento durante 3 turnos'});
Object.assign(moveDB.shock,{effect:'paralysis10',detail:'Línea de hasta 3 casillas · 10% de paralizar'});
Object.assign(moveDB.bolt,{effect:'paralysis10',detail:'Línea hasta 4 casillas · 10% de paralizar'});
Object.assign(moveDB.bubble,{effect:'slow10',detail:'Línea de 3 casillas · 10% de reducir movilidad'});
Object.assign(moveDB.confusion,{effect:'confuse10',detail:'Onda psíquica a 3 casillas · 10% de confundir'});
Object.assign(moveDB.psybeam,{effect:'confuse10',detail:'Rayo psíquico en línea · 10% de confundir'});
Object.assign(moveDB.waterpulse,{effect:'confuse20',detail:'Pulso de agua a 3 casillas · 20% de confundir'});
Object.assign(moveDB.smog,{effect:'poison40',detail:'40% de envenenar'});
Object.assign(moveDB.screech,{effect:'defDown2',detail:'Baja mucho la Defensa del enemigo (2 niveles)'});
Object.assign(moveDB.bite,{effect:'flinch30',detail:'Ataque adyacente · 30% de amedrentar'});
Object.assign(moveDB.astonish,{effect:'flinch30',detail:'Ataque adyacente · 30% de amedrentar'});
Object.assign(moveDB.razor,{hcrit:1,detail:'Línea hasta 3 casillas · golpe crítico más probable'});
Object.assign(moveDB.slash,{hcrit:1,detail:'Ataque físico a una casilla · golpe crítico más probable'});
Object.assign(moveDB.karate,{hcrit:1,detail:'Ataque adyacente · golpe crítico más probable'});
Object.assign(moveDB.pinmissile,{power:14,multi:[2,5],detail:'Lluvia de agujas a 3 casillas · golpea de 2 a 5 veces'});
Object.assign(moveDB.mudsport,{effect:'mudsport',detail:'Debilita a la mitad los ataques Eléctricos mientras siga en combate'});
Object.assign(moveDB.agility,{effect:'speedUp',detail:'Aumenta mucho la velocidad: +2 PM durante 2 turnos'});
Object.assign(moveDB.rage,{detail:'Cuerpo a cuerpo · si lo golpean, sube su Ataque'});
Object.assign(moveDB.ragemove,{detail:'Ataque adyacente · si lo golpean, sube su Ataque'});
const chart={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0},dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,steel:.5,fairy:2},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5}};
const TYPE_EMOJI={dragon:'🐉',normal:'⚪',fire:'🔥',water:'💧',grass:'🌿',electric:'⚡',flying:'🕊️',ground:'🟤',rock:'🪨',poison:'☠️',bug:'🐛',fighting:'🥊',psychic:'🔮',ghost:'👻',dark:'🌑',steel:'⚙️'};
const typeColors={dragon:'#7a6fd1',electric:'#e3bf59',fire:'#e37f55',grass:'#7bba77',water:'#75b1d9',normal:'#a7aba4',flying:'#93a9d0',ground:'#c4a36d',rock:'#a79a78',poison:'#ae8ccc'};
