// Ratón: el puntero nativo se mueve libremente, sin quedar anclado a la cuadrícula.
// Únicamente traducimos su posición a casilla para selección, ruta y alcance.
canvas.addEventListener('pointermove',ev=>{
    const p=cellAt(ev);
    usingKeyboard=false;
    mouseOnBoard=true;
    if(inside(p.x,p.y)){
        if(!hovered||hovered.x!==p.x||hovered.y!==p.y){
            hovered=p;keyboardCursor={...p};updateTileHint();
        }
    }else{hovered=null;updateTileHint()}
});
canvas.addEventListener('pointerleave',()=>{
    mouseOnBoard=false;
    if(!usingKeyboard){hovered=null;updateTileHint()}
});
canvas.addEventListener('click',ev=>{
    const p=cellAt(ev);
    usingKeyboard=false;
    mouseOnBoard=true;
    if(inside(p.x,p.y)){
        hovered=p;
        keyboardCursor={...p};
        updateTileHint();
        if(window.__campOn&&p.x===6&&p.y===1&&typeof openLunarPrompt==='function'){openLunarPrompt();return} // grieta de luz del campamento
        // Un clic sobre la unidad selecciona su rango. El siguiente confirma el destino.
        selectCell(p.x,p.y)
    }
});
$('endTurn').onclick=()=>{
    if(phase==='player'&&!locked&&!captureMode){units.filter(u=>u.side==='player').forEach(u=>{u.moved=true;u.acted=true});selected=null;inspectedEnemy=null;enemyAnalysis=null;closeBattleMenu();skill=null;updateUI();beginEnemy()}
};
window.addEventListener('keydown',e=>{
    if(!$('managerOverlay').hidden||!$('gameBag').hidden||$('modal').hidden===false)return;
    const controls={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if(actionMenu){
        {const dm=/^(?:Digit|Numpad)([1-5])$/.exec(e.code);if(dm){e.preventDefault();if(e.repeat)return;const cm=menuCommands(),ix=+dm[1]-1;if(cm[ix]&&!cm[ix].disabled){menuIndex=ix;cm[ix].run()}return}}
        if(e.code==='ArrowUp'||e.code==='ArrowDown'){
            e.preventDefault();const cmds=menuCommands(),step=e.code==='ArrowUp'?-1:1;
            menuIndex=(menuIndex+step+cmds.length)%cmds.length;renderMenuHighlight();return;
        }
        if(e.code==='Enter'||e.code==='Space'||e.code==='KeyZ'){
            e.preventDefault();if(e.repeat)return;let cmd=menuCommands()[menuIndex];if(cmd&&!cmd.disabled)cmd.run();return;
        }
        if(e.code==='Escape'||e.code==='Backspace'||e.code==='KeyX'){
            e.preventDefault();cancelTacticalAction();return;
        }
        return;
    }
    {const dm=/^(?:Digit|Numpad)([1-4])$/.exec(e.code);if(dm&&phase==='player'&&!locked&&!captureMode&&selected&&!selected.acted&&skill!==null){e.preventDefault();if(e.repeat)return;const n=+dm[1]-1;if(n===skill){const c=hovered||keyboardCursor;if(c)selectCell(c.x,c.y)}else if(n<selected.moves.length)chooseSkill(n);return}}
    if(controls[e.code]&&phase==='player'&&!locked){
        e.preventDefault();usingKeyboard=true;mouseOnBoard=false;
        const gd=window.__r3dir?window.__r3dir(controls[e.code]):controls[e.code];keyboardCursor.x=Math.max(0,Math.min(W-1,keyboardCursor.x+gd[0]));
        keyboardCursor.y=Math.max(0,Math.min(H-1,keyboardCursor.y+gd[1]));
        hovered={...keyboardCursor};updateTileHint();return;
    }
    if((e.code==='Enter'||e.code==='Space'||e.code==='KeyZ')&&phase==='player'){
        e.preventDefault();if(e.repeat)return;usingKeyboard=true;mouseOnBoard=false;
        if(!hovered)hovered={...keyboardCursor};selectCell(hovered.x,hovered.y);return;
    }
    if(e.code==='Escape'||e.code==='Backspace'||e.code==='KeyX'){
        e.preventDefault();cancelTacticalAction();return;
    }
    if(e.code==='KeyN'&&phase==='player'&&!locked&&!captureMode&&!e.repeat){e.preventDefault();$('endTurn').click()}
});
function roundrect(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}

/* v0.38 — Escenarios en pixel art propio (15 px nativos por casilla, escalados x4).
   Sólo cambia la presentación: cuadrícula, terreno F/X/~ y colisiones siguen igual. */
const NT=15; // píxeles nativos por casilla
function gbaRouteMap(id){
    const paths={
       pallet:['.....pp.....','.....pp.....','..ppppppp...','.....pp.....','..pppppppp..','.....pp.....','.....pp.....','..ppppppp...','.....pp.....','.....pp.....'],
       route1:['.....pp.....','.....pp.....','...pppp.....','...p...pp...','....p..pp...','....pp......','...ppp......','...p..pp....','....ppp.....','.....pp.....'],
       viridian:['.....pp.....','.....pp.....','..ppppppp...','.....pp.....','..pppppppp..','.....pp.....','.....pp.....','..ppppppp...','.....pp.....','.....pp.....'],
       route2in:['.....pp.....','.....pp.....','...pppp.....','...pp..pp...','....p..pp...','....pp......','...pp.......','...pppp.....','.....pp.....','.....pp.....'],
       route2:['.....pp.....','.....pp.....','...pppp.....','...pp..pp...','....p..pp...','....pp......','...pp.......','...pppp.....','.....pp.....','.....pp.....'],
       forest:['...pp.......','...pp.......','...pp..pp...','...pp..pp...','...ppppp....','......pp....','...pppp.....','...pp.......','...pppp.....','.....pp.....'],
       forestdoug:['...pp.......','...pp.......','...pp..pp...','...pp..pp...','...ppppp....','......pp....','...pppp.....','...pp.......','...pppp.....','.....pp.....'],
       forestexit:['.....pp.....','.....pp.....','...pppp.....','...pp.......','...ppppp....','......pp....','....pp......','....pp......','.....pp.....','.....pp.....'],
       route22:['.....pp.....','.....pp.....','...ppp......','...p...pp...','...pppppp...','.....p......','.....ppp....','.....pp.....','.....pp.....','.....pp.....'],
       route3b:['.....pp.....','....ppp.....','....p..pp...','....p..pp...','...pp..pp...','...ppp......','.....p......','.....ppp....','......pp....','.....pp.....'],
       route3:['.....pp.....','....ppp.....','....p..pp...','....p..pp...','...pp..pp...','...ppp......','.....p......','.....ppp....','......pp....','.....pp.....'],
       mtmoonj:['.....pp.....','.....pp.....','...pppp.....','...p...pp...','....p..pp...','....pp......','...ppp......','...p..pp....','.....pp.....','.....pp.....'],
       mtmoon:['.....pp.....','.....pp.....','...pppp.....','...p...pp...','....p..pp...','....pp......','...ppp......','...p..pp....','.....pp.....','.....pp.....']
    };
    return paths[id]||paths.route1;
}
/* v0.51 · Mata de hierba alta: sprite 16×16 extraído de la imagen de referencia del usuario. */
const TREE_SPRITE={"pal": {"a": "#b2f686", "b": "#385c11", "c": "#63b24b", "d": "#86d567", "e": "#397721", "f": "#25a161", "g": "#3d9232", "h": "#615b4d"}, "rows": ["................................", ".............bcaabb.............", "............becaagbb............", "...........ebgdaadbbg...........", "..........eggcaaadgggb..........", ".........gdaddaaaddaagg.........", "........gcdaadaaadddddge........", ".......bgdaaaaaaadaddaceb.......", "......ecddaaaaaaaaaaaadcge......", ".....gccdddaaaaaaaaaadddcgg.....", "....gcdggdaaaaaaaaaadacgcdcg....", "....eadcdaaaaaaaaaadaddcdace....", "....gggdaadaaaaaaaaadaadcggg....", "...edaagacdaaaaaaaadacdcdaace...", "...gaagdgdaaadcaagadaacccdade...", "....gdaagdddaadaadaadccdaacc....", "...gaaaddcggcdaaaaadcgcdaaadg...", ".eeeaadcddadcdaddacgccdccaadbgg.", "gecccdgdaaaddcccccccdaddccdcccb.", ".gccbccaaaadddgccgdddaaadcgedcc.", ".gcceeadaaaaaadaddddaaaaadegccc.", "ggcgcedcaadaaaaaaadadddaacecgce.", ".ggcdggddcdaaaaaadadacddcgcdggg.", "gecdddggggdaaaaaaaaaacgggcdddgb.", "bgdddgdddcgddcaaaagaggcddccdddbb", "ccgdgddddcgecdaddadbggcdddcgdgdg", "eeeggddgddcggcddddgggddccdcggbgb", "eebegdgcdddcccggggdgcdddcccgbbgb", "ggceeccdddccdcgccgddcddddcgegced", "gcggbeggdcgcdccddgddggdcgebbgccg", "gcggeeebggcdcccccccdcggebeeeggcb", "eggegggbbecdccdccdgddgbbegggeggb", "eeeegegeebgcggcddceccebeegggeeeg", ".bbgebgggebbbbeccbbbbbgggeeggbe.", ".gbebgggggggebbbbbbgggggggebee..", "..bbbggggeeggggggggggbegggebbe..", "...gbgggbeggeeggggbgggbeggebg...", "..gggbbgbegebeggggbbggbeebeggg..", ".ggggbbbbbeebbeggbbbgbbbbbegggg.", ".gggbbbbbbbbbbeggbbbbbbbbbbeggg.", "ggggbbbbbbbbhhheehhbbbbbbbbbggg.", "ggggbbbbbbbbhhhhhhhbbbbbbbbbggg.", "ggggebbbbbbbhhhhhhhbbbbbbbbeggg.", ".ggggebbbbbbbhhhhhbbbbbbbbegggg.", "..ggggebbbbbbbbbbbbbbbbbbeggg...", "...gggggebbbbbbbbbbbbbbegggg....", ".....gggggebbbbbbbbbbggggg......", "........ggggggggggggggg........."]};
let _treeCv=null;
function getTreeSprite(){
 if(_treeCv)return _treeCv;
 const cv=document.createElement("canvas");cv.width=32;cv.height=48;const g=cv.getContext("2d");
 TREE_SPRITE.rows.forEach((row,y)=>{for(let x=0;x<32;x++){const ch=row[x];if(ch&&ch!==".")  {g.fillStyle=TREE_SPRITE.pal[ch];g.fillRect(x,y,1,1)}}});
 return _treeCv=cv;
}
const TALL_SPRITE={pal:{"a": "#40b18c", "g": "#389232", "l": "#a1dfc1", "d": "#38580f", "b": "#1aa069"},rows:[".......ag.......", "......aglg......", "..gggaallgadgd..", ".blllggl.gdlllda", "..blllg..da.ldga", "...b...gadaagga.", ".bbbgg.gggadddd.", "glll.gg.dada...d", "agl..aggddaaaada", ".agaaaaddgggddgg", "..aggddddddddgga", ".ag..adgddgaada.", ".g..aggggdgggada", "agddddaaagdddddg", "aaggggdagdgggggg", "..aagggddgggaa.."]};
let tallSpriteCanvas=null;
function getTallSprite(){
 if(tallSpriteCanvas)return tallSpriteCanvas;
 const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');
 TALL_SPRITE.rows.forEach((row,y)=>{for(let x=0;x<16;x++){const ch=row[x];if(ch&&ch!=='.'){g.fillStyle=TALL_SPRITE.pal[ch];g.fillRect(x,y,1,1)}}});
 return tallSpriteCanvas=c;
}
function gbaTerrainKind(id,x,y){
    if(id==='gymguard'||id==='pewter'){
        if(y===0)return 'wall';
        if(y>=8&&x>=4&&x<=7)return 'carpet';
        if((x>=3&&x<=8&&y===6)||(x>=4&&x<=7&&y===3))return 'dais';
        return 'floor';
    }
    if(id==='mtmoon'||id==='mtmoonj')return 'cave';
    {const fc=frlgChar(id,x,y);if(fc!==null)return fc==='p'?'path':fc==='T'?'tall':'grass'}
    const rows=gbaRouteMap(id),ch=(rows[y]||'')[x]||'.';
    if(ch==='p')return 'path';
    const shrub=id==='forest'||id==='forestdoug'||id==='forestmid'||id==='forestexit'||id==='route2'||id==='route2in';
    const seed=((x*17+y*41+x*y*7)%23+23)%23;
    const edge=(x===0||x===11);
    if(shrub&&((seed<6&&!edge)||(seed<13&&edge)))return 'tall';
    if(!shrub&&id==='route1'&&((x<=2&&y>=3&&y<=6)||(x>=8&&y>=4&&y<=7)))return 'tall';
    if(id==='route22'&&seed<4)return 'tall';
    return 'grass';
}
function nh(x,y,s){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul((s|0)+1,1274126177);n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0}

