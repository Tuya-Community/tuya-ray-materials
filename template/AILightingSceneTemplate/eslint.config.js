const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = tseslint.config(
  // 忽略的文件和目录
  {
    ignores: [
      'dist/**',
      'src/app.config.ts',
      'project.tuya.json',
      'commitlint.config.js',
      'ray.config.ts',
      'eslint.config.js',
    ],
  },
  // JavaScript 推荐规则
  js.configs.recommended,
  // TypeScript 推荐规则
  ...tseslint.configs.recommended,
  // 使用兼容层加载 prettier 配置
  ...compat.extends('prettier'),
  // 自定义规则
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      camelcase: 0,
      'no-console': 0,
      'react/no-array-index-key': 0,
      'import/no-unresolved': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'react/require-default-props': 0,
      'no-param-reassign': 0,
    },
  }
);
