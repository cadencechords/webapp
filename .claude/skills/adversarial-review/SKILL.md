---
name: adversarial-review
description: Adversarially review a branch before opening a pull request. Independent reviewer agents attack the diff from separate angles, a skeptic pass verifies each finding, confirmed problems get fixed, and a passing review is recorded for the exact commit. Required before any PR in this repo; the require-adversarial-review hook blocks PR creation without it. Use when about to open a PR, or when asked to review a branch adversarially.
---

# Adversarial review before a PR

The author of a change is the worst person to judge it. This review assumes
the branch is wrong and tries to prove it: fresh-context reviewers attack the
diff, a separate pass tries to disprove each finding, and only what survives
counts. A PR can't be opened until a passing review is recorded for the
**exact commit** it will contain. `.claude/hooks/require-adversarial-review.mjs`
enforces this for the GitHub MCP `create_pull_request` tool and `gh pr create`.

## 0. Preconditions

- Everything is committed and pushed. `git status` is clean, and
  `origin/<branch>` equals `HEAD`.
- You know the **base** the PR will target (for a stacked PR, the branch below
  it) and the **intent**: the Linear issue's scope and acceptance criteria.

## 1. Mechanical checks (fail fast)

Run each one and record `pass` or `fail`:

```bash
yarn typecheck && yarn lint && yarn format:check && yarn vitest run && yarn build
```

Fix any failure before going on. A reviewer's time is wasted on a branch that
CI would reject anyway.

## 2. Attack: independent reviewers

Collect the inputs:

- the diff (`git diff <base>...HEAD`) and its stats
- the commit list (`git log <base>..HEAD`)
- the intent, and the PR description you plan to write

Then launch reviewer agents **in parallel**, one per lens, each with a
fresh context (the `Agent` tool, `general-purpose`). **Don't** pass them your
own reasoning or conclusions; they must judge from the code alone. Give each
one the base, the branch, the intent, the draft PR description, and its lens:

| Lens            | What it attacks                                                                                                                                                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Correctness** | Runtime failures, edge cases (empty, null, large, concurrent, first run), broken callers of changed code, and behavior changes where the PR claims none. The redesign projects promise "looks different, works the same", so hunt for anything that works differently. |
| **Tests & CI**  | Would CI reject this? Do the tests actually exercise the claim, or pass vacuously? Were errors hidden rather than fixed: `typecheck --update`, new ESLint suppressions, `test.skip`, loosened assertions? Is anything important untested?                              |
| **Integration** | Build and deploy (Vite output, `build/` for Netlify, env vars), dependencies and lockfile, generated files out of sync, stored or user data, security (secrets, XSS, `dangerouslySetInnerHTML`, auth headers), and effects on other PRs in the stack.                  |
| **Honesty**     | Does the PR description match the diff? Look for unverified claims ("no visual change", "all tests pass"), silent scope changes, leftover debug code or TODOs, and mentions of work that wasn't done.                                                                  |

For a small diff (under ~100 changed lines), one agent may cover Correctness +
Integration and another Tests + Honesty. Never use fewer than two.

Instruct every reviewer:

> Assume the author is wrong. Report only problems you can tie to a specific
> `file:line` with a concrete failure scenario (inputs or state → wrong
> result). Rate each **blocker** (breaks CI, users or data), **major** (wrong
> behavior, or a false claim in the PR) or **minor** (worth fixing, not
> dangerous). No style nits; the formatter and linter own style. If you find
> nothing real, say so; don't pad the list.

## 3. Verify: try to disprove every blocker and major

For each blocker or major finding, launch a separate skeptic agent. Give it
the finding and the branch, and ask it to **refute** it: read the code, run
the relevant test or script, reproduce if possible. It returns `confirmed`
(with evidence) or `refuted` (with the reason). Treat "can't tell" as
confirmed. Minors don't need verification.

## 4. Resolve

- **Confirmed blockers and majors:** fix them, commit, push. The commit
  changed, so the review so far covers an old commit: repeat steps 1–3 on the
  new `HEAD`. You may scope the reviewers to the files your fixes touched,
  plus anything that calls them.
- **Minors:** fix them now if they're cheap. Otherwise list them in the PR
  description under "Known follow-ups".
- **Refuted findings:** keep them in the summary with the reason. They show
  the review was actually adversarial.

Stop when a round produces no confirmed blocker or major finding.

## 5. Record

Write the summary to a temp file (not in the repo) and record it:

```json
{
  "base": "<base branch>",
  "lenses": ["correctness", "tests", "integration", "honesty"],
  "rounds": 2,
  "checks": {
    "typecheck": "pass",
    "lint": "pass",
    "format": "pass",
    "tests": "pass",
    "build": "pass"
  },
  "findings": [
    {
      "lens": "correctness",
      "severity": "major",
      "summary": "…",
      "location": "src/…:42",
      "verdict": "confirmed",
      "resolution": "fixed"
    },
    {
      "lens": "tests",
      "severity": "minor",
      "summary": "…",
      "location": "…",
      "verdict": "unverified",
      "resolution": "follow-up"
    }
  ]
}
```

```bash
node .claude/skills/adversarial-review/record.mjs pass /path/to/summary.json
```

`record.mjs` refuses to record `pass` in any of these cases:

- the tree is dirty
- `HEAD` isn't pushed
- a check failed
- a confirmed blocker or major finding isn't `fixed`

Records are stored under `.git/adversarial-reviews/<sha>.json`. They aren't
committed, and they only unlock that one commit.

## 6. Open the PR

Add an **Adversarial review** section to the PR description:

- the lenses and number of rounds
- each confirmed finding and how it was fixed
- refuted findings, with one line each on why
- minors deferred as follow-ups

Then open the PR. The hook checks the record for the head commit. If you
push again later, a PR that's already open isn't blocked, but review the new
commits with the same process before asking for another review.
