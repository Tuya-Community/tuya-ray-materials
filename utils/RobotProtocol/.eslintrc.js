module.exports = {
  extends: ['tuya-panel'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-console': 0,
    'no-bitwise': 0,
  },
  ignorePatterns: ['docs/*'],
};
