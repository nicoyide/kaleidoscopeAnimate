// vite.config.ts
import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
var vite_config_default = defineConfig({
  plugins: [wasmPack("./pkg/")],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};