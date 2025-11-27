import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

const path = require('path');

const config = {
  resolveAlias: {},
  importTransformer: [SmartUIAutoImport],
};

module.exports = config;
