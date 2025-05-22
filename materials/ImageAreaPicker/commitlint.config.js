module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'style',
        'test',
        'revert',
        'chore',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 100],
  },
};
