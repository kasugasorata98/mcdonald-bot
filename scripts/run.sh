#!/usr/bin/env bash
set -euo pipefail

echo "Running CLI..."
npm run build
node dist/index.js
echo "CLI finished. Output in result.txt"
