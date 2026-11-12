#!/bin/bash
# Sube la versión, verifica y genera la entrega normal (DEVU=false) en ../... Uso: ./entregar.sh
set -e; cd "$(dirname "$0")"
n=$(($(tr -d 'v\n' < ver.txt)+1)); echo "v$n" > ver.txt
./check.sh
node build.mjs --dev dist/dev.html >/dev/null
out=../../pokemon_tactics_25d_v${n}_normal.html
node build.mjs "$out" >/dev/null
echo "ENTREGA: $out"
