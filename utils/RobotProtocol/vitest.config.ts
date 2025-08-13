import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['./src/**/*.test.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    deps: {
      interopDefault: true,
    },
    coverage: {
      provider: 'istanbul',
      exclude: ['*.js'],
    },
  },
});
