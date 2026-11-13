#!/bin/bash
# Sube la versión, verifica y genera la entrega dev (DEVU=true); con "normal" genera la normal (DEVU=false) en /home/claude/work. Uso: ./entregar.sh
set -e; cd "$(dirname "$0")"
n=$(($(tr -d 'v\n' < ver.txt)+1)); echo "v$n" > ver.txt
./check.sh
node build.mjs --dev dist/dev.html >/dev/null
# Por ahora solo se genera la versión dev (DEVU=true). Para la normal (subir a GitHub): ./entregar.sh normal
if [ "$1" = "normal" ]; then out=/home/claude/work/pokemon_tactics_25d_v${n}_normal.html; node build.mjs "$out" >/dev/null
else out=/home/claude/work/pokemon_tactics_25d_v${n}_dev.html; node build.mjs --dev "$out" >/dev/null; fi
echo "ENTREGA: $out"
