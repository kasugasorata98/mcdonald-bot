#!/usr/bin/env bash
set -euo pipefail

echo "Running Jest tests..."
npm ci
npm test -- --runInBand
echo "Tests complete."
