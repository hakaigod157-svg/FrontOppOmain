#!/bin/bash

set -euo pipefail

###############################################################################
# CONFIG
###############################################################################

SERVER="192.168.130.6"
PORT="12022"
USER="root"

REMOTE_DIR="/opt/prepa/target/frontend-simul"

CONFIG_FILE="src/utils/config.js"
VERSION_FILE="src/utils/version.js"
VUE_CONFIG="vue.config.js"

VERSION=$(date +"%Y.%m.%d")

###############################################################################
# SSH CONTROL MASTER (IMPORTANT)
###############################################################################

SSH_SOCKET="/tmp/ssh_frontend_${SERVER}_${PORT}"

echo "*** Opening SSH session (1 password only) ***"

ssh -p "$PORT" -M -S "$SSH_SOCKET" -fnNT "$USER@$SERVER"

###############################################################################
# VALIDATION
###############################################################################

for f in "$CONFIG_FILE" "$VERSION_FILE" "$VUE_CONFIG"
do
    [[ -f "$f" ]] || { echo "Fichier manquant: $f"; exit 1; }
done

###############################################################################
# BACKUP
###############################################################################

cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"
cp "$VERSION_FILE" "${VERSION_FILE}.bak"
cp "$VUE_CONFIG" "${VUE_CONFIG}.bak"

restore() {
    echo "*** Restore files ***"
    mv -f "${CONFIG_FILE}.bak" "$CONFIG_FILE" 2>/dev/null || true
    mv -f "${VERSION_FILE}.bak" "$VERSION_FILE" 2>/dev/null || true
    mv -f "${VUE_CONFIG}.bak" "$VUE_CONFIG" 2>/dev/null || true
}

trap restore EXIT

###############################################################################
# SED (macOS + Linux)
###############################################################################

if [[ "$OSTYPE" == "darwin"* ]]; then
    SED_I=(-i '')
else
    SED_I=(-i)
fi

###############################################################################
# INSTALL
###############################################################################

echo "*** npm ci ***"
npm ci

###############################################################################
# BUILD MODIFICATIONS
###############################################################################

echo "*** Prepare SIMUL build ***"

sed "${SED_I[@]}" \
  's#SERVER_URL:.*#SERVER_URL: "http://192.168.130.6:12082/",#' \
  "$CONFIG_FILE"

sed "${SED_I[@]}" \
  "s#APP_VERSION:.*#APP_VERSION: \"${VERSION}-simul\",#" \
  "$VERSION_FILE"

sed "${SED_I[@]}" \
  "s#publicPath:.*#publicPath: '/erpo-simul/',#g" \
  "$VUE_CONFIG"

###############################################################################
# BUILD
###############################################################################

echo "*** npm run build ***"
npm run build

###############################################################################
# CREATE REMOTE DIR (reuse SSH session)
###############################################################################

echo "*** Create remote directory ***"

ssh -p "$PORT" -S "$SSH_SOCKET" "$USER@$SERVER" "mkdir -p $REMOTE_DIR"

###############################################################################
# DEPLOY (reuse same SSH session)
###############################################################################

echo "*** Deploy to Debian ***"

rsync -avz --delete \
  --chown=prepa:nogroup \
  -e "ssh -p $PORT -o ControlPath=$SSH_SOCKET" \
  dist/ \
  "$USER@$SERVER:$REMOTE_DIR/"

###############################################################################
# CLEAN SSH SESSION
###############################################################################

ssh -S "$SSH_SOCKET" -O exit "$USER@$SERVER" 2>/dev/null || true

echo "*** DONE SUCCESS ***"
