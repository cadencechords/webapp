# Cadence web app

React 17 + Vite, Tailwind v4, Vitest. See `README.md`, `docs/design-tokens.md`
and `docs/icons.md`.

## TypeScript only

Write files as `.ts`/`.tsx`, never `.js`/`.jsx`/`.mjs`/`.cjs`. `src` has no
JavaScript. `tsconfig.json` has `allowJs` off, so importing a `.js` file from
TypeScript fails `yarn typecheck`, but nothing catches a `.js` file that isn't
imported (Vitest doesn't run `.js` tests): keep it that way by hand. Only `public/` (served as-is)
is exempt, and Cypress (`cypress.config.js`, `cypress/`): Cypress 10 compiles
TypeScript through the `typescript` package, which has no compiler API in
TypeScript 7, so a `.ts` config or spec wouldn't load.

Type checking uses TypeScript 7 (`typescript`, the native Go compiler).
`tsconfig.json` covers `src` and is `strict`. `tsconfig.node.json` covers the other
TypeScript (`scripts/`, `e2e/`, `cypress/`, `.claude/`, `.github/`, config files) and is
`strict`. Its `**` globs skip dot-directories, so TypeScript in a new one isn't
checked until it's added to that file's `include`. Write ES modules there as `.mts` (package.json
has no `"type": "module"`, so a `.ts` file counts as CommonJS). Node strips types without checking them, so
`yarn typecheck` is what catches errors there. No project has a baseline:
any type error fails `yarn typecheck`.

Linting is oxlint (`.oxlintrc.json`): every `correctness` rule as an error,
plus the rules the old ESLint config enforced, such as `no-explicit-any` and
the React hooks rules. oxlint is a native binary with its own parser, so it
doesn't depend on the `typescript` package. `yarn lint` also fails on
warnings and on disable comments that no longer suppress anything.

Formatting is oxfmt (`.oxfmtrc.json`, carried over from the old Prettier
config). It formats every file type in the repo that Prettier did (TS/JS, JSON,
CSS, Markdown, YAML, HTML), plus TOML, so Prettier is gone entirely. Files it
shouldn't touch go in `ignorePatterns` in `.oxfmtrc.json`; it also skips
anything in `.gitignore`. `yarn format` rewrites files in place.

## Checks (same as CI)

```bash
yarn typecheck      # TypeScript over src and the Node-side TS; any error fails
yarn lint           # oxlint
yarn format:check   # oxfmt
yarn test:unit      # unit tests (Vitest)
yarn test:hooks     # tests for the PR review gate (.claude/hooks)
yarn build
```

Fix type errors instead of hiding them with `@ts-ignore`, `@ts-expect-error`
or `any`. Fix lint errors too, instead of adding `oxlint-disable` comments or
turning rules off in `.oxlintrc.json`.

## Pull requests

**Every PR needs an adversarial review first.** Follow
`.claude/skills/adversarial-review/SKILL.md`: two independent reviewer agents
(never more) attack the diff, a skeptic pass verifies each finding, confirmed
problems get fixed, and a passing review is recorded for the exact commit. The
`require-adversarial-review` hook (`.claude/settings.json`) blocks
`create_pull_request` and `gh pr create` until that record exists. It's a
guardrail, and the review's findings are self-reported. See the end of the
skill for exactly what it does and doesn't guarantee.

Skip the review only when the user asks for that PR in chat: record a bypass
with their reason (`record.mts bypass`, see the skill) and say so in the PR.

Branches follow Linear's suggested branch names. Redesign PRs are stacked on
the branch of the previous issue.
