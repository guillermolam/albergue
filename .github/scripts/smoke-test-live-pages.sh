#!/usr/bin/env bash
# Post-deploy smoke test: hits known-fragile pages on the live frontend
# Worker and fails the pipeline if any of them hang (catches the Workers
# platform request-timeout class of bug from the Sept 2026 Worker-to-Worker
# binding investigation, where a broken fetch path didn't error -- it hung
# for ~30s until Cloudflare killed the request) or show a known backend
# failure message baked into their error UI. This is what should have
# caught that regression automatically instead of a human noticing it live.
set -euo pipefail

base_url=${1:?"Usage: $0 <base-url> (e.g. https://albergue.alberguecarrascalejo.workers.dev)"}
max_time_seconds=15

# path | substring that indicates a backend failure on that page
checks=(
	"area/visit/|Could not load places"
	"area/eat/|Could not load places"
	"area/do/|Could not load some content"
	"hostel/services/|Could not load hostel services"
)

failures=0

for check in "${checks[@]}"; do
	path="${check%%|*}"
	needle="${check#*|}"
	url="${base_url%/}/${path}?_=$(date +%s%N)"

	response=$(curl -s -o /tmp/smoke-response.html -w '%{http_code} %{time_total}' \
		--max-time "$max_time_seconds" "$url" || echo "CURL_FAILED 0")
	status="${response%% *}"
	time_total="${response##* }"

	if [[ $status == "CURL_FAILED" ]]; then
		echo "FAIL  $path -- request timed out or failed to complete within ${max_time_seconds}s"
		failures=$((failures + 1))
		continue
	fi

	if [[ $status != "200" ]]; then
		echo "FAIL  $path -- HTTP $status (expected 200)"
		failures=$((failures + 1))
		continue
	fi

	if grep -qF "$needle" /tmp/smoke-response.html; then
		echo "FAIL  $path -- page rendered its \"$needle\" backend-failure message (${time_total}s)"
		failures=$((failures + 1))
		continue
	fi

	echo "OK    $path (${time_total}s)"
done

rm -f /tmp/smoke-response.html

if [[ $failures -gt 0 ]]; then
	echo ""
	echo "$failures of ${#checks[@]} smoke check(s) failed."
	exit 1
fi

echo ""
echo "All ${#checks[@]} smoke checks passed."
