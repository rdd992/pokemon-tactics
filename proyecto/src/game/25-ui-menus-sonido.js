// Sistema de presentación v0.21. Las reglas tácticas permanecen en el motor existente.
let titleScreen='home',selectedStarter=null,soundEnabled=true,audioCtx=null;
try{soundEnabled=localStorage.getItem('pokemon-tactics-sound')!=='off'}catch(e){}
function playSfx(kind='select'){
 if(!soundEnabled)return;
 try{
   const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
   if(!audioCtx)audioCtx=new Ctx();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
   let now=audioCtx.currentTime;
   const note=(freq,time,dur,wave='square',volume=.045)=>{
     const out=audioCtx.createGain();out.gain.value=1;out.connect(audioCtx.destination);chipTone(audioCtx,out,now,freq,freq,time,dur,wave==='square'?'pulse25':wave,volume*1.1)
   };
   if(kind==='select'){note(523,0,.07,'square',.025);note(783,.075,.10,'square',.025)}
   else if(kind==='move'){note(415,0,.035,'square',.014)}
   else if(kind==='cancel'){note(330,0,.08);note(262,.07,.11)}
   else if(kind==='shiny'){[1568,1976,2349,2637,3136,3951].forEach((f,i)=>note(f,i*.075,.16,'sine',.05));note(3951,.5,.22,'sine',.035);note(4699,.58,.28,'sine',.03);note(3136,.66,.3,'sine',.02)}
   else if(kind==='attack'){note(196,0,.08,'sawtooth',.052);note(132,.08,.12,'square',.045)}
   else if(kind==='critical'){note(440,0,.09,'sawtooth',.06);note(660,.09,.1,'sawtooth',.06);note(880,.18,.18,'square',.06)}
   else if(kind==='status'){note(620,0,.09,'sine',.035);note(460,.10,.17,'sine',.03)}
   else if(kind==='capture'){[392,494,587,784].forEach((n,i)=>note(n,i*.10,.19,'triangle',.055))}
   else if(kind==='error'){note(280,0,.12,'square',.034);note(240,.12,.15,'square',.03)}
   else if(kind==='win'){[392,523,659,784,1046].forEach((n,i)=>note(n,i*.095,.25,'triangle',.055))}
 }catch(e){}
}
// Cualquier clic de menú produce respuesta sonora, sin archivos externos.
document.addEventListener('pointerdown',e=>{if(e.target.closest('button'))playSfx('select')},{capture:true});
function menuScreen(name){
 titleScreen=name;$('titleOverlay').dataset.screen=name;
 $('titleHome').hidden=name!=='home';$('titleStarter').hidden=name!=='starter';$('titleOptionsPanel').hidden=name!=='options';$('titleCreditsPanel').hidden=name!=='credits';
 $('titleNotice').textContent='';
 if(name==='home'){
   $('titleContinue').disabled=!readSave();
   $('titleReturn').hidden=phase==='intro';try{heroRefresh()}catch(e){console.error(e)}
 }
 if(name==='options'){$('titlePmdToggle').textContent=pmdOn?'SPRITECOLLAB (PMD)':'ORIGINALES';$('titleSoundToggle').textContent=soundEnabled?'ACTIVADOS':'DESACTIVADOS';$('titleAnimToggle').textContent=animationEnabled?'ACTIVADAS':'DESACTIVADAS';$('titleFpsToggle').textContent=window.__fps&&window.__fps.get()?'VISIBLE':'OCULTO';$('titleSmoothToggle').textContent=({off:'PIXEL PURO',sharp:'SUAVE (NÍTIDO)',epx:'SUAVE (SCALE2X)'})[window.__getPmdSmooth()];$('titleStyleToggle').textContent=styleLabel()}
}
