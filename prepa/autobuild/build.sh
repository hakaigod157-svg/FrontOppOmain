#!/usr/bin/env bash

set -eou pipefail

export PATH="$HOME/bin:$PATH"
TARGET_DIR="$HOME/target"
VERSION="${2-0.1}"

echo "*** Generating config.js ***"
cd frontend_prepa/prepa
sed "s#SERVER_URL:.*#SERVER_URL: \"http://192.168.130.6:12800/\","# < src/utils/config.js.template > src/utils/config.js

echo "*** Generating version.js ***"
sed -i "s#APP_VERSION:.*#APP_VERSION: \"${VERSION}\",#" src/utils/version.js

echo "*** npm install ***"
npm i

echo "*** npm run build ***"
npm run build

echo "*** file list ***"
ls -lh dist/

echo "*** deploying to webroot ***"
mkdir -p "$TARGET_DIR/frontend/"
rsync -av --delete dist/ "$TARGET_DIR/frontend/" 

#echo "*** npm run build (simul) ***"
#sed "s#SERVER_URL:.*#SERVER_URL: \"http://192.168.130.6:12082/\","# < src/utils/config.js.template > src/utils/config.js
#sed -i "s#APP_VERSION:.*#APP_VERSION: \"${VERSION}-simul\",#" src/utils/version.js
#sed -i "s#publicPath:.*#publicPath: '/erpo-simul/',#g" vue.config.js
#npm run build

#echo "*** deploying to webroot (simul) ***"
#mkdir -p "$TARGET_DIR/frontend-simul/"
#rsync -av --delete dist/ "$TARGET_DIR/frontend-simul/" 

echo "*** done ***"


