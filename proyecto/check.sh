#!/bin/bash
# Verificación completa: build normal, build de pruebas, humo y lógica.
set -e; cd "$(dirname "$0")"
node build.mjs && node build.mjs --test dist/test.html >/dev/null
python3 tests/smoke.py && python3 tests/logic.py
