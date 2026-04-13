#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

# export $(grep -v '^#' /mnt/d/Dropbox/iremus.secret.env | xargs)
export $(grep -v '^#' /Users/amleth/Dropbox/iremus.secret.env | xargs)

deno --allow-env --allow-net --allow-read --unsafely-ignore-certificate-errors \
    $SCRIPT_DIR/../sherlock-grist-opentheso-preflabels-to-uri.ts \
    --grist-api-key $GRIST_API_KEY \
    --grist-base https://musicodb.sorbonne-universite.fr/api \
    --grist-doc-id 4NmEJA4z9EUB \
    --grist-table-id MG_Estampes \
    --grist-column-id Objets_representes \
    --opentheso-thesaurus-url https://opentheso.huma-num.fr/?idt=mercure-galant-estampes