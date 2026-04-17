#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# export $(grep -v '^#' /mnt/d/Dropbox/iremus.secret.env | xargs)
export $(grep -v '^#' /Users/amleth/Dropbox/iremus.secret.env | xargs)

deno --allow-env --allow-net --allow-read --unsafely-ignore-certificate-errors \
  "$SCRIPT_DIR/../grist-doc-to-rdf.ts" \
  --grist-api-key $GRIST_API_KEY \
  --grist-base https://musicodb.sorbonne-universite.fr/api \
  --grist-doc-id 8VWLsRZzwXwB \
  -t Morceaux_Analyses -t Musiciens -t Batidas -t Categories_de_funk -t Samples