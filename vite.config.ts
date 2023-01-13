import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { undestructurePlugin } from 'babel-plugin-solid-undestructure';

export default defineConfig({
  plugins: [solidPlugin(), ...undestructurePlugin('ts')],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false
  }
});
