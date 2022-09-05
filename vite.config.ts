import { resolve } from 'path';
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import replace from '@rollup/plugin-replace';

console.log('NODE_ENV', process.env.NODE_ENV)

const rollupPlugins = [
  replace({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  })
];

if (process.env.ANALYZE_BUNDLE) {
  rollupPlugins.push(visualizer());
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Sui',
      fileName: 'sui'
    },
    rollupOptions: {
      plugins: rollupPlugins
    }
  }
})