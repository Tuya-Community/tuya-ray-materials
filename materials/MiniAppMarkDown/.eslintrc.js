module.exports = {
  extends: ['tuya-panel'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    'import/no-unresolved': [2, { caseSensitiveStrict: true }],
    'no-unused-vars': 0,
    'prefer-destructuring': 0,
    'no-cond-assign': 0,
    'no-param-reassign': 0,
  },
};
