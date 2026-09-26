// ESLint 9 flat config: roughly what CRA's `react-app` config used to check,
// with every rule as an error. Existing violations are recorded in
// eslint-suppressions.json (ESLint bulk suppressions), so CI fails only on new
// ones. After fixing some, run `yarn lint:prune` to shrink the file.
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import Module, { createRequire } from 'node:module';

// typescript-eslint parses with the TypeScript compiler's JavaScript API.
// TypeScript 7 (the `typescript` package, used by `yarn typecheck`) is a
// native Go binary without that API. @typescript/typescript6 re-exports the
// TypeScript 6 API, so `require('typescript')` from typescript-eslint and
// ts-api-utils loads that instead; anything else still gets TypeScript 7.
// Only the bare `typescript` import is redirected, so type-aware linting
// (`projectService`, which needs `typescript/lib/tsserverlibrary`) isn't
// supported. This has to run before typescript-eslint is loaded, hence the
// require() below.
const USES_TS_API =
  /[\\/]node_modules[\\/](@typescript-eslint|typescript-eslint|ts-api-utils)[\\/]/;
type ResolveFilename = (
  this: unknown,
  request: string,
  parent: { filename?: string | null } | undefined,
  ...rest: unknown[]
) => string;
// _resolveFilename is Node's internal CommonJS resolver: every require() goes
// through it, but it isn't public API, so @types/node doesn't declare it.
const CjsModule = Module as typeof Module & {
  _resolveFilename: ResolveFilename;
};
const resolveFilename = CjsModule._resolveFilename;
CjsModule._resolveFilename = function (request, parent, ...rest) {
  const redirect =
    request === 'typescript' && USES_TS_API.test(parent?.filename ?? '');
  return resolveFilename.call(
    this,
    redirect ? '@typescript/typescript6' : request,
    parent,
    ...rest
  );
};
// ESLint loads a TypeScript config through jiti, and jiti would load an
// import()ed typescript-eslint itself, bypassing the redirect. Node's own
// require() goes through it.
const require = createRequire(import.meta.url);
const tseslint: typeof import('typescript-eslint').default =
  require('typescript-eslint').default;

export default [
  {
    ignores: [
      'build/',
      'node_modules/',
      'e2e/.results/',
      'e2e/screenshots/',
      'cypress/',
      'public/',
      '.claude/worktrees/',
    ],
  },
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
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...tseslint.configs.eslintRecommended.rules,
      // typescript-eslint's recommended rules that don't need type information.
      // typescript-eslint ships this config; if a release renamed it, this
      // throws (as it did in JavaScript) rather than silently dropping the rules.
      ...tseslint.configs.recommended.find(
        config => config.name === 'typescript-eslint/recommended'
      )!.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // TypeScript checks these (undefined names, redeclared overloads).
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'none', ignoreRestSiblings: true },
      ],
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: ['**/*.test.{js,ts,tsx}', 'src/setupTests.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },
  {
    files: ['scripts/**', 'e2e/**', '.claude/**', '*.config.{js,mjs,ts,mts}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: { globals: { Cypress: 'readonly' } },
  },
];
