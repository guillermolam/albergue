#!/usr/bin/env bash
# Validate GitHub workflows, composite actions, and CI scripts
set -euo pipefail

echo "🔍 Validating GitHub workflows and actions..."

echo "🧰 Installing zizmor..."
./.github/scripts/install-zizmor.sh

echo "🔐 Running zizmor security analysis..."
./.github/scripts/run-zizmor.sh

echo "📐 Installing and running actionlint..."
./.github/scripts/install-actionlint.sh
./.github/scripts/run-actionlint.sh

echo "🐚 Installing and running shellcheck..."
./.github/scripts/install-shellcheck.sh
shellcheck .github/scripts/*.sh

# Validate pinned actions still match latest release SHAs
echo "📌 Checking pinned action SHAs..."
./.github/scripts/check-action-sha-updates.sh

# Check that all scripts are executable
echo "🚀 Checking script permissions..."
for script in .github/scripts/*.sh; do
	if [[ -x ${script} ]]; then
		echo "✅ ${script} is executable"
	else
		echo "❌ ${script} is not executable"
		exit 1
	fi
done

# Validate YAML syntax for every workflow and composite action
echo "📝 Validating YAML syntax..."
for yaml in .github/workflows/*.yml .github/actions/*/action.yml; do
	if python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" "${yaml}" 2>/dev/null; then
		echo "✅ ${yaml} has valid YAML syntax"
	else
		echo "❌ ${yaml} has invalid YAML syntax"
		exit 1
	fi
done

echo "🎉 All workflows, actions, and scripts are valid!"
