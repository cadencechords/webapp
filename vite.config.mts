import { defineConfig, transformWithEsbuild } from 'vite';
import type { ESBuildOptions, Plugin, Rollup, UserConfig } from 'vite';
import type { InlineConfig as VitestConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// Older source is plain .js files containing JSX (a CRA convention). The
// `esbuild` option below compiles those with a fixed `jsx` loader, so Vite's
// esbuild step skips TypeScript.
const jsxInJs = /src\/.*\.js$/;

// Compiles .ts/.tsx with the same esbuild options as the legacy .js files,
// but with the loader their extension implies. Once no .js is left in src,
// delete this and the `esbuild` option and let Vite handle TypeScript itself.
function typescript(): Plugin {
  let options: ESBuildOptions;
  return {
    name: 'typescript',
    configResolved(config) {
      // Never false: the config below sets the `esbuild` option.
      const { include, exclude, loader, jsxInject, ...rest } =
        config.esbuild as ESBuildOptions;
      options = {
        target: 'esnext',
        charset: 'utf8',
        ...rest,
        supported: {
          'dynamic-import': true,
          'import-meta': true,
          ...rest.supported,
        },
      };
    },
    async transform(code, id) {
      if (!/\.(m?ts|tsx)$/.test(id.split('?')[0])) return;
      const { code: js, map } = await transformWithEsbuild(code, id, options);
      // Rollup's SourceMap types sourcesContent entries as string | null, its
      // map input type as string only. It accepts its own maps either way.
      return { code: js, map: map as Rollup.ExistingRawSourceMap };
    },
  };
}

// Vitest's `test` option augments its own copy of Vite's types (it depends on
// a different Vite version), not this one, so it's typed here.
const config: UserConfig & { test: VitestConfig } = {
  // Keep CRA's variable names: REACT_APP_* from the environment (Netlify) or
  // .env files are exposed as import.meta.env.REACT_APP_*.
  envPrefix: 'REACT_APP_',
  plugins: [
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
    typescript(),
    tailwindcss(),
    // `import X from './icon.svg?react'` -> React component. Material Symbols
    // SVGs have no fill or size: color follows currentColor, size follows CSS.
    svgr({
      svgrOptions: { dimensions: false, svgProps: { fill: 'currentColor' } },
    }),
    // @react-pdf/renderer needs these Node built-ins, which webpack 4 (CRA) polyfilled automatically.
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'util', 'events', 'zlib'],
      globals: { Buffer: true, process: true, global: true },
    }),
  ],
  resolve: {
    alias: [
      // The ES build does `export * from '@react-pdf/primitives'`, a CommonJS
      // module, so Text/View/etc. get lost. The CJS browser build exports them.
      {
        find: /^@react-pdf\/renderer$/,
        replacement: '@react-pdf/renderer/lib/react-pdf.browser.cjs.js',
      },
    ],
  },
  esbuild: { loader: 'jsx', include: jsxInJs, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  // Test runs write files (traces, screenshots) that would otherwise trigger full reloads.
  server: {
    port: 3000,
    host: true,
    watch: { ignored: ['**/e2e/**', '**/cypress/**', '**/build/**'] },
  },
  preview: { port: 3000 },
  // Netlify publishes build/, as it did with CRA. Sentry fetches the public
  // sourcemaps to make stack traces readable.
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        // One chunk per npm package. Generating the sourcemap for a single ~4 MB
        // main chunk pushed the build past Node's default heap on Netlify.
        manualChunks(id) {
          // Vite's lazy-import helper would otherwise land in whichever vendor
          // chunk uses it first (stream-chat-react), and every lazy() page
          // would pull that chunk in to get it.
          if (id.includes('vite/preload-helper')) return 'vite-preload';
          const path = id.split('node_modules/')[1];
          if (!path) return;
          const [scope, name] = path.split('/');
          const pkg = scope.startsWith('@')
            ? `${scope.slice(1)}-${name}`
            : scope;
          return `vendor-${pkg}`;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.test.{js,ts,tsx}'],
    // Its 0.4.0 ESM build has extensionless imports that Node can't load directly.
    server: { deps: { inline: ['@material/material-color-utilities'] } },
  },
};

export default defineConfig(config);
