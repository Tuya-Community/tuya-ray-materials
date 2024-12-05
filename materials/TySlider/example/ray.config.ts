// 提供给 cli 构建使用的文件，使用 cjs 语法

const path = require('path');

const config = {
  resolveAlias: {
    '@ray-js/components-ty-slider': path.join(__dirname, '../src/'),
  },
};
module.exports = config;
