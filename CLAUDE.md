# Cadence web app

React 17 + Vite, Tailwind v4, Vitest. See `README.md`, `docs/design-tokens.md`
and `docs/icons.md`.

## TypeScript only

Write new files as `.ts`/`.tsx`, never `.js`/`.jsx`/`.mjs`/`.cjs`. The
JavaScript that's left is being converted (Linear project "Web app: convert to
TypeScript"). Converting a file means renaming it to `.ts`/`.tsx` with
`git mv` and typing it. Only `public/` (served as-is) is exempt.

Type checking uses TypeScript 7 (`typescript`, the native Go compiler).
`tsconfig.json` covers `src`, JavaScript included (`checkJs`), and isn't
`strict`. `tsconfig.strict.json` checks the TypeScript files in `src` again
with `strict` (the JavaScript gets it as it's converted), so new files must
pass `strict`. `tsconfig.node.json` covers all other
TypeScript (`scripts/`, `e2e/`, `cypress/`, `.claude/`, `.github/`, config files) and is
`strict`. Write ES modules there as `.mts` (package.json
has no `"type": "module"`, so a `.ts` file counts as CommonJS). Node strips types without checking them, so
`yarn typecheck` is what catches errors there. No project has a baseline:
any type error fails `yarn typecheck`.

ESLint parses TypeScript with the TypeScript 6 API from
`@typescript/typescript6`, because TypeScript 7 has no JavaScript API (see
`eslint.config.mts`). So `yarn install` warns that typescript-eslint wants
`typescript@<6.1.0`. That's expected: don't downgrade `typescript` to silence
it. TypeScript files get typescript-eslint's recommended rules (the ones that
don't need type information), such as `no-explicit-any`.

## Checks (same as CI)

```bash
yarn typecheck      # TypeScript over src and the Node-side TS; any error fails
yarn lint           # ESLint; existing violations are in eslint-suppressions.json
yarn format:check   # Prettier
yarn test:unit      # unit tests (Vitest)
yarn test:hooks     # tests for the PR review gate (.claude/hooks)
yarn build
```

Fix type errors instead of hiding them with `@ts-ignore`, `@ts-expect-error`
or `any`. Don't add ESLint suppressions either: `eslint-suppressions.json` is
only for recording fixes (the counts going down, with `yarn lint:prune`).

## Pull requests

**Every PR needs an adversarial review first.** Follow
`.claude/skills/adversarial-review/SKILL.md`: independent reviewer agents
attack the diff, a skeptic pass verifies each finding, confirmed problems get
fixed, and a passing review is recorded for the exact commit. The
`require-adversarial-review` hook (`.claude/settings.json`) blocks
`create_pull_request` and `gh pr create` until that record exists. It's a
guardrail, and the review's findings are self-reported. See the end of the
skill for exactly what it does and doesn't guarantee.

Branches follow Linear's suggested branch names. Redesign PRs are stacked on
the branch of the previous issue.
