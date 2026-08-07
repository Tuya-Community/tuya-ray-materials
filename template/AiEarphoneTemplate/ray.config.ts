// 提供给 cli 构建使用的文件，使用 cjs 语法
import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rayPluginAppSmartUi = require('./scripts/ray-plugin-app-smart-ui');

const config = {
  resolveAlias: {},
  importTransformer: [SmartUIAutoImport],
  plugins: [rayPluginAppSmartUi()],
};
module.exports = config;
