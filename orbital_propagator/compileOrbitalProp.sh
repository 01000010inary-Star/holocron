#!/bin/bash

set -e

# install wasm-ack
if ! [ -x "$(command -v wasm-pack)" ]; then
    echo "wasm-pack not found -> installing"
    cargo install wasm-pack
fi

echo "compiling orbital propagator to wasm"

wasm-pack build --target bundler

mkdir -p "../public/orbital_prop"
mv "pkg/orbital_propagator.d.ts" "../public/orbital_prop/orbital_propagator.d.ts"
mv "pkg/orbital_propagator.js" "../public/orbital_prop/orbital_propagator.js"
mv "pkg/orbital_propagator_bg.js" "../public/orbital_prop/orbital_propagator_bg.js"
mv "pkg/orbital_propagator_bg.wasm" "../public/orbital_prop/orbital_propagator_bg.wasm"
mv "pkg/orbital_propagator_bg.wasm.d.ts" "../public/orbital_prop/orbital_propagator_bg.wasm.d.ts"
