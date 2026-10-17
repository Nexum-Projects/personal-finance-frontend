#!/usr/bin/env bash
# Analyzes the repo with sonar-scanner-cli (Docker) against a SonarQube instance.
# Creates the SonarQube project on first run if it does not exist.
# Required env vars: SONAR_HOST_URL, SONAR_TOKEN
# Optional: SONAR_PROJECT_VERSION (defaults to package.json version)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${SONAR_HOST_URL:?SONAR_HOST_URL is required (e.g. http://localhost:9000)}"
: "${SONAR_TOKEN:?SONAR_TOKEN is required}"

PROJECT_KEY="personal-finance-frontend"
PROJECT_NAME="Personal Finance Frontend"
VERSION="${SONAR_PROJECT_VERSION:-$(node -p "require('./package.json').version")}"
# Inside the container, localhost is the container itself.
SCANNER_HOST_URL="${SONAR_HOST_URL/localhost/host.docker.internal}"

if ! curl -s -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/projects/search?projects=$PROJECT_KEY" \
  | grep -q "\"key\":\"$PROJECT_KEY\""; then
  echo "==> Creating SonarQube project '$PROJECT_KEY'..."
  curl -s -f -X POST -u "$SONAR_TOKEN:" "$SONAR_HOST_URL/api/projects/create" \
    --data-urlencode "project=$PROJECT_KEY" \
    --data-urlencode "name=$PROJECT_NAME" \
    --data-urlencode "mainBranch=main" > /dev/null
fi

echo "==> Running SonarQube analysis (version $VERSION)..."
docker run --rm \
  -e SONAR_HOST_URL="$SCANNER_HOST_URL" \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -v "$ROOT:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectVersion="$VERSION" -Dsonar.qualitygate.wait=true || true

echo "==> Quality Gate..."
curl -s -u "$SONAR_TOKEN:" \
  "$SONAR_HOST_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY" \
  | python3 -m json.tool

echo "==> Done. Check results at $SONAR_HOST_URL/dashboard?id=$PROJECT_KEY"
