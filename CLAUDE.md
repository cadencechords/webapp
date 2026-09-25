# Cadence web app

React 17 + Vite, Tailwind v4, Vitest. See `README.md`, `docs/design-tokens.md`
and `docs/icons.md`.

## TypeScript only

Write new files as `.ts`/`.tsx`, never `.js`/`.jsx`/`.mjs`/`.cjs`. The
JavaScript files that already exist are listed in `js-allowlist.json` and get
converted over time; `yarn ts-only` fails on any file not in that list.
Converting a file means renaming it to `.ts`/`.tsx`, typing it, and running
`yarn ts-only --update`. Renaming or moving a `.js` file counts as a new file.
Only `public/` (served as-is) is exempt.

Type checking uses TypeScript 7 (`typescript`, the native Go compiler).
ESLint parses TypeScript with the TypeScript 6 API from
`@typescript/typescript6`, because TypeScript 7 has no JavaScript API (see
`eslint.config.mjs`).

## Checks (same as CI)

```bash
yarn typecheck      # TypeScript over the JS; fails only on errors beyond typecheck-baseline.json
yarn ts-only        # no new JavaScript files; the existing ones are in js-allowlist.json
yarn lint           # ESLint; existing violations are in eslint-suppressions.json
yarn format:check   # Prettier
yarn test:unit      # unit tests (Vitest)
yarn test:hooks     # tests for the PR review gate (.claude/hooks)
yarn build
```

Don't hide new problems with `yarn typecheck --update` or new ESLint
suppressions. Those are only for recording fixes (the counts going down).

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
