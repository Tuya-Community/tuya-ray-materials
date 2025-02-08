// 提供给 cli 构建使用的文件，使用 cjs 语法

const path = require('path');

const config = {
  plugins: [
    {
      configWebpack({ config }) {
        const dist =
          process.env.NODE_ENV === 'development'
            ? path.resolve(__dirname, './src/lib/')
            : path.resolve(__dirname, '../lib/');

        config.resolve.alias.set('@ray-js/lamp-bead-strip', dist);
      },
    },
  ],
};

module.exports = config;
