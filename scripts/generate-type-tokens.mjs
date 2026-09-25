// Writes src/styles/type-tokens.css. Run with `yarn tokens:type`.
import { writeFileSync } from 'node:fs';
import { renderCss } from './type-tokens.mjs';

writeFileSync(
  new URL('../src/styles/type-tokens.css', import.meta.url),
  renderCss()
);
console.log('Wrote src/styles/type-tokens.css');
