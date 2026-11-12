# Humo: carga dist/pokemon_tactics.html y falla si hay errores de JS.  Uso: python3 tests/smoke.py
import asyncio,sys,os
from playwright.async_api import async_playwright
f=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else 'dist/pokemon_tactics.html')
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg=await b.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+f);await pg.wait_for_timeout(4000)
        ok=await pg.evaluate("!!document.getElementById('map')")
        await b.close()
        if errs or not ok: print('FALLO',ok,errs[:5]);sys.exit(1)
        print('OK smoke')
asyncio.run(m())
