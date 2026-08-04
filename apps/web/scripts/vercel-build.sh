#!/usr/bin/env bash
# Vercel build for apps/web (Root Directory = apps/web).
# Also creates apps/web/.next → .next if the project still has a
# stale Output Directory override of "apps/web/.next".
set -euo pipefail

npm run build

mkdir -p apps/web
if [[ ! -e apps/web/.next ]]; then
  ln -sfn "$PWD/.next" apps/web/.next
fi
