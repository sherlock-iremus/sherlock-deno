#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

export $(grep -v '^#' /Users/iremus/Dev/sherlock-deno/.env | xargs)

deno --allow-env --allow-net --allow-read --unsafely-ignore-certificate-errors \
    $SCRIPT_DIR/../sherlock-grist-opentheso-preflabels-to-uri.ts \
    --grist-api-key $GRIST_API_KEY \
    --grist-base https://musicodb.sorbonne-universite.fr/api \
    --grist-doc-id 4NmEJA4z9EUB \
    --grist-table-id Indexation_refar_lieux \
    --grist-preflabel-column-id architecture_prefLabel \
    --grist-opentheso-url-column-id architecture \
    --opentheso-thesaurus-id iconographie-musicale \
    --test-mode false

exit 1
