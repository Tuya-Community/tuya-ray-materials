import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';
// 提供给 cli 构建使用的文件，使用 cjs 语法
const config = {
  resolveAlias: {},
  importTransformer: [SmartUIAutoImport],
};
module.exports = config;
