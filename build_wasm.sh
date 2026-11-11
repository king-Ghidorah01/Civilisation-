#!/bin/bash
source /app/emsdk/emsdk_env.sh
mkdir -p build_wasm
cd build_wasm
emcmake cmake ..
make
# Copy the compiled Wasm and JS to the public folder where Vite can serve them
mkdir -p ../public/wasm
cp industry_sim.js industry_sim.wasm ../public/wasm/
