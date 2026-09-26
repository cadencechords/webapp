// Cypress stays JavaScript (this file, cypress/e2e and cypress/support).
// Cypress 10 compiles a TypeScript config with ts-node and TypeScript specs
// with ts-loader, both through the project's `typescript` package. That is
// TypeScript 7, whose package has no JavaScript compiler API (it exports only
// `version`), so a .ts config or spec would fail to load.
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: Cypress.env('BASE_URL'),
  },
});
