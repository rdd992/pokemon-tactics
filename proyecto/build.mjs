// Ensambla src/ en un único HTML. Uso: node build.mjs [--dev] [salida]
import fs from 'fs';import path from 'path';
const R=path.dirname(new URL(import.meta.url).pathname);
const a=process.argv.slice(2),dev=a.includes('--dev')||a.includes('--test'),test=a.includes('--test'),out=a.find(x=>!x.startsWith('--'))||path.join(R,'dist/pokemon_tactics.html');
const man=JSON.parse(fs.readFileSync(R+'/manifest.json','utf8'));
const cat=l=>l.map(f=>fs.readFileSync(R+'/src/'+f,'utf8')).join('');
let h=fs.readFileSync(R+'/src/index.template.html','utf8');
h=h.split('{{CSS}}').join(cat(man.css)).split('{{VENDOR}}').join(cat(man.vendor)).split('{{GAME}}').join(cat(man.game));
h=h.split('__VER__').join(fs.readFileSync(R+'/ver.txt','utf8').trim());
if(test){ // gancho de pruebas: expone internos del IIFE (nunca en la entrega)
  const hook=fs.readFileSync(R+'/tests/hook.js','utf8'),k='\nrequestAnimationFrame(draw);loadPokeAPI();\n})();';
  if(!h.includes(k))throw new Error('no encuentro el cierre del IIFE');h=h.replace(k,'\n'+hook+k);}
if(!dev)h=h.replace('const DEVU=true;','const DEVU=false;');
fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,h);console.log(out,h.length);
