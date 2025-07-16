// 提供给 cli 构建使用的文件，使用 cjs 语法

import path from 'path';

const config = {
  plugins: [
    {
      configWebpack({ config }) {
        config.resolve.alias.set('@ray-js/circle-progress', path.resolve(__dirname, '../src'));
      },
    },
  ],
};

module.exports = config;
