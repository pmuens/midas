#!/bin/sh

PROJECT_NAME=midas
DESTINATION=~/Desktop/backups
SCRIPT_DIR_PATH=$(cd "$(dirname "$0")" || exit; pwd)

timestamp=$(date +%s)
filename=$timestamp-$PROJECT_NAME.7z

docker run --rm --workdir /data -it -v "$SCRIPT_DIR_PATH"/../:/data crazymax/7zip:latest \
  7za a -p -xr!tmp -xr!node_modules -mhe=on "$filename" . && \
  mkdir -p $DESTINATION && \
  mv "$filename" $DESTINATION
