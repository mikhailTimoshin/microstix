import { defineConfig } from 'tsup';

export default defineConfig([
  // Основная сборка библиотеки Microstix
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    globalName: 'Microstix',
    outDir: 'dist',
  },
  // Отдельная сборка плагина Vite
  {
    entry: ['src/vite-plugin.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    minify: true,
    outDir: 'dist',
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.mjs',
    }),

  },
  {
    entry: ['src/jsx-runtime.ts'],
    format: ['esm', 'cjs'],
    dts: false,
    sourcemap: true,
    clean: false,
    minify: true,
    outDir: 'dist',
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.mjs',
    }),
  },
]);