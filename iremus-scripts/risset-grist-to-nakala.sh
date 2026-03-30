#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# export $(grep -v '^#' /mnt/d/Dropbox/iremus.secret.env | xargs)
export $(grep -v '^#' /Users/amleth/Dropbox/iremus.secret.env | xargs)

deno --allow-env --allow-net --allow-read --unsafely-ignore-certificate-errors \
  "$SCRIPT_DIR/../sherlock-grist-to-nakala.ts" \
  --nakala-api-base apitest.nakala.fr \
  --nakala-api-key $NAKALA_API_KEY \
  --grist-api-key $GRIST_API_KEY \
  --grist-base https://musicodb.sorbonne-universite.fr/api \
  --grist-doc-id 6mXv99bFH9FP \
  --grist-table-id Test \
  --files-dir "/Users/amleth/Dropbox/_temp/Risset_plat" # --files-dir "/mnt/d/Dropbox/_temp/Risset_plat"