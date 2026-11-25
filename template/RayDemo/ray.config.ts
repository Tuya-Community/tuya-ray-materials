import type { RaypackConfig } from '@ray-js/types-next';
import { resolve } from 'node:path';

export default {
  resolveAlias: {
    '@/components': resolve(__dirname, 'src/components'),
    react: resolve(__dirname, 'node_modules/react'),
  },
} satisfies RaypackConfig;
