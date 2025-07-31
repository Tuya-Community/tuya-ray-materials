/*
 * @Author: mjh
 * @Date: 2025-06-06 17:32:22
 * @LastEditors: mjh
 * @LastEditTime: 2025-06-25 15:19:28
 * @Description:
 */
// 提供给 cli 构建使用的文件，使用 cjs 语法

const path = require('path');

const config = {
  resolveAlias: {
    '@ray-js/lamp-rhythm-circle': path.resolve(__dirname, '../src/'),
  },
};

module.exports = config;
