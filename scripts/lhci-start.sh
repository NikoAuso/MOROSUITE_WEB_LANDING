#!/usr/bin/env bash
set -euo pipefail

# Launches the mock backend in background, then the SSR Node server in
# foreground. Used by Lighthouse CI (lighthouserc.json startServerCommand).
# When the SSR server exits / is killed, the trap cleans up the mock backend.

MOCK_BACKEND_PORT="${MOCK_BACKEND_PORT:-8765}"
MOCK_BACKEND_TOKEN="${MOCK_BACKEND_TOKEN:-test-token}"
MOCK_BACKEND_REQUIRE_AUTH="${MOCK_BACKEND_REQUIRE_AUTH:-true}"

MOCK_BACKEND_PORT="$MOCK_BACKEND_PORT" \
MOCK_BACKEND_TOKEN="$MOCK_BACKEND_TOKEN" \
MOCK_BACKEND_REQUIRE_AUTH="$MOCK_BACKEND_REQUIRE_AUTH" \
  node tests/e2e/fixtures/mock-backend.mjs &
MOCK_PID=$!
trap "kill $MOCK_PID 2>/dev/null || true" EXIT INT TERM

# Wait briefly for the mock to bind its port.
sleep 0.5

# Do NOT use `exec` here: it replaces this bash shell with node, which
# disarms the EXIT trap above and would leak the mock-backend as an orphan
# bound to its port if Lighthouse tears down the server group.
HOST="${HOST:-127.0.0.1}" \
PORT="${PORT:-4321}" \
API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:${MOCK_BACKEND_PORT}/api/public/v1}" \
API_AUTH_TOKEN="${API_AUTH_TOKEN:-$MOCK_BACKEND_TOKEN}" \
PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-http://127.0.0.1:${PORT:-4321}}" \
CACHE_TTL_SECONDS="${CACHE_TTL_SECONDS:-60}" \
  node ./dist/server/entry.mjs
