#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# export $(grep -v '^#' /mnt/d/Dropbox/iremus.secret.env | xargs)
export $(grep -v '^#' /Users/amleth/Dropbox/iremus.secret.env | xargs)

deno --allow-env --allow-net --allow-read --allow-write --unsafely-ignore-certificate-errors \
  "$SCRIPT_DIR/../neuma-get-corpus.ts" \
    --neuma-corpus-id "all:airs:timbres:cdc" \
    --out ./out/cdc/ \