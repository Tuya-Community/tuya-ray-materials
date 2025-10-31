import { RayConfig } from '@ray-js/types';
import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

const config: RayConfig = {
  resolveAlias: {
    lodash: 'lodash-es',
  },
  importTransformer: [SmartUIAutoImport],
};
module.exports = config;
