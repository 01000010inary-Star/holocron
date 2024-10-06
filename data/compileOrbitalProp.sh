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

wasm-pack build --target bundler
cd - > /dev/null

