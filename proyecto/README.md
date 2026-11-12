# Pokémon Tactics 2.5D — proyecto modular
- `node build.mjs [--dev]` → `dist/pokemon_tactics.html` (un solo archivo; sin `--dev` pone DEVU=false).
- `node build.mjs --test dist/test.html` → build con gancho `window.__T` (tests/hook.js); nunca se entrega.
- `./check.sh` → build + prueba de humo + pruebas de lógica (tests/).
- `src/game/NN-tema.js` se concatena en el orden de `manifest.json`; `src/data/` = bloques grandes de datos.
- Estado: reproduce byte a byte el v626. Siguiente: datos a JSON, sprites con carga diferida, versionado de guardado.

## Flujo de trabajo (desde v626 este proyecto es la fuente de verdad)
1. Editar archivos en `src/`. 2. `./entregar.sh` (sube versión, corre pruebas, genera `/home/claude/work/pokemon_tactics_25d_vNNN_normal.html`). 3. Enviar el archivo.
`build.py` y `g3/` quedan solo como historial; no se usan más.
