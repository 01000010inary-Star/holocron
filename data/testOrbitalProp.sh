#!/bin/bash

set -e

RUST_DIR="./orbital_propagator/"
BUILD_OUT_DIR="$RUST_DIR/pkg"
WASM="$BUILD_OUT_DIR/*.wasm"

# install wasm-ack
if ! [ -x "$(command -v wasm-pack)" ]; then
    echo "wasm-pack not found -> installing"
    cargo install wasm-pack
fi

echo "compiling orbital propagator to wasm"
cd "$RUST_DIR"

wasm-pack build --target nodejs
cd - > /dev/null

# Test the export works in Node
echo "Running exports"
node ./data/testOrbitalProp.mjs
echo "WASM exports ran successfully"

# Delete bins & wasm-pack js glue code
echo "Cleaning up"
rm -rf "$BUILD_OUT_DIR"

