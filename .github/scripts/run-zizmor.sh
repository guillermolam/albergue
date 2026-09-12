#!/usr/bin/env bash
set -euo pipefail

zizmor --no-progress --pedantic .github/workflows/*.yml .github/actions/**/*.yml
