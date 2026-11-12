// v0.29: Sprites FRLG por red, con segunda fuente y dibujos pixel-art locales como respaldo.
// Los alternativos son creados para el prototipo; NO son sprites oficiales.
const SPRITE_PATH='sprites/pokemon/versions/generation-iii/';
const SPRITE_MIRRORS=[
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/'
];
const sprites={},miniSprites={};
const spriteCounters={remote:0,offline:0};
const localSprites={};
function spriteFile(id,kind){return SPRITE_PATH+(kind==='mini'?'icons/':kind==='back'?'firered-leafgreen/back/':'firered-leafgreen/')+id+'.png'}
function spriteURL(id){const sp=fetchSprite(id);return sp&&sp.img&&sp.img.src?sp.img.src:localSprite(id,'front')}
function miniSpriteURL(id){return miniSprites[id]&&miniSprites[id].img&&miniSprites[id].img.src?miniSprites[id].img.src:SPRITE_MIRRORS[0]+spriteFile(id,'mini')}
function backSpriteURL(id){return SPRITE_MIRRORS[0]+spriteFile(id,'back')}
function localSprite(id,kind){
 const cacheKey=id+':'+kind;if(localSprites[cacheKey])return localSprites[cacheKey];
 const cv=document.createElement('canvas');cv.width=32;cv.height=32;const q=cv.getContext('2d');q.imageSmoothingEnabled=false;
 const r=(x,y,w,h,col)=>{q.fillStyle=col;q.fillRect(x,y,w,h)};
 const p=(points,col)=>{q.fillStyle=col;q.beginPath();q.moveTo(...points[0]);for(let i=1;i<points.length;i++)q.lineTo(...points[i]);q.closePath();q.fill()};
 const outline='#313c47',eye='#222d3e',bright='#f9f1d1';
 q.save(); // El dibujo local sirve como figura lateral si no hay back sprite auténtico.
 let t=id;
 if([4,5,6].includes(t)){ // pequeña salamandra naranja con cola encendida
  let body=t===4?'#f28743':'#d97543';
  r(3,14,7,7,'#e78c48');r(1,11,6,8,'#f7ce66');r(2,9,3,6,'#fff1ad');r(5,16,8,5,outline);r(6,16,8,4,body);
  r(12,11,13,15,outline);r(13,10,12,15,body);r(15,17,7,7,'#f7d09a');r(12,24,6,5,outline);r(18,24,6,5,outline);
  r(16,5,13,10,outline);r(17,6,11,8,body);r(20,2,5,7,body);r(24,10,3,2,bright);r(24,9,2,4,eye);r(28,14,2,2,outline);
  if(t===6){p([[14,10],[3,3],[6,18],[14,22]],'#4f95a9');p([[21,10],[31,2],[28,17],[21,22]],'#4f95a9')}
 }else if([7,8,9].includes(t)){ // tortuga azul
  r(3,19,8,7,outline);r(4,19,9,5,'#81bad8');r(11,13,17,14,outline);r(12,14,14,12,'#8f6547');r(15,15,9,10,'#d9b77f');
  r(7,7,15,13,outline);r(8,8,13,11,'#81bddd');r(11,6,8,5,'#a8d5e6');r(19,12,3,4,'#dff0ec');r(20,13,2,3,eye);
  r(11,24,5,5,outline);r(21,24,5,5,outline);r(13,25,3,3,'#81bddd');r(22,25,3,3,'#81bddd');
  if(t===9){r(13,12,11,4,'#e5d0a1');r(12,13,3,10,'#98b4c9');r(23,13,3,10,'#98b4c9')}
 }else if([1,2,3].includes(t)){ // criatura verde de cuatro patas con bulbo
  r(4,13,24,14,outline);r(6,14,21,11,'#7ecca7');r(5,23,6,5,outline);r(22,23,6,5,outline);
  r(14,4,13,12,outline);r(16,5,11,10,t===3?'#dd87ad':'#62a66b');r(17,2,6,6,'#8ed07d');r(12,8,4,7,'#549b68');
  r(5,13,9,4,'#5aa7a3');r(4,17,4,4,'#477d82');r(10,19,5,3,'#549c92');r(22,17,2,3,bright);r(23,17,2,3,eye);
 }else if([25,26].includes(t)){ // ratón eléctrico amarillo
  p([[5,13],[1,8],[9,9],[9,4],[15,12]],'#f1ce56');r(5,9,2,5,'#aa7a49');
  r(11,12,17,15,outline);r(12,12,15,14,'#f7d35c');r(12,5,14,11,outline);r(13,6,12,10,'#f7d35c');
  r(13,1,4,7,'#463f44');r(21,1,4,7,'#463f44');r(14,4,3,6,'#f7d35c');r(22,4,3,6,'#f7d35c');
  r(15,12,3,4,eye);r(23,12,3,4,eye);r(14,17,5,4,'#ed8a72');r(24,17,4,4,'#ed8a72');r(14,26,4,3,outline);r(23,26,4,3,outline);
 }else if([16,17,18,21,22].includes(t)){ // ave de ruta
  r(8,15,20,12,outline);r(9,16,18,10,'#b58c64');r(10,10,16,13,outline);r(11,11,14,11,'#c8a77e');
  p([[12,13],[13,2],[20,10],[24,5],[25,14]],'#754e50');r(23,15,4,4,eye);r(26,18,5,3,'#e9c46b');
  p([[8,17],[1,10],[3,23],[13,23]],'#88634e');r(10,27,3,3,'#785447');r(18,27,3,3,'#785447');
 }else if([74,75,95].includes(t)){ // roca
  r(7,7,19,19,outline);r(8,8,17,17,'#aaa6a1');r(10,10,8,7,'#d7d2c6');r(18,9,5,6,'#8d8e8b');
  r(1,16,9,9,outline);r(2,17,7,7,'#9f9b96');r(23,16,9,9,outline);r(24,17,6,7,'#a59f9a');r(12,17,3,3,eye);r(20,17,3,3,eye);
 }else if([10,11,12,13,14,15,46,47].includes(t)){ // insecto segmentado
  const green=[10,11,12,46,47].includes(t);const fill=green?'#78b768':'#cb9865';
  for(let i=0;i<4;i++){r(2+i*6,17-(i%2)*4,10,11,outline);r(3+i*6,18-(i%2)*4,8,9,fill)}
  r(21,8,10,13,outline);r(22,9,8,11,fill);r(25,12,2,3,eye);r(23,5,3,5,'#c56770');
 }else if([19,20,29,30,32,33].includes(t)){ // pequeño mamífero
  const fill=[19,20].includes(t)?'#a58fbb':'#a08cc7';
  r(7,15,21,12,outline);r(8,16,19,10,fill);r(17,8,13,13,outline);r(18,9,11,11,fill);
  p([[19,10],[19,1],[24,9]],'#8a6ba1');p([[26,10],[27,1],[30,10]],'#8a6ba1');r(24,14,3,3,eye);r(28,18,3,2,'#ecb6b7');r(10,25,5,5,outline);r(23,25,5,5,outline);
 }else if(t===27){ // pangolín de arena
  r(7,14,20,14,outline);r(9,14,18,12,'#e8cf8f');p([[7,14],[13,4],[21,12]],'#c9a460');p([[14,14],[21,5],[28,17]],'#c9a460');r(22,17,2,3,eye);r(10,26,5,3,outline);r(21,26,5,3,outline);
 }else if(t===56){ // mono
  r(9,12,20,15,outline);r(10,13,18,12,'#d5c1a2');r(12,5,14,14,outline);r(13,6,12,12,'#e4d0b0');r(16,11,3,3,eye);r(22,11,3,3,eye);r(2,15,9,8,outline);r(3,16,8,6,'#d5c1a2');
 }else{ // otras especies, silueta pixel art local por familia cromática
  let type=(base[id]&&base[id].types[0])||'normal';const col=({fire:'#f08a59',water:'#7bb6d4',grass:'#75bd82',poison:'#b49ad2',rock:'#c1b18c',normal:'#cbb6a3',electric:'#f4ce65'})[type]||'#a2bfac';
  r(8,11,20,17,outline);r(9,12,18,15,col);r(12,5,15,13,outline);r(13,6,13,12,col);r(15,2,4,8,col);r(23,3,4,7,col);r(22,13,3,4,eye);r(10,25,5,4,outline);r(22,25,5,4,outline);
 }
 q.restore();localSprites[cacheKey]=cv.toDataURL('image/png');return localSprites[cacheKey];
}
function refreshAfterSprite(kind){
 if(kind==='mini'){if(typeof updateRoster==='function')updateRoster();}
 for(const im of document.querySelectorAll('img[data-poke-sprite]')){
  const id=Number(im.dataset.pokeSprite),sp=sprites[id];
  if(sp&&sp.ready&&im.src!==sp.img.src)im.src=sp.img.src;
 }
 if(managerTab==='team'&&!$('managerOverlay').hidden)renderTeam();
 if(typeof updateSpriteBanner==='function')updateSpriteBanner();
}
// v0.33: los sprites descargados se guardan localmente. No hace falta descargarlos de nuevo
// al cambiar de batalla, incluso cuando un espejo de GitHub tarda en responder.
const SPRITE_CACHE_VERSION='pktt-frlg-2026-1:';
function cacheSprite(id,kind,img){
 try{
  const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  if(!c.width||!c.height||c.width>256||c.height>256)return;
  c.getContext('2d').drawImage(img,0,0);
  localStorage.setItem(SPRITE_CACHE_VERSION+kind+'-'+id,c.toDataURL('image/png'));
 }catch(e){/* El navegador puede impedir convertir imágenes externas; seguimos jugando. */}
}
// v0.39: sprites FireRed/LeafGreen incrustados para que funcionen sin conexión o en visores que bloquean imágenes externas.
