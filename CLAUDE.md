# Cadence web app

React 17 + Vite, Tailwind v4, Vitest. See `README.md`, `docs/design-tokens.md`
and `docs/icons.md`.

## Checks (same as CI)

```bash
yarn typecheck      # TypeScript over the JS; fails only on errors beyond typecheck-baseline.json
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
