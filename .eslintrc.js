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
    'max-len': ['warn', { code: 120, ignoreUrls: true }],
    'prettier/prettier': ['warn', { printWidth: 120 }],
    'no-shadow': 'off',
    quotes: ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/quotes': ['warn', 'single', { avoidEscape: true }],
  },
};
