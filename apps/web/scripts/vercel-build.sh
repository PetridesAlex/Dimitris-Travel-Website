#!/usr/bin/env bash
# Vercel build for apps/web (Root Directory must be apps/web).
# If the dashboard still has Output Directory = "apps/web/.next",
# Vercel looks under apps/web/apps/web/.next — so we mirror .next there.
set -euo pipefail

npm run build

mkdir -p apps/web
rm -rf apps/web/.next
cp -a .next apps/web/.next
