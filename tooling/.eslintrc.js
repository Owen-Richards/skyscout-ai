module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'dist/',
    'node_modules/',
    'apps/**/*',
    'patterns/**/*',
  ],
  rules: {
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
