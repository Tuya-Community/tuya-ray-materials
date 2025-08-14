// 提供给 cli 构建使用的文件，使用 cjs 语法

const path = require('path');

const _config = {
  plugins: [
    {
      configWebpack({ config }) {
        config.resolve.alias.set(
          '@ray-js/lamp-color-collection',
          path.resolve(__dirname, '../src/')
        );
      },
    },
  ],
};
module.exports = _config;
