module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'parser': 'typescript-eslint-parser',
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true,
    },
    'sourceType': 'module',
  },
  'plugins': [
    'typescript',
  ],
  'extends': [
    '@team-griffin/eslint-config/frontend-config/core',
    '@team-griffin/eslint-config/frontend-config/jsx-a11y',
    '@team-griffin/eslint-config/frontend-config/react',
  ],
  'settings': {
    'import/ignore': [
      'svg\'$',
    ],
  },
  'rules': {
    'jsx-jcs-no-undef': 0,
    'react/jsx-no-undef': [2, { 'allowGlobals': true }],
    'no-unused-vars': 'off',
    'typescript/no-unused-vars': 'error',
  },
};