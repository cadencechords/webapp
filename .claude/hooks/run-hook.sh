#!/bin/sh
# Runs require-adversarial-review.mts and fails closed: Claude Code only blocks
# a tool call on exit 2, so a crash, a missing `node` or any other exit code
# would otherwise let the PR through.
input=$(cat)

# Fast path: a Bash command that doesn't mention gh can't open a PR.
case "$input" in
*'"tool_name":"Bash"'* | *'"tool_name": "Bash"'*)
  case "$input" in *gh*) ;; *) exit 0 ;; esac
  ;;
esac

printf '%s' "$input" | node "$(dirname "$0")/require-adversarial-review.mts"
status=$?
if [ "$status" -eq 0 ] || [ "$status" -eq 2 ]; then
  exit "$status"
fi
echo "Blocked: the adversarial review hook failed (exit $status; is node on PATH?), so the PR is blocked to be safe." >&2
exit 2
