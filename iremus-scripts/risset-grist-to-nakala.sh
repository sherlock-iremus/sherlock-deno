#!/bin/bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"

deno --allow-env --allow-net --allow-read --unsafely-ignore-certificate-errors \
  "$SCRIPT_DIR/../sherlock-grist-to-nakala.ts" \
  --env-file /mnt/d/Dropbox/iremus.env \
  --secret-env-file /mnt/d/Dropbox/iremus.secret.env