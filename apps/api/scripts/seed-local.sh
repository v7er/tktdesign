#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
SEED_DIR="seed/images"
echo "Applying D1 migrations (local)…"
pnpm exec wrangler d1 migrations apply tktdesign --local

echo "Seeding projects…"
pnpm exec wrangler d1 execute tktdesign --local --file=seed/projects.sql

put() {
	local key="$1"
	local file="$2"
	pnpm exec wrangler r2 object put "tktdesign-media/${key}" --file="$file" --local --content-type image/jpeg
}

echo "Uploading seed images to local R2…"
put "projects/p-govap/cover.jpg" "$SEED_DIR/p-govap.jpg"
put "projects/p-thuduc/cover.jpg" "$SEED_DIR/p-thuduc.jpg"
put "projects/p-tanbinh/cover.jpg" "$SEED_DIR/p-tanbinh.jpg"
put "projects/p-binhthanh/cover.jpg" "$SEED_DIR/p-binhthanh.jpg"
put "projects/p-tanphu/cover.jpg" "$SEED_DIR/p-tanphu.jpg"
put "projects/p-dian/cover.jpg" "$SEED_DIR/p-dian.jpg"

echo "Seed local xong."
