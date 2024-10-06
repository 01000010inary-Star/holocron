import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/holocron",
    plugins: [
        react(),
        wasm(),
        topLevelAwait({
            promiseExportName: "__tla",
            promiseImportName: (i) => `__tla_${i}`,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
