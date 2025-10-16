#!/bin/bash

echo "Running CLI..."
npm run build
node dist/index.js
echo "CLI finished. Output in scripts/result.txt"
