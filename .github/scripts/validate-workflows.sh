#!/usr/bin/env bash
# Validate GitHub workflows and actions
set -euo pipefail

echo "🔍 Validating GitHub workflows and actions..."

# Check if zizmor is installed
if ! command -v zizmor >/dev/null 2>&1; then
    echo "❌ zizmor not found. Install with: cargo install zizmor"
    exit 1
fi

# Run zizmor security analysis
echo "🔐 Running zizmor security analysis..."
if zizmor .github/workflows/; then
    echo "✅ All workflows pass security analysis"
else
    echo "❌ Security issues found in workflows"
    exit 1
fi

# Check that all scripts are executable
echo "🚀 Checking script permissions..."
scripts=(
    ".github/scripts/apply-migrations.sh"
    ".github/scripts/verify-database-schema.sh" 
    ".github/scripts/count-dependabot-prs.sh"
    ".github/scripts/auto-merge-dependabot-prs.sh"
    ".github/scripts/generate-nightly-version.sh"
)

for script in "${scripts[@]}"; do
    if [[ -x "$script" ]]; then
        echo "✅ $script is executable"
    else
        echo "❌ $script is not executable"
        exit 1
    fi
done

# Validate workflow YAML syntax
echo "📝 Validating workflow YAML syntax..."
workflows=(
    ".github/workflows/ci.yml"
    ".github/workflows/nightly.yml"
    ".github/workflows/_reusable-frontend-setup.yml"
)

for workflow in "${workflows[@]}"; do
    if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" 2>/dev/null; then
        echo "✅ $workflow has valid YAML syntax"
    else
        echo "❌ $workflow has invalid YAML syntax"
        exit 1
    fi
done

# Check composite action
echo "🔧 Validating composite action..."
action=".github/actions/setup-node-pnpm/action.yml"
if python3 -c "import yaml; yaml.safe_load(open('$action'))" 2>/dev/null; then
    echo "✅ $action has valid YAML syntax"
else
    echo "❌ $action has invalid YAML syntax"
    exit 1
fi

echo "🎉 All workflows and actions are valid!"