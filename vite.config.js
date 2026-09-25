import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// The source is plain .js files containing JSX (a CRA convention).
const jsxInJs = /src\/.*\.js$/;

export default defineConfig({
  // Keep CRA's variable names: REACT_APP_* from the environment (Netlify) or
  // .env files are exposed as import.meta.env.REACT_APP_*.
  envPrefix: 'REACT_APP_',
  plugins: [
    react({ include: /\.(js|jsx)$/ }),
    tailwindcss(),
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
      { find: /^@react-pdf\/renderer$/, replacement: '@react-pdf/renderer/lib/react-pdf.browser.cjs.js' },
    ],
  },
  esbuild: { loader: 'jsx', include: jsxInJs, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },
  // Test runs write files (traces, screenshots) that would otherwise trigger full reloads.
  server: { port: 3000, host: true, watch: { ignored: ['**/e2e/**', '**/cypress/**', '**/build/**'] } },
  preview: { port: 3000 },
  // Netlify publishes build/, as it did with CRA.
  build: { outDir: 'build', sourcemap: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.test.js'],
    // Its 0.4.0 ESM build has extensionless imports that Node can't load directly.
    server: { deps: { inline: ['@material/material-color-utilities'] } },
  },
});
