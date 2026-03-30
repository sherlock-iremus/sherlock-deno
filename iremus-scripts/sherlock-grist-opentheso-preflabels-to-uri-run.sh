#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

export $(grep -v '^#' .env | xargs)

deno --allow-net --allow-env --allow-read --unsafely-ignore-certificate-errors \
    $SCRIPT_DIR/../sherlock-grist-opentheso-preflabels-to-uri.ts \
    --grist_api_key $GRIST_API_KEY \
    --grist_doc_id 4NmEJA4z9EUB \