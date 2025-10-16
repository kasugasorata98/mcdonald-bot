#!/usr/bin/env bash
set -euo pipefail

echo "Building TypeScript..."
npm ci
npm run build
echo "Build complete."
