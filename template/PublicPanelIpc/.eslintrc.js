module.exports = {
  extends: ['tuya-panel'],
  rules: {
    camelcase: 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
  },
  overrides: [
    {
      files: ['src/res/iconfont/iconfont.js'],
      rules: {},
    },
  ],
};
