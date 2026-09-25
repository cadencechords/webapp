// ESLint 9 flat config: roughly what CRA's `react-app` config used to check,
// with every rule as an error. Existing violations are recorded in
// eslint-suppressions.json (ESLint bulk suppressions), so CI fails only on new
// ones. After fixing some, run `yarn lint:prune` to shrink the file.
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['build/', 'node_modules/', 'e2e/.results/', 'e2e/screenshots/', 'cypress/', 'public/'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.test.js', 'src/setupTests.js'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },
  {
    files: ['scripts/**', 'e2e/**', '.claude/**', '*.config.{js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: { globals: { Cypress: 'readonly' } },
  },
];
