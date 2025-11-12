#!/usr/bin/env bash
set -euo pipefail
REPO_SSH="$1"
git init
git add .
git commit -m "feat: Barista Pro — Full Build"
git branch -M main
git remote add origin "$REPO_SSH"
git push -u origin main
