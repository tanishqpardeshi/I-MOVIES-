#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm install --no-audit --no-fund --package-lock=false
npm run build
npm test
