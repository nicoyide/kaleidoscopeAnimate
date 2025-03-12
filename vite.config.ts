import { defineConfig } from 'vite';
import wasmPack from 'vite-plugin-wasm-pack';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasmPack('./src')],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
