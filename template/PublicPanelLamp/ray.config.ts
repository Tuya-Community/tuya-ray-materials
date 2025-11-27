import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

const config = {
  resolveAlias: {
    lodash: 'lodash-es',
    moment: 'dayjs',
  },
  importTransformer: [SmartUIAutoImport],
};

export default config;
