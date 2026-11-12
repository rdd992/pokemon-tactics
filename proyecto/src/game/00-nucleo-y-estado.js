

(()=>{
'use strict';
const $=id=>document.getElementById(id),canvas=$('map'),ctx=canvas.getContext('2d'),S=60,W=12,H=10;
const sceneCanvas=$('battleScene'),sg=sceneCanvas.getContext('2d');sg.imageSmoothingEnabled=false;
let animationEnabled=true,cinematicBusy=false;

ctx.imageSmoothingEnabled=false;
let map=[
'............',
'..F...X...F.',
'.F....X.....',
'...F.....F..',
'.....~~.....',
'..F..~~..F..',
'..F......F..',
'........X...',
'...F........',
'............'];
const base={
25:{name:'Pikachu',types:['electric'],stats:[35,55,40,50,50,90],emoji:'⚡',move:4},
4:{name:'Charmander',types:['fire'],stats:[39,52,43,60,50,65],emoji:'🔥',move:4},
1:{name:'Bulbasaur',types:['grass','poison'],stats:[45,49,49,65,65,45],emoji:'🌱',move:3},
7:{name:'Squirtle',types:['water'],stats:[44,48,65,50,64,43],emoji:'💧',move:3},
16:{name:'Pidgey',types:['normal','flying'],stats:[40,45,40,35,35,56],emoji:'🐦',move:5},
74:{name:'Geodude',types:['rock','ground'],stats:[40,80,100,30,30,20],emoji:'🪨',move:2},
2:{name:'Ivysaur',types:['grass','poison'],stats:[60,62,63,80,80,60],emoji:'🌿',move:3},
5:{name:'Charmeleon',types:['fire'],stats:[58,64,58,80,65,80],emoji:'🔥',move:4},
26:{name:'Raichu',types:['electric'],stats:[60,90,55,90,80,110],emoji:'⚡',move:4},
3:{name:'Venusaur',types:['grass','poison'],stats:[80,82,83,100,100,80],emoji:'🌺',move:3},
6:{name:'Charizard',types:['fire','flying'],stats:[78,84,78,109,85,100],emoji:'🔥',move:4},
8:{name:'Wartortle',types:['water'],stats:[59,63,80,65,80,58],emoji:'💧',move:3},
9:{name:'Blastoise',types:['water'],stats:[79,83,100,85,105,78],emoji:'💧',move:3},
17:{name:'Pidgeotto',types:['normal','flying'],stats:[63,60,55,50,50,71],emoji:'🪽',move:5},
18:{name:'Pidgeot',types:['normal','flying'],stats:[83,80,75,70,70,101],emoji:'🪽',move:5},
75:{name:'Graveler',types:['rock','ground'],stats:[55,95,115,45,45,35],emoji:'🪨',move:2}
};
const moveDB={
shock:{name:'Impactrueno',type:'electric',power:40,category:'special',acc:100,pp:30,shape:'line',range:3,detail:'Línea de hasta 3 casillas'},
quick:{name:'Ataque Rápido',type:'normal',power:40,category:'physical',acc:100,pp:30,shape:'melee',range:1,detail:'Una casilla adyacente'},
wave:{name:'Onda Trueno',type:'electric',power:0,category:'status',acc:90,pp:20,shape:'point',range:2,effect:'paralysis',detail:'Paraliza un enemigo'},
swift:{name:'Rapidez',type:'normal',power:60,category:'special',acc:100,pp:20,shape:'area',range:3,radius:1,detail:'Área: todos los enemigos cercanos'},
scratch:{name:'Arañazo',type:'normal',power:40,category:'physical',acc:100,pp:35,shape:'melee',range:1,detail:'Una casilla adyacente'},
ember:{name:'Ascuas',type:'fire',power:40,category:'special',acc:100,pp:25,shape:'line',range:3,effect:'burn10',detail:'Línea; 10% de quemadura'},
growl:{name:'Gruñido',type:'normal',power:0,category:'status',acc:100,pp:40,shape:'area',range:2,radius:1,effect:'atkDown',detail:'Baja Ataque en un área'},
smoke:{name:'Pantalla de Humo',type:'normal',power:0,category:'status',acc:100,pp:20,shape:'point',range:2,effect:'accuracyDown',detail:'Baja precisión'},
tackle:{name:'Placaje',type:'normal',power:35,category:'physical',acc:95,pp:35,shape:'melee',range:1,detail:'Una casilla adyacente'},
vine:{name:'Látigo Cepa',type:'grass',power:45,category:'physical',acc:100,pp:25,shape:'line',range:2,detail:'Línea de 2 casillas'},
seed:{name:'Drenadoras',type:'grass',power:0,category:'status',acc:90,pp:10,shape:'point',range:2,effect:'seed',detail:'Drena PS al cerrar cada ronda'},
bubble:{name:'Burbuja',type:'water',power:20,category:'special',acc:100,pp:30,shape:'line',range:3,detail:'Línea de 3 casillas'},
water:{name:'Pistola Agua',type:'water',power:40,category:'special',acc:100,pp:25,shape:'point',range:2,detail:'Objetivo a 2 casillas'},
withdraw:{name:'Refugio',type:'water',power:0,category:'status',acc:100,pp:40,shape:'self',range:0,effect:'defUp',detail:'Aumenta Defensa'},
gust:{name:'Tornado',type:'flying',power:40,category:'special',acc:100,pp:35,shape:'line',range:3,detail:'Línea de 3 casillas'},
sand:{name:'Ataque Arena',type:'ground',power:0,category:'status',acc:100,pp:15,shape:'point',range:2,effect:'accuracyDown',detail:'Baja precisión'},
rock:{name:'Lanzarrocas',type:'rock',power:50,category:'physical',acc:90,pp:15,shape:'point',range:2,detail:'Hasta 2 casillas'},
curl:{name:'Rizo Defensa',type:'normal',power:0,category:'status',acc:100,pp:40,shape:'self',range:0,effect:'defUp',detail:'Aumenta Defensa'},
slam:{name:'Atizar',type:'normal',power:80,category:'physical',acc:75,pp:20,shape:'melee',range:1,detail:'Ataque físico a una casilla'},
bolt:{name:'Rayo',type:'electric',power:95,category:'special',acc:100,pp:15,shape:'line',range:4,detail:'Línea hasta 4 casillas'},
rage:{name:'Furia',type:'normal',power:20,category:'physical',acc:100,pp:20,shape:'melee',range:1,detail:'Cuerpo a cuerpo'},
razor:{name:'Hoja Afilada',type:'grass',power:55,category:'special',acc:95,pp:25,shape:'line',range:3,detail:'Línea hasta 3 casillas'},
scary:{name:'Cara Susto',type:'normal',power:0,category:'status',acc:90,pp:10,shape:'point',range:2,effect:'slow',detail:'Reduce movilidad enemiga'},
flame:{name:'Lanzallamas',type:'fire',power:95,category:'special',acc:100,pp:15,shape:'line',range:3,effect:'burn10',detail:'Línea hasta 3 casillas'},
slash:{name:'Cuchillada',type:'normal',power:70,category:'physical',acc:100,pp:20,shape:'melee',range:1,detail:'Ataque físico a una casilla'},
wing:{name:'Ataque Ala',type:'flying',power:60,category:'physical',acc:100,pp:35,shape:'melee',range:1,detail:'Ataque de contacto'}
};

