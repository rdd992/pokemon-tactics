# Pruebas de lógica del juego (stats, daño, efectos, nivel, captura). Uso: node build.mjs --test && python3 tests/logic.py
import asyncio,sys,os,json
from playwright.async_api import async_playwright
F=os.path.abspath('dist/test.html')
JS=r"""
()=>{const T=window.__T,R=[];const ok=(n,c,d)=>R.push([n,!!c,d===undefined?'':String(d)]);
const P=(id,lv,side='player')=>T.unit(id,side,3,3,lv,['tackle'in T.moveDB?'tackle':Object.keys(T.moveDB)[0]]);
// stats Gen III: Pikachu(25) nivel 50, IV 15
const u=P(25,50);u.ivs={hp:15,atk:15,def:15,spa:15,spd:15,speed:15};T.statCalc(u);
const b=T.base[25].stats;
ok('HP fórmula Gen III',u.maxHp===Math.floor((2*b[0]+15)*50/100)+50+10,u.maxHp);
ok('Speed fórmula Gen III',u.speed===Math.floor((2*b[5]+15)*50/100)+5,u.speed);
// stats crecen con el nivel
const a5=P(25,5),a20=P(25,20);T.statCalc(a5);T.statCalc(a20);
ok('maxHp sube con nivel',a20.maxHp>a5.maxHp);
// tabla de tipos
ok('Agua>Fuego x2',T.chart.water.fire===2);ok('Eléctrico no afecta Tierra',T.chart.electric.ground===0);
// daño
const mvs=Object.entries(T.moveDB).filter(([k,m])=>m.power>0);
ok('hay movimientos de daño',mvs.length>10,mvs.length);
const att=P(25,30),def=P(74,30,'enemy');T.statCalc(att);T.statCalc(def);
const el=mvs.find(([k,m])=>m.type==='electric');
ok('Eléctrico vs Roca/Tierra = 0',el&&T.damage(att,def,el[1],false)===0,el&&T.damage(att,def,el[1],false));
const nm=mvs.find(([k,m])=>m.type==='normal');
const d1=T.damage(att,def,nm[1],false),dc=T.damage(att,def,nm[1],false,true);
ok('Crítico ≈ x2',dc>=d1*1.8&&dc<=d1*2.2,d1+'→'+dc);
const r=[];for(let i=0;i<200;i++)r.push(T.damage(att,def,nm[1],true));
ok('Variación aleatoria 85–100%',Math.min(...r)>=Math.floor(d1*.8)&&Math.max(...r)<=d1+1,Math.min(...r)+'-'+Math.max(...r));
ok('Daño mínimo 1 si hay efecto',d1>=1);
ok('Movimiento sin potencia → 0',T.damage(att,def,{power:0,type:'normal'})===0);
// Constricción / trampa
const trapKey=Object.keys(T.moveDB).find(k=>T.moveDB[k].effect==='trap');
ok('existe movimiento trap',!!trapKey,trapKey);
if(trapKey){const A=P(19,10),V=P(16,10,'enemy');V.x=5;V.y=5;A.x=4;A.y=5;T.units=[A,V];
 const msg=T.applyEffect(A,V,T.moveDB[trapKey]);ok('trap marca atrapado',V.trapped===true,msg);
 const reach=T.reachable(V);let n=0;for(const row of reach)for(const c of row)if(Number.isFinite(c))n++;
 ok('atrapado solo alcanza su casilla',n===1,n);
 ok('trap no se reaplica',T.applyEffect(A,V,T.moveDB[trapKey])==='');}
// subir de nivel
const L=P(25,5);T.statCalc(L);L.hp=L.maxHp;const hp0=L.maxHp;T.levelUp(L);
ok('levelUp +1 nivel',L.level===6);ok('levelUp sube maxHp',L.maxHp>=hp0,hp0+'→'+L.maxHp);
const H=P(25,100);T.levelUp(H);ok('nivel 100 es tope',H.level===100);
// captura
const w=P(16,3,'enemy');T.statCalc(w);w.hp=1;
const c0=T.calculateCapture(w,'pokeball',()=>0),c1=T.calculateCapture(w,'pokeball',()=>.999999);
ok('captura devuelve objeto',c0&&typeof c0==='object',JSON.stringify(c0).slice(0,80));
// polvos vs planta
const gr=P(1,10,'enemy'),fi=P(4,10,'enemy'),pw=T.moveDB.powdersleep,pp=T.moveDB.powderpoison;
ok('Somnífero no afecta a Planta',T.grassPowderImmune(pw,gr)===true);
ok('Polvo Veneno no afecta a Planta',T.grassPowderImmune(pp,gr)===true);
ok('Somnífero sí afecta a Fuego',T.grassPowderImmune(pw,fi)===false);
ok('Canto (no es polvo) sí afecta a Planta',T.grassPowderImmune(T.moveDB.sing,gr)===false);
const A2=P(1,10);T.units=[A2,gr];ok('applyEffect no duerme a Planta',T.applyEffect(A2,gr,pw).includes('Planta')&&!gr.asleep,gr.asleep);
// evoluciones nuevas
ok('Krabby→Kingler Nv28',T.evolutionRules[98].to===99&&T.evolutionRules[98].level===28);
ok('Psyduck→Golduck Nv33',T.evolutionRules[54].to===55&&T.evolutionRules[54].level===33);
ok('Slowpoke→Slowbro Nv37',T.evolutionRules[79].to===80&&T.evolutionRules[79].level===37);
for(const id of [99,55,80]){const q=P(id,40);T.statCalc(q);ok('especie '+id+' válida',q.maxHp>0&&T.base[id].name);}
// consistencia de etapas
{const bad=[];for(const id of T.STAGE_ORDER){const c=T.CAMPAIGN[id];if(!c){bad.push(id+':sin datos');continue}
 for(const e of [...(c.team||[]),...(c.wild||[])])if(!T.base[e.id])bad.push(id+':especie '+e.id);
 for(const e of (c.team||[]))for(const m of (e.moves||[]))if(!T.moveDB[m])bad.push(id+':mov '+m)}
 ok('todas las etapas tienen datos válidos',bad.length===0,bad.join(','));
 ok('Surge es la última etapa y es jefe',T.STAGE_ORDER[T.STAGE_ORDER.length-1]==='vermilion'&&T.CAMPAIGN.vermilion.mainKind==='boss');}
// Metapod/Kakuna deben poder atacar
for(const id of [11,14]){const mv=T.movesForLevel?T.movesForLevel(id,5):[];ok('especie '+id+' conoce un ataque',mv.some(k=>T.moveDB[k].power>0),mv.join(','))}
return R}
"""
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+F);await pg.wait_for_timeout(3000)
        res=await pg.evaluate(JS);await b.close()
    bad=0
    for n,o,d in res:
        print('OK ' if o else 'FALLA',n,d);bad+=not o
    if errs:print('errores JS',errs[:3]);bad+=1
    print(f'{len(res)-bad}/{len(res)} correctas');sys.exit(1 if bad else 0)
asyncio.run(m())
