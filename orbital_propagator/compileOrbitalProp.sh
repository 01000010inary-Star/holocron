#!/bin/bash

set -e

# install wasm-ack
if ! [ -x "$(command -v wasm-pack)" ]; then
    echo "wasm-pack not found -> installing"
    cargo install wasm-pack
fi

echo "compiling orbital propagator to wasm"

wasm-pack build --target bundler

mkdir -p "../src/wasm"
mv "pkg/orbital_propagator.d.ts" "../src/wasm/orbital_propagator.d.ts"
mv "pkg/orbital_propagator.js" "../src/wasm/orbital_propagator.js"
mv "pkg/orbital_propagator_bg.js" "../src/wasm/orbital_propagator_bg.js"
mv "pkg/orbital_propagator_bg.wasm" "../src/wasm/orbital_propagator_bg.wasm"
mv "pkg/orbital_propagator_bg.wasm.d.ts" "../src/wasm/orbital_propagator_bg.wasm.d.ts"
