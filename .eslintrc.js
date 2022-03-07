module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': ['error', { code: 150, ignoreUrls: true }],
    'prettier/prettier': ['error', { printWidth: 150 }],
    'no-shadow': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
  },
};
