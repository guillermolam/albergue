# GitHub Actions Security Remediation

Security remediation of the CI/CD pipeline using zizmor (pedantic, `--no-ignores`), actionlint (no `-ignore`), and shellcheck. Final state: **zero findings** from all three tools. No stage is skipped. No warning is suppressed.

## Issues Fixed

### High

- **Unpinned service image**: `postgres:15` in the CI database job is pinned to a SHA256 digest (`postgres:15@sha256:9b1d34ad…`).

### Medium

- **Excessive permissions**: the reusable workflow declares `permissions: {}` at workflow level; every caller job declares its own minimal permissions.

### Low / hygiene

- **Missing concurrency limits**: `ci.yml`, `nightly.yml`, `github-actions-security.yml` declare `concurrency` groups (cancel-in-progress for CI, serialized for nightly).
- **Undocumented permissions**: every non-trivial permission carries a trailing explanatory comment (zizmor requires trailing comments).
- **Self-repository references**: all same-repo action/workflow references use GitHub `$/` syntax (recommended since 2026-07-30; resolves at the running commit).

### Script correctness bugs found by local green-run verification

- **`set -e` + `((count++))`**: post-increment returns 0 on first iteration, so `set -e` killed the script after the first migration. Replaced with `count=$((count + 1))`.
- **`while read` + process substitution feeding `psql`**: the loop body shares stdin with the tag stream. Replaced with a `for` loop over a pre-collected list.
- **SC2001**: `sed`-based SQL IN-list replaced with pure-bash `printf` expansion.

## Actions Pinned (SHA verified against tags)

| Action             | Version         | SHA (dereferenced commit)                | Status   |
| ------------------ | --------------- | ---------------------------------------- | -------- |
| actions/checkout   | v7.0.1 (latest) | 3d3c42e5aac5ba805825da76410c181273ba90b1 | verified |
| actions/setup-node | v7.0.0 (latest) | 820762786026740c76f36085b0efc47a31fe5020 | verified |
| actions/setup-go   | v7.0.0 (latest) | b7ad1dad31e06c5925ef5d2fc7ad053ef454303e | verified |
| pnpm/action-setup  | v6.1.0 (latest) | ea17c68df8912ef543352723c149a84f56e3d413 | verified |

Pins use the dereferenced commit SHA (annotated tag objects are resolved through `git/tags`). `check-action-sha-updates.sh` re-verifies latest-tag + SHA + version comment on every validation run and fails on drift.

Releases are created with the `gh` CLI (`create-nightly-release.sh`). No third-party release action.

## Architecture

### Composite action

- `.github/actions/setup-node-pnpm` — pnpm + Node + cache + frozen-lockfile install.

### Reusable workflow

- `_reusable-frontend-setup.yml` — checkout → setup → optional Playwright → allowlisted script under `.github/scripts/`. Used by `frontend-quality`, `frontend-builds` (matrix), and nightly `validate`.

### Externalized scripts (`.github/scripts/`)

All multi-line logic lives in shellchecked, executable scripts. Workflows only invoke those scripts.

| Script                                                      | Purpose                                                             |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `run-frontend-quality.sh`                                   | format, type-check, astro check, e2e                                |
| `build-frontend-target.sh`                                  | per-target build (cloudflare/netlify/stormkit)                      |
| `run-backend-checks.sh`                                     | domain-model + api-contract build, backend type-check, tests        |
| `apply-migrations.sh`                                       | journaled Drizzle migrations, in order                              |
| `verify-database-schema.sh`                                 | authoritative tables/columns assertions                             |
| `run-nightly-validation.sh`                                 | nightly dependency validation build                                 |
| `count-dependabot-prs.sh` / `auto-merge-dependabot-prs.sh`  | dependency PR automation                                            |
| `generate-nightly-version.sh` / `create-nightly-release.sh` | nightly tag + `gh release create`                                   |
| `deploy-cloudflare.sh`                                      | `wrangler deploy`                                                   |
| `install-playwright.sh`                                     | Chromium + OS deps for e2e                                          |
| `run-called-script.sh`                                      | allowlist gate for reusable-workflow script dispatch                |
| `install-zizmor.sh` / `install-actionlint.sh`               | pinned-version tool installers                                      |
| `run-zizmor.sh` / `run-actionlint.sh`                       | linter entrypoints (no ignore flags)                                |
| `check-action-sha-updates.sh`                               | fails on pin drift: latest tag, dereferenced SHA, version comment   |
| `validate-workflows.sh`                                     | zizmor + actionlint + shellcheck + pin check + executability + YAML |

## Permission model

```yaml
permissions:
  contents: read # default everywhere
  pull-requests: read # dependabot counting only
  pull-requests: write # auto-merge only
  contents: write # nightly release creation only
```

All checkouts use `persist-credentials: false`.

## actionlint and `$/`

Released actionlint v1.7.12 cannot parse `$/`. Rather than `-ignore` those diagnostics, `install-actionlint.sh` builds rhysd/actionlint#732 at pinned commit `b02c24b743cc88a26b280339814eb4ece91c32cb` (verified via `refs/pull/732/head`). `run-actionlint.sh` passes no ignore flags. Switch to a released tag when 1.7.13+ ships that commit.

zizmor is pinned to 1.30.0 (`cargo install --locked --version 1.30.0`).

## Verification

`./.github/scripts/validate-workflows.sh` — zizmor pedantic `--no-ignores`: no findings; actionlint: clean, no ignores; shellcheck: clean; pin check: latest SHAs; all scripts executable; all YAML valid.
