// Writes src/styles/color-tokens.css. Run with `yarn tokens:color`.
// (Runs through vite-node: @material/material-color-utilities 0.4.0 has
// extensionless ESM imports that plain Node rejects.)
import { writeFileSync } from 'node:fs';
import { renderCss } from './color-tokens.mts';

writeFileSync(
  new URL('../src/styles/color-tokens.css', import.meta.url),
  renderCss()
);
console.log('Wrote src/styles/color-tokens.css');
