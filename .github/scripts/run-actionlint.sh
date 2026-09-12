#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

# actionlint (<= 1.7.12) predates GitHub's self-repository `$/` syntax
# (shipped 2026-07-30, runner >= 2.336.0) and reports it as an invalid
# action/workflow reference. GitHub documents `$/` as the *recommended*
# same-repository form, and zizmor audits for it — these two ignores filter
# exactly that parser false positive and nothing else.
# Changelog: https://github.blog/changelog/2026-07-30-reference-same-repository-actions-with-self-repository-syntax/
# Remove once actionlint supports `$/` natively.
actionlint -color \
  -ignore 'specifying action "\$/[^"]*" in invalid format' \
  -ignore 'reusable workflow call "\$/[^"]*" at "uses" is not following the format'
