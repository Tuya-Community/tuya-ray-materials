import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  minify: true,
  dts: true,
  clean: true,
  target: 'es5',
});
